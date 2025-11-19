// src/services/custosExcelService.js
import * as XLSX from "xlsx";

// Lê o arquivo LOGISTICA2026.xlsx em public/data/LOGISTICA2026.xlsx
async function loadCustosSheet() {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const res = await fetch(`${baseUrl}data/LOGISTICA2026.xlsx`);

  if (!res.ok) {
    throw new Error(
      "Erro ao carregar LOGISTICA2026.xlsx em public/data/LOGISTICA2026.xlsx"
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets["CUSTOS"];

  if (!sheet) {
    throw new Error(
      'Aba "CUSTOS" não encontrada na planilha LOGISTICA2026.xlsx'
    );
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
  return rows;
}

// ---------- helpers básicos ----------

function toNumber(v) {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const s = v.replace(/R\$\s*/gi, "").replace(/\./g, "").replace(",", ".");
    const n = Number(s);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

function toPercent(v) {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    let s = v.trim();
    const hasPercent = s.includes("%");
    s = s.replace("%", "").replace(",", ".");
    let n = Number(s);
    if (Number.isNaN(n)) return 0;
    if (hasPercent && n > 1) n = n / 100;
    return n;
  }
  return 0;
}

// excelRow e excelColIndex são 1-based (A1 = row 1, col 1)
function getCell(rows, excelRow, excelColIndex) {
  const r = rows[excelRow - 1] || [];
  return r[excelColIndex - 1];
}

// Soma valores em um intervalo de colunas para cada linha
function parseBlockByRowSum(rows, startRow, endRow, startCol, endCol) {
  const out = [];
  for (let excelRow = startRow; excelRow <= endRow; excelRow++) {
    const r = rows[excelRow - 1] || [];
    const label = String(r[startCol - 1] ?? "").trim();
    if (!label) continue;
    let total = 0;
    for (let c = startCol; c <= endCol; c++) {
      total += toNumber(r[c - 1]);
    }
    out.push({ label, value: total });
  }
  return out;
}

// Pega label em uma coluna e valor em outra
function parseBlockLabelValue(
  rows,
  startRow,
  endRow,
  labelCol,
  valueCol,
  asPercent = false
) {
  const out = [];
  for (let excelRow = startRow; excelRow <= endRow; excelRow++) {
    const r = rows[excelRow - 1] || [];
    const label = String(r[labelCol - 1] ?? "").trim();
    if (!label) continue;
    const raw = r[valueCol - 1];
    const value = asPercent ? toPercent(raw) : toNumber(raw);
    out.push({ label, value });
  }
  return out;
}

// ========== 1. CUSTOS MÁQUINAS ==========
//
// Tudo usando exatamente o que você mandou:
//
// TRANSPORTE MÁQUINAS 2026 - META VS REAL
// Cabeçalho: A11:G11
// Conteúdo: A12:G13

function parseGrafico01(rows) {
  // Label em A, somando B..G pra cada linha (meta x real)
  return parseBlockByRowSum(rows, 12, 13, 1, 7);
}

// CUSTO POR TIPO
// Cabeçalho: A17:D17
// Conteúdo: A18:D23

function parseGrafico02(rows) {
  return parseBlockByRowSum(rows, 18, 23, 1, 4);
}

// CUSTO COM TERCEIROS
// Cabeçalho: A28:C28
// Conteúdo: A29:C36

function parseGrafico03(rows) {
  return parseBlockByRowSum(rows, 29, 36, 1, 3);
}

// FROTA PRÓPRIA
// A especificação não trouxe um bloco separado pra isso.
// Vou retornar vazio pra não quebrar nada visualmente.
// Se depois tiver tabela específica, a gente pluga aqui.
function parseGrafico04(_rows) {
  return [];
}

// UTILIZAÇÃO DE MUNCK
// Cabeçalho: A46:B46
// Conteúdo: A47:B54

function parseGrafico05(rows) {
  return parseBlockLabelValue(rows, 47, 54, 1, 2);
}

// ========== 2. CUSTOS PEÇAS ==========
//
// COURIER POR LOJA
// Cabeçalho: D46:E46
// Conteúdo: D47:E54

function parseGrafico06(rows) {
  return parseBlockLabelValue(rows, 47, 54, 4, 5);
}

// TRANSPORTADORA POR LOJA
// Cabeçalho: G46:H46
// Conteúdo: G47:H54

function parseGrafico07(rows) {
  return parseBlockLabelValue(rows, 47, 54, 7, 8);
}

// ========== 3. CUSTOS FROTA ==========
//
// CUSTO COURIER
// Cabeçalho: A61:B61
// Conteúdo: A62:B80
// (vou usar isso como grafico08)

function parseGrafico08(rows) {
  return parseBlockLabelValue(rows, 62, 80, 1, 2);
}

// CUSTO TRANSPORTADORA
// Cabeçalho: D61:E61
// Conteúdo: D62:E80
// (grafico09)

function parseGrafico09(rows) {
  return parseBlockLabelValue(rows, 62, 80, 4, 5);
}

// Custos DAF 2026
// Cabeçalho: G60:H60
// Conteúdo: G61:H68
//
// Custos VW 2026
// Cabeçalho: G73:H73
// Conteúdo: G74:H82

function parseGastosVWDAF(rows) {
  const daf = parseBlockLabelValue(rows, 61, 68, 7, 8);
  const vw = parseBlockLabelValue(rows, 74, 82, 7, 8);
  return { vw, daf };
}

// Aproveitamento
// Cabeçalho: A90:B90
// Conteúdo: A91:B92

function parseGrafico12(rows) {
  return parseBlockLabelValue(rows, 91, 92, 1, 2, true);
}

// ========== exports ==========

export async function loadCustosMaquinas() {
  const rows = await loadCustosSheet();
  return {
    grafico01MetaVsReal: parseGrafico01(rows),
    grafico02SomaCustos: parseGrafico02(rows),
    grafico03Terceiros: parseGrafico03(rows),
    grafico04Proprio: parseGrafico04(rows),
    grafico05Munck: parseGrafico05(rows),
  };
}

export async function loadCustosPecas() {
  const rows = await loadCustosSheet();
  return {
    grafico06PecasCourierPorLoja: parseGrafico06(rows),
    grafico07TranspPC: parseGrafico07(rows),
  };
}

export async function loadCustosFrota() {
  const rows = await loadCustosSheet();
  const { vw, daf } = parseGastosVWDAF(rows);
  return {
    grafico08PorMotoBoy: parseGrafico08(rows),
    grafico09PorTransportadora: parseGrafico09(rows),
    grafico10GastosVW: vw,
    grafico11GastosDAF: daf,
    grafico12Aproveitamento: parseGrafico12(rows),
  };
}
