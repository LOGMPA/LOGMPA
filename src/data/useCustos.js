import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function readRange(sheet, range) {
  const [start, end] = range.split(":");
  const data = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    range: `${start}:${end}`,
    blankrows: false,
  });
  return data;
}

export function useCustos() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/LOGISTICA2026.xlsx");
        if (!res.ok) throw new Error("Erro ao carregar planilha");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const sheet = wb.Sheets["CUSTOS"];
        if (!sheet) throw new Error("Aba 'CUSTOS' não encontrada");

        const metaFreteHeader = readRange(sheet, "A11:G11")[0] || [];
        const metaFreteRows = readRange(sheet, "A12:G13");

        const custoTipoHeader = readRange(sheet, "A17:D17")[0] || [];
        const custoTipoRows = readRange(sheet, "A18:D23");

        const pecasHeader = readRange(sheet, "A46:B46")[0] || [];
        const pecasRows = readRange(sheet, "A47:B54");

        const courierHeader = readRange(sheet, "D46:E46")[0] || [];
        const courierRows = readRange(sheet, "D47:E54");

        const pecas2026Header = readRange(sheet, "A61:B61")[0] || [];
        const pecas2026Rows = readRange(sheet, "A62:B80");

        const transp2026Header = readRange(sheet, "D61:E61")[0] || [];
        const transp2026Rows = readRange(sheet, "D62:E80");

        const frotaHeader = readRange(sheet, "A85:B85")[0] || [];
        const frotaRows = readRange(sheet, "A86:B87");

        const dafHeader = readRange(sheet, "G60:H60")[0] || [];
        const dafRows = readRange(sheet, "G61:H68");

        const vwHeader = readRange(sheet, "G73:H73")[0] || [];
        const vwRows = readRange(sheet, "G74:H82");

        setData({
          metaFrete: { header: metaFreteHeader, rows: metaFreteRows },
          custoTipo: { header: custoTipoHeader, rows: custoTipoRows },
          pecas: { header: pecasHeader, rows: pecasRows },
          courier: { header: courierHeader, rows: courierRows },
          pecas2026: { header: pecas2026Header, rows: pecas2026Rows },
          transp2026: { header: transp2026Header, rows: transp2026Rows },
          frota: { header: frotaHeader, rows: frotaRows },
          daf2026: { header: dafHeader, rows: dafRows },
          vw2026: { header: vwHeader, rows: vwRows },
        });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading, error };
}