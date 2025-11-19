import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";

const SHEET_NAME = "CUSTOS";

function readRange(sheet, range) {
  const rows = XLSX.utils.sheet_to_json(sheet, {
    range,
    header: 1,
    blankrows: false,
  });

  if (!rows || rows.length === 0) {
    return { header: [], rows: [] };
  }

  const [header, ...body] = rows;
  return { header, rows: body };
}

async function loadCustos() {
  // caminho certo pra rodar no GitHub Pages em /LOGMPA/
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/LOGISTICA2026.xlsx`
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar planilha de custos");
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[SHEET_NAME];

  if (!sheet) {
    throw new Error("Aba CUSTOS não encontrada na planilha");
  }

  // Ranges conforme o TXT que você mandou
  return {
    // Meta x Real Frete Máquinas (A11:G11 cabeçalho / A12:G13 dados)
    metaFrete: readRange(sheet, "A11:G13"),

    // Custo por tipo (A17:D17 cabeçalho / A18:D23 dados)
    custoTipo: readRange(sheet, "A17:D23"),

    // Peças por loja (A46:B46 cabeçalho / A47:B54 dados)
    pecas: readRange(sheet, "A46:B54"),

    // Courier por loja (D46:E46 cabeçalho / D47:E54 dados)
    courier: readRange(sheet, "D46:E54"),

    // Custos Peças 2026 (A61:B61 cabeçalho / A62:B80 dados)
    pecas2026: readRange(sheet, "A61:B80"),

    // Transportadoras Peças 2026 (D61:E61 cabeçalho / D62:E80 dados)
    transp2026: readRange(sheet, "D61:E80"),

    // Custos Frota (A85:B85 cabeçalho / A86:B87 dados)
    frota: readRange(sheet, "A85:B87"),

    // Custos DAF 2026 (G60:H60 cabeçalho / G61:H68 dados)
    daf2026: readRange(sheet, "G60:H68"),

    // Custos VW 2026 (G73:H73 cabeçalho / G74:H82 dados)
    vw2026: readRange(sheet, "G73:H82"),
  };
}

export function useCustos() {
  return useQuery({
    queryKey: ["custos"],
    queryFn: loadCustos,
  });
}
