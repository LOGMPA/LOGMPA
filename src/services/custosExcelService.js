// src/services/custosExcelService.js
import * as XLSX from "xlsx";

const BASE_URL = import.meta.env.BASE_URL || "/";

// Arquivo LOGISTICA2026.xlsx em public/data
const EXCEL_URL = `${BASE_URL}data/LOGISTICA2026.xlsx`;

// Guia usada para os gráficos de custos
const SHEET_NAME = "CUSTOS";

// Range fixo usado para todos os gráficos
// Cabeçalho: B4:AL4
// Dados:     B5:AL15
const RANGE_GERAL = "B4:AL15";

const READ_OPTS = {
  type: "array",
  cellDates: true,
  dense: true,
};

// Conversão básica pra número (aceita R$, ponto, vírgula, etc)
function toNumber(v) {
  if (v == null || v === "") return 0;
  if (typeof v === "number") {
    if (Number.isNaN(v)) return 0;
    return v;
  }
  if (typeof v === "string") {
    const s = v
      .replace(/R\$\s*/gi, "")
      .replace(/[^0-9,.\-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const n = Number(s);
    return Number.isNaN(n) ? 0 : n;
  }
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Lê a guia CUSTOS e devolve a matriz B4:AL15.
 *
 * matrix[0] => linha 4 (cabeçalho)
 * matrix[1] => linha 5
 * ...
 * matrix[11] => linha 15
 */
async function loadCustosMatrix() {
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

  const matrix = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
    raw: true,
    range: RANGE_GERAL,
  });

  if (!matrix || !matrix.length) {
    console.warn("[custosExcel] Range", RANGE_GERAL, "vazio na guia CUSTOS.");
    return [];
  }

  return matrix;
}

/**
 * Versão genérica em forma de tabela (caso algum outro lugar use).
 */
export async function loadCustosTabelaGeral() {
  const matrix = await loadCustosMatrix();
  if (!matrix.length) return { header: [], rows: [], byTp: {} };

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
    .filter((r) => {
      const values = Object.values(r);
      const hasAny = values.some((v) => v != null && String(v).trim() !== "");
      return hasAny;
    });

  const byTp = {};
  for (const r of rows) {
    const tp = String(r["TP"] || "").trim();
    if (!tp) continue;
    byTp[tp] = r;
  }

  return { header, rows, byTp };
}

/**
 * Pequeno helper: resumo Meta vs Média (TOTAL MÁQUINAS)
 */
export async function loadResumoMaquinasMetaVsReal() {
  const { grafico01MetaVsReal } = await loadCustosMaquinas();

  let metaTotal = 0;
  let realTotal = 0;

  for (const item of grafico01MetaVsReal) {
    metaTotal += toNumber(item.meta);
    realTotal += toNumber(item.mediaAtual);
  }

  return [
    { label: "Meta Frete 2026", value: metaTotal },
    { label: "Média (P+T)", value: realTotal },
  ];
}

/**
 * ============================
 *  TELA: CUSTOS MÁQUINAS
 * ============================
 *
 * 1º gráfico: TRANSPORTE MÁQUINAS - META VS REAL
 *   - Colunas: C4:H4
 *   - Meta Frete 2026: C5:H5
 *   - Média (P+T):     C6:H6
 *
 * 2º gráfico: TRANSPORTE MÁQUINAS - CUSTO POR TIPO
 *   - Nome (Equipamento): I5:I10
 *   - Soma Proprio:       J5:J10
 *   - Soma Terceiro:      K5:J10
 *   - Qtd Frete:          L5:L10
 *
 * 3º gráfico: TRANSPORTE MÁQUINAS - CUSTO COM TERCEIROS
 *   - Nome:       M5:M15
 *   - Valor Total: N5:N15
 *   - Total KM:    O5:O15
 *
 * 4º gráfico: CUSTOS - UTILIZAÇÃO DE MUNCK
 *   - Nome:  P5:P15
 *   - Valor: Q5:Q15
 */
export async function loadCustosMaquinas() {
  const matrix = await loadCustosMatrix();
  if (!matrix.length) {
    return {
      grafico01MetaVsReal: [],
      grafico02SomaCustos: [],
      grafico03Terceiros: [],
      grafico04Proprio: [],
      grafico05Munck: [],
    };
  }

  const header = matrix[0];

  // 1º gráfico – META vs REAL (C/H, linhas 5 e 6 => índices 1 e 2)
  const rowMeta = matrix[1] || [];
  const rowMedia = matrix[2] || [];
  const grafico01MetaVsReal = [];

  for (let idx = 1; idx <= 6 && idx < header.length; idx++) {
    const label = String(header[idx] || "").trim();
    if (!label) continue;

    const meta = toNumber(rowMeta[idx]);
    const mediaAtual = toNumber(rowMedia[idx]);

    if (!meta && !mediaAtual) continue;

    grafico01MetaVsReal.push({
      item: label,
      meta,
      mediaAtual,
    });
  }

  // 2º gráfico – CUSTO POR TIPO (linhas 5 a 10)
  // Equipamento: col I => índice 7
  // Soma Proprio: col J => índice 8
  // Soma Terceiro: col K => índice 9
  // Qtd Frete: col L => índice 10
  const grafico02SomaCustos = [];

  for (let r = 1; r < matrix.length && r <= 6; r++) {
    const row = matrix[r] || [];
    const nome = String(row[7] || "").trim();
    if (!nome) continue;

    const somaProprio = toNumber(row[8]);
    const somaTerceiro = toNumber(row[9]);
    const qtdFrete = toNumber(row[10]);

    if (!somaProprio && !somaTerceiro && !qtdFrete) continue;

    grafico02SomaCustos.push({
      item: nome,
      somaProprio,
      somaTerceiro,
      qtdFrete,
    });
  }

  // 3º gráfico – CUSTO COM TERCEIROS
  // Nome (TERCEIRO): col M => índice 11
  // Valor Total: col N => índice 12
  // Total KM: col O => índice 13
  const grafico03Terceiros = [];

  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r] || [];
    const nome = String(row[11] || "").trim();
    if (!nome) continue;

    const valor = toNumber(row[12]);
    const km = toNumber(row[13]);

    if (!valor && !km) continue;

    grafico03Terceiros.push({
      freteiro: nome,
      valor,
      km,
    });
  }

  // 4º gráfico – UTILIZAÇÃO DE MUNCK (pizza)
  // Nome (cidade): col P => índice 14
  // Valor (R$):    col Q => índice 15
  const grafico05Munck = [];

  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r] || [];
    const cidade = String(row[14] || "").trim();
    if (!cidade) continue;

    const valor = toNumber(row[15]);
    if (!valor) continue;

    grafico05Munck.push({
      cidade,
      valor,
    });
  }

  return {
    grafico01MetaVsReal,
    grafico02SomaCustos,
    grafico03Terceiros,
    // por enquanto não temos um gráfico específico de frota própria aqui
    grafico04Proprio: [],
    grafico05Munck,
  };
}

/**
 * ============================
 *  TELA: CUSTOS PEÇAS
 * ============================
 *
 * 1º gráfico: TRANSPORTE PEÇAS - CUSTO COURIER (LOJA)
 *   - Nome:  R5:R15
 *   - Valor: S5:S15
 *
 * 2º gráfico: TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA (LOJA)
 *   - Nome:  T5:T15
 *   - Valor: U5:U15
 *
 * 3º gráfico: TRANSPORTE PEÇAS - CUSTO COURIER
 *   - Nome:  V5:V15
 *   - Valor: W5:W15
 *
 * 4º gráfico: TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA
 *   - Nome:  X5:X15
 *   - Valor: Y5:Y15
 */
export async function loadCustosPecas() {
  const matrix = await loadCustosMatrix();
  if (!matrix.length) {
    return {
      grafico06MotoBoyPC: [],
      grafico07TranspPC: [],
      grafico08PorMotoBoy: [],
      grafico09PorTransportadora: [],
    };
  }

  const grafico06MotoBoyPC = [];
  const grafico07TranspPC = [];
  const grafico08PorMotoBoy = [];
  const grafico09PorTransportadora = [];

  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r] || [];

    // 1) Courier por loja (R/S => índices 16/17)
    const cidadeCourier = String(row[16] || "").trim();
    const valorCourier = toNumber(row[17]);
    if (cidadeCourier && valorCourier) {
      grafico06MotoBoyPC.push({
        cidade: cidadeCourier,
        valor: valorCourier,
      });
    }

    // 2) Transportadora por loja (T/U => índices 18/19)
    const cidadeTransp = String(row[18] || "").trim();
    const valorTransp = toNumber(row[19]);
    if (cidadeTransp && valorTransp) {
      grafico07TranspPC.push({
        cidade: cidadeTransp,
        valor: valorTransp,
      });
    }

    // 3) Courier (por empresa) (V/W => índices 20/21)
    const empCourier = String(row[20] || "").trim();
    const valorEmpCourier = toNumber(row[21]);
    if (empCourier && valorEmpCourier) {
      grafico08PorMotoBoy.push({
        empresa: empCourier,
        valor: valorEmpCourier,
      });
    }

    // 4) Transportadora (por empresa) (X/Y => índices 22/23)
    const empTransp = String(row[22] || "").trim();
    const valorEmpTransp = toNumber(row[23]);
    if (empTransp && valorEmpTransp) {
      grafico09PorTransportadora.push({
        empresa: empTransp,
        valor: valorEmpTransp,
      });
    }
  }

  return {
    grafico06MotoBoyPC,
    grafico07TranspPC,
    grafico08PorMotoBoy,
    grafico09PorTransportadora,
  };
}

/**
 * ============================
 *  TELA: CUSTOS FROTA
 * ============================
 *
 * 1º gráfico: APROVEITAMENTO DIÁRIO DA FROTA - 8H/DIA
 *   - Nome:  AK5:AK6
 *   - Valor: AL5:AL6 (percentual)
 *
 * 2º gráfico (planejado): VALOR APROXIMADO DE CUSTOS VS KM RODADO
 *   - Nome:  AD5:AD6
 *   - Valor: AE5:AE6
 *   (se quiser usar depois, dá pra expor aqui também)
 *
 * 3º gráfico: CUSTOS DAF
 *   - Nome:  Z5:Z15
 *   - Valor: AA5:AA15
 *
 * 4º gráfico: CUSTOS VW
 *   - Nome:  AB5:AB15
 *   - Valor: AC5:AC15
 */
export async function loadCustosFrota() {
  const matrix = await loadCustosMatrix();
  if (!matrix.length) {
    return {
      grafico10GastosVW: [],
      grafico11GastosDAF: [],
      grafico12Aproveitamento: [],
      graficoValorKm: [],
    };
  }

  // =========== 3º GRÁFICO: CUSTOS DAF ===========
  // Nome:  Z5:Z15  -> índice 24
  // Valor: AA5:AA15 -> índice 25
  const grafico11GastosDAF = [];

  // =========== 4º GRÁFICO: CUSTOS VW ===========
  // Nome:  AB5:AB15 -> índice 26
  // Valor: AC5:AC15 -> índice 27
  const grafico10GastosVW = [];

  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r] || [];

    const dafNome = String(row[24] || "").trim();
    const dafValor = toNumber(row[25]);
    if (dafNome && dafValor) {
      grafico11GastosDAF.push({
        item: dafNome,
        valor: dafValor,
      });
    }

    const vwNome = String(row[26] || "").trim();
    const vwValor = toNumber(row[27]);
    if (vwNome && vwValor) {
      grafico10GastosVW.push({
        item: vwNome,
        valor: vwValor,
      });
    }
  }

  // =========== 2º GRÁFICO: VALOR APROX. VS KM RODADO ===========
  // Nome das Barras: AD5:AD6 -> índice 28
  // Valor:            AE5:AE6 -> índice 29
  //
  // (Se depois você quiser colocar KM separado, a gente pluga outra coluna aqui.)
  const graficoValorKm = [];
  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r] || [];
    const frota = String(row[28] || "").trim();
    const valor = toNumber(row[29]);

    if (!frota || !valor) continue;

    graficoValorKm.push({
      frota,
      valor,
    });
  }

  // =========== 1º GRÁFICO: APROVEITAMENTO DIÁRIO ===========
  // Nome:  AK5:AK6 -> índice 35
  // Valor: AL5:AL6 -> índice 36 (pode vir 0.59 ou 59)
  const grafico12Aproveitamento = [];
  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r] || [];
    const frota = String(row[35] || "").trim();
    const bruto = row[36];

    let aproveitamento = 0;
    if (typeof bruto === "number") {
      aproveitamento = bruto;
    } else {
      aproveitamento = toNumber(bruto);
    }

    if (!frota || !aproveitamento) continue;

    grafico12Aproveitamento.push({
      frota,
      aproveitamento, // pode ser 0.59 ou 59, tratamos no JSX
    });
  }

  return {
    grafico10GastosVW,
    grafico11GastosDAF,
    grafico12Aproveitamento,
    graficoValorKm,
  };
}
