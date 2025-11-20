// src/services/custosExcelService.js
import * as XLSX from "xlsx";

const BASE_URL = import.meta.env.BASE_URL || "/";

// Arquivo LOGISTICA2026.xlsx em public/data
const EXCEL_URL = `${BASE_URL}data/LOGISTICA2026.xlsx`;

// Guia usada para os gráficos de custos
const SHEET_NAME = "CUSTOS";

// Range da parte GERAL do ano fiscal (tabelão horizontal)
// Cabeçalho: B4:AL4
// Conteúdo:  B5:AL20
const RANGE_GERAL = "B4:AL20";

const READ_OPTS = {
  type: "array",
  cellDates: true,
  dense: true,
};

// Conversão básica pra número (aceita R$, ponto, vírgula, etc)
function toNumber(v) {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return v;

  if (typeof v === "string") {
    const s = v
      .replace(/R\$\s*/gi, "")
      .replace(/[^0-9,.\-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const n = Number(s);
    return Number.isNaN(n) ? 0 : n;
  }

  return 0;
}

/**
 * Carrega a guia CUSTOS da LOGISTICA2026.xlsx e devolve:
 *  - header: nomes de coluna (B4:AL4, já deduplicados)
 *  - rows: linhas de dados (B5:AL20) como objetos
 *  - byTp: map por valor de "TP" (Meta Frete 2026, Média (P+T), etc)
 */
export async function loadCustosTabelaGeral() {
  console.info("[custosExcel] Buscando LOGISTICA2026.xlsx em:", EXCEL_URL);

  const resp = await fetch(EXCEL_URL, { cache: "no-store" });
  if (!resp.ok) {
    const msg = `Falha ao buscar ${EXCEL_URL} (HTTP ${resp.status}).`;
    console.error("[custosExcel]", msg);
    throw new Error(msg);
  }

  const buf = await resp.arrayBuffer();
  const wb = XLSX.read(buf, READ_OPTS);

  const ws =
    wb.Sheets[SHEET_NAME] ||
    wb.Sheets[wb.SheetNames.find((n) => n === SHEET_NAME)] ||
    wb.Sheets[wb.SheetNames[0]];

  if (!ws) {
    const msg = `Guia "${SHEET_NAME}" não encontrada na LOGISTICA2026.xlsx.`;
    console.error("[custosExcel]", msg);
    throw new Error(msg);
  }

  // Lê só o range B4:AL20 como matriz (linha/coluna)
  const matrix = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
    raw: true,
    range: RANGE_GERAL,
  });

  if (!matrix.length) {
    console.warn("[custosExcel] Range B4:AL20 vazio na guia CUSTOS.");
    return { header: [], rows: [], byTp: {} };
  }

  // Primeira linha do range = cabeçalho (linha 4 da planilha)
  const headerRaw = matrix[0].map((c) => String(c || "").trim());

  // Deduplica cabeçalhos repetidos (R$, MOTOBOY, TRANSPORTADORA, etc)
  const used = {};
  const header = headerRaw.map((h) => {
    if (!h) return "";
    let key = h;
    if (used[key]) {
      used[key] += 1;
      key = `${key}_${used[key]}`;
    } else {
      used[key] = 1;
    }
    return key;
  });

  // Linhas reais de dados (B5:AL20)
  const dataRows = matrix.slice(1);

  const rows = dataRows
    .map((arr) => {
      const obj = {};
      header.forEach((key, idx) => {
        if (!key) return;
        obj[key] = arr[idx];
      });
      return obj;
    })
    // joga fora linha totalmente vazia (sem TP e sem qualquer outro valor)
    .filter((r) => {
      const hasTp = String(r["TP"] || "").trim().length > 0;
      const hasOther = Object.keys(r).some(
        (k) => k !== "TP" && r[k] != null && String(r[k]).trim() !== ""
      );
      return hasTp || hasOther;
    });

  // Mapa por TP (Meta Frete 2026, Média (P+T), etc)
  const byTp = {};
  for (const r of rows) {
    const tp = String(r["TP"] || "").trim();
    if (!tp) continue;
    byTp[tp] = r;
  }

  console.info(
    "[custosExcel] Tabela geral carregada:",
    rows.length,
    "linhas,",
    header.length,
    "colunas."
  );

  return { header, rows, byTp };
}

/**
 * Helper pequeno: resumo de Meta vs Média (Total Máquinas)
 */
export async function loadResumoMaquinasMetaVsReal() {
  const { byTp } = await loadCustosTabelaGeral();

  const meta = byTp["Meta Frete 2026"] || {};
  const media = byTp["Média (P+T)"] || byTp["Media (P+T)"] || {};

  const metaTotal =
    toNumber(meta["Soma Proprio"]) + toNumber(meta["Soma Terceiro"]);
  const realTotal =
    toNumber(media["Soma Proprio"]) + toNumber(media["Soma Terceiro"]);

  return [
    { label: "Meta Frete 2026", value: metaTotal },
    { label: "Média (P+T)", value: realTotal },
  ];
}

/**
 * Função usada pela tela <CustosMaquinas />
 *
 * Retorna:
 *  - grafico01MetaVsReal: [{ item, meta, mediaAtual }]
 *  - grafico02SomaCustos: [{ item, somaProprio, somaTerceiro, qtdFrete }]
 *  - grafico03Terceiros:  [{ freteiro, valor }]
 *  - grafico04Proprio:    [{ frota, valor }]
 *  - grafico05Munck:      [{ cidade, valor }]
 */
export async function loadCustosMaquinas() {
  const { rows, byTp } = await loadCustosTabelaGeral();

  const meta = byTp["Meta Frete 2026"] || {};
  const media = byTp["Média (P+T)"] || byTp["Media (P+T)"] || {};

  // ---------------- GRAFICO 01 – META VS REAL ----------------
  const metaTotal =
    toNumber(meta["Soma Proprio"]) + toNumber(meta["Soma Terceiro"]);
  const realTotal =
    toNumber(media["Soma Proprio"]) + toNumber(media["Soma Terceiro"]);

  const grafico01MetaVsReal = [
    {
      item: "TOTAL MÁQUINAS",
      meta: metaTotal,
      mediaAtual: realTotal,
    },
  ];

  // ---------------- GRAFICO 02 – SOMA PRÓPRIO x TERCEIRO + QTD FRETE ----------------
  // Aqui uso a linha "Meta Frete 2026" como TOTAL ANUAL
  const somaProprioTotal = toNumber(meta["Soma Proprio"]);
  const somaTerceiroTotal = toNumber(meta["Soma Terceiro"]);
  const qtdFreteTotal = toNumber(meta["Qtd Frete"]);

  const grafico02SomaCustos = [
    {
      item: "TOTAL MÁQUINAS",
      somaProprio: somaProprioTotal,
      somaTerceiro: somaTerceiroTotal,
      qtdFrete: qtdFreteTotal,
    },
  ];

  // ---------------- GRAFICO 03 – TERCEIROS ----------------
  // Usa colunas: TERCEIRO + Valor Total
  const terceirosMap = {};
  for (const r of rows) {
    const nome = String(r["TERCEIRO"] || "").trim();
    if (!nome) continue;
    const valor = toNumber(r["Valor Total"]);
    if (!valor) continue;
    terceirosMap[nome] = (terceirosMap[nome] || 0) + valor;
  }

  const grafico03Terceiros = Object.entries(terceirosMap)
    .map(([freteiro, valor]) => ({ freteiro, valor }))
    .sort((a, b) => b.valor - a.valor);

  // ---------------- GRAFICO 04 – FROTA PRÓPRIA ----------------
  // Usa colunas: Responsável + VALOR
  const frotaMap = {};
  for (const r of rows) {
    const frota = String(r["Responsável"] || "").trim();
    if (!frota) continue;
    const valor = toNumber(r["VALOR"]);
    if (!valor) continue;
    frotaMap[frota] = (frotaMap[frota] || 0) + valor;
  }

  const grafico04Proprio = Object.entries(frotaMap)
    .map(([frota, valor]) => ({ frota, valor }))
    .sort((a, b) => b.valor - a.valor);

  // ---------------- GRAFICO 05 – MUNCK ----------------
  // Usa colunas: MUNCK + primeiro "R$"
  const munckMap = {};
  for (const r of rows) {
    const cidade = String(r["MUNCK"] || "").trim();
    if (!cidade) continue;
    const valor = toNumber(r["R$"]);
    if (!valor) continue;
    munckMap[cidade] = (munckMap[cidade] || 0) + valor;
  }

  const grafico05Munck = Object.entries(munckMap)
    .map(([cidade, valor]) => ({ cidade, valor }))
    .sort((a, b) => b.valor - a.valor);

  return {
    grafico01MetaVsReal,
    grafico02SomaCustos,
    grafico03Terceiros,
    grafico04Proprio,
    grafico05Munck,
  };
}

/**
 * Peças / Frota ainda dependem de outras guias (FRETE PEÇAS, VW DAF, etc).
 * Por enquanto deixo stubs pra não quebrar as telas.
 */

export async function loadCustosPecas() {
  return {
    grafico06MotoBoyPC: [],
    grafico07TranspPC: [],
    grafico08PorMotoBoy: [],
    grafico09PorTransportadora: [],
  };
}

export async function loadCustosFrota() {
  return {
    grafico10GastosVW: [],
    grafico11GastosDAF: [],
    grafico12Aproveitamento: [],
  };
}
