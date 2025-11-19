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
 * Carrega a guia CUSTOS da LOGISTICA2026.xlsx
 * e devolve:
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
 * Helper de exemplo:
 * retorna um pequeno resumo da linha "Meta Frete 2026" e "Média (P+T)".
 *
 * Pode ser plugado em gráfico tipo "Meta vs Real (Total Máquinas)".
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
 * Ela monta os objetos exatamente no formato esperado pelo componente:
 *
 *  - grafico01MetaVsReal: [{ item, meta, mediaAtual }]
 *  - grafico02SomaCustos: [{ item, somaProprio, somaTerceiro, qtdFrete }]
 *  - grafico03Terceiros:  [{ freteiro, valor }]
 *  - grafico04Proprio:    [{ frota, valor }]
 *  - grafico05Munck:      [{ cidade, valor }]
 *
 * Por enquanto só alimentamos G01 e G02 com o bloco "ANO FISCAL - 2026 (GERAL)".
 * Os demais ficam vazios até você decidir como quer quebrar os dados.
 */
export async function loadCustosMaquinas() {
  const { byTp } = await loadCustosTabelaGeral();

  const meta = byTp["Meta Frete 2026"] || {};
  const media = byTp["Média (P+T)"] || byTp["Media (P+T)"] || {};

  // GRAFICO 01 – META VS REAL (TOTAL MÁQUINAS)
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

  // GRAFICO 02 – SOMA PROPRIO x TERCEIRO + QTD FRETE
  // Usando linha "Média (P+T)" como base "real" de custos totais
  const grafico02SomaCustos = [
    {
      item: "TOTAL MÁQUINAS",
      somaProprio: toNumber(media["Soma Proprio"]),
      somaTerceiro: toNumber(media["Soma Terceiro"]),
      qtdFrete: toNumber(media["Qtd Frete"]),
    },
  ];

  // Ainda não mapeamos os detalhes de TERCEIROS / FROTA / MUNCK
  // com base nas colunas de MUNCK / MOTOBOY / TRANSPORTADORA,
  // então deixo os gráficos 03, 04 e 05 vazios mas tipados certinho.
  const grafico03Terceiros = [];
  const grafico04Proprio = [];
  const grafico05Munck = [];

  return {
    grafico01MetaVsReal,
    grafico02SomaCustos,
    grafico03Terceiros,
    grafico04Proprio,
    grafico05Munck,
  };
}

/**
 * Stubs só pra não quebrar as telas de Peças e Frota
 * enquanto você não pluga os novos ranges da planilha nelas.
 */

export async function loadCustosPecas() {
  return {
    grafico06PecasCourierPorLoja: [],
    grafico07TranspPC: [],
  };
}

export async function loadCustosFrota() {
  return {
    grafico08PorMotoBoy: [],
    grafico09PorTransportadora: [],
    grafico10GastosVW: [],
    grafico11GastosDAF: [],
    grafico12Aproveitamento: [],
  };
}
