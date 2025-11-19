import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function normalizeStatus(value) {
  if (!value) return "";
  return String(value).trim().toUpperCase();
}

export function useFreteMaquinas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/LOGISTICA2026.xlsx");
        if (!res.ok) throw new Error("Erro ao carregar planilha");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const sheet = wb.Sheets["FRETE MÁQUINAS"];
        if (!sheet) throw new Error("Aba 'FRETE MÁQUINAS' não encontrada");

        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (!rows.length) {
          setData([]);
          return;
        }
        const [header, ...body] = rows;
        const idx = (name) => header.indexOf(name);

        const colStatus = idx("STATUS");
        const colFrete = idx("FRETE");
        const colHr = idx("HR");
        const colKm = idx("KM");
        const colRProp = idx("R$ PROP");
        const colRTerc = idx("R$ TERC");
        const colChassi = idx("CHASSI");
        const colPrev = idx("PREV");
        const colReal = idx("REAL");
        const colCliente = idx("CLIENTE/NOTA");
        const colSolicitante = idx("SOLICITANTE");
        const colEsta = idx("ESTÁ:");
        const colVai = idx("VAI:");
        const colTipo = idx("TIPO");
        const colEstaEm = idx("ESTÁ EM:");
        const colVaiPara = idx("VAI PARA:");
        const colObs = idx("OBS");
        const colFilialCustos = idx("FILIAL CUSTOS");
        const colEquip = idx("EQUIP");

        const mapped = body
          .filter((row) => row && row[colStatus])
          .map((row, i) => {
            const status = normalizeStatus(row[colStatus]);
            const rProp = Number(row[colRProp] || 0);
            const rTerc = Number(row[colRTerc] || 0);
            return {
              id: i,
              status,
              frete: row[colFrete] || "",
              hr: row[colHr] || null,
              km: row[colKm] || null,
              r_prop: rProp,
              r_terc: rTerc,
              chassi: row[colChassi] || "",
              prev: row[colPrev] || null,
              real: row[colReal] || null,
              cliente: row[colCliente] || "",
              solicitante: row[colSolicitante] || "",
              esta: row[colEsta] || "",
              vai: row[colVai] || "",
              tipo: row[colTipo] || "",
              esta_em: row[colEstaEm] || "",
              vai_para: row[colVaiPara] || "",
              obs: row[colObs] || "",
              filial_custos: row[colFilialCustos] || "",
              equip: row[colEquip] || "",
            };
          });

        setData(mapped);
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