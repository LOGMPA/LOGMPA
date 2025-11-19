import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const EXCEL_URL = "/data/LOGISTICA2026.xlsx";

let cachedData = null;
let cachedError = null;
let loadingPromise = null;

async function loadFromExcel() {
  if (cachedData || cachedError) {
    return { data: cachedData, error: cachedError };
  }

  if (!loadingPromise) {
    loadingPromise = (async () => {
      const res = await fetch(EXCEL_URL);
      if (!res.ok) {
        throw new Error(`Erro ao carregar planilha: ${EXCEL_URL}`);
      }

      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });

      const freteSheet = wb.Sheets["FRETE MÁQUINAS"];
      const custosSheet = wb.Sheets["CUSTOS"];

      if (!freteSheet) {
        throw new Error('Guia "FRETE MÁQUINAS" não encontrada na planilha');
      }
      if (!custosSheet) {
        throw new Error('Guia "CUSTOS" não encontrada na planilha');
      }

      const freteRows = XLSX.utils.sheet_to_json(freteSheet, { defval: null });

      const transports = freteRows
        .map((row, index) => ({
          id: index + 1,
          status: row["STATUS"],
          frete: row["FRETE"],
          hr: row["HR"],
          km: Number(row["KM"] ?? 0),
          r_prop: Number(row["R$ PROP"] ?? 0),
          r_terc: Number(row["R$ TERC"] ?? 0),
          chassi: row["CHASSI"],
          prev: row["PREV"],
          real: row["REAL"],
          cliente_nota: row["CLIENTE/NOTA"],
          solicitante: row["SOLICITANTE"],
          esta: row["ESTÁ:"],
          vai: row["VAI:"],
          tipo: row["TIPO"],
          esta_em: row["ESTÁ EM:"],
          vai_para: row["VAI PARA:"],
          obs: row["OBS"],
          filial_custos: row["FILIAL CUSTOS"],
          equip: row["EQUIP"],
        }))
        .filter((t) => t.status && t.chassi);

      const cs = custosSheet;

      const v = (addr) => {
        const cell = cs[addr];
        return cell ? cell.v : null;
      };

      const metaVsReal = [];
      const equipCols = ["B", "C", "D", "E", "F", "G"];
      equipCols.forEach((col) => {
        const name = v(col + "11");
        if (!name) return;
        const meta = Number(v(col + "12") ?? 0);
        const real = Number(v(col + "13") ?? 0);
        metaVsReal.push({
          name,
          Meta: Math.round(meta),
          Real: Math.round(real),
        });
      });

      const custoPorTipo = [];
      for (let row = 18; row <= 23; row++) {
        const name = v("A" + row);
        if (!name || name === "Total Geral") continue;
        const somaProprio = Number(v("B" + row) ?? 0);
        const somaTerceiro = Number(v("C" + row) ?? 0);
        const qtd = Number(v("D" + row) ?? 0);
        custoPorTipo.push({
          name,
          "Soma Proprio": Math.round(somaProprio),
          "Soma Terceiro": Math.round(somaTerceiro),
          qtd,
        });
      }

      const terceiros = [];
      for (let row = 29; row <= 36; row++) {
        const name = v("A" + row);
        if (!name || name === "Total Geral") continue;
        const valor = Number(v("B" + row) ?? 0);
        const km = Number(v("C" + row) ?? 0);
        terceiros.push({
          name: String(name).replace("TERCEIRO ", ""),
          "Valor Total": Math.round(valor),
          "Total KM": km,
        });
      }

      const munck = [];
      for (let row = 47; row <= 51; row++) {
        const name = v("A" + row);
        if (!name || name === "Total Geral") continue;
        const valor = Number(v("B" + row) ?? 0);
        munck.push({ name, value: Math.round(valor) });
      }

      const courierPorLoja = [];
      for (let row = 47; row <= 54; row++) {
        const name = v("D" + row);
        if (!name || name === "Total Geral") continue;
        const valor = Number(v("E" + row) ?? 0);
        courierPorLoja.push({ name, valor: Math.round(valor) });
      }

      const transportadoraPorLoja = [];
      for (let row = 61; row <= 66; row++) {
        const name = v("D" + row);
        if (!name || name === "Total Geral") continue;
        const valor = Number(v("E" + row) ?? 0);
        transportadoraPorLoja.push({ name, valor: Math.round(valor) });
      }

      const courier = [];
      for (let row = 62; row <= 69; row++) {
        const name = v("A" + row);
        if (!name || name === "Total Geral") continue;
        const valor = Number(v("B" + row) ?? 0);
        courier.push({ name, valor: Math.round(valor) });
      }

      const transportadora = [];
      for (let row = 62; row <= 66; row++) {
        const name = v("D" + row);
        if (!name || name === "Total Geral") continue;
        const valor = Number(v("E" + row) ?? 0);
        transportadora.push({ name, valor: Math.round(valor) });
      }

      const custosVsKm = [];
      for (let row = 86; row <= 87; row++) {
        const name = v("A" + row);
        if (!name) continue;
        const valor = Number(v("B" + row) ?? 0);
        custosVsKm.push({ name, VALOR: Math.round(valor) });
      }

      const aproveitamento = [];
      for (let row = 91; row <= 92; row++) {
        const name = v("A" + row);
        if (!name) continue;
        const fraction = Number(v("B" + row) ?? 0);
        const percentage = Math.round(fraction * 100);
        aproveitamento.push({ name, value: percentage, percentage });
      }

      const daf = [];
      for (let row = 61; row <= 68; row++) {
        const name = v("G" + row);
        const valor = v("H" + row);
        if (!name || name === "Total Geral" || valor == null) continue;
        daf.push({ name, valor: Number(valor) });
      }

      const vw = [];
      for (let row = 74; row <= 82; row++) {
        const name = v("G" + row);
        const valor = v("H" + row);
        if (!name || name === "Total Geral" || valor == null) continue;
        vw.push({ name, valor: Number(valor) });
      }

      cachedData = {
        transports,
        custos: {
          metaVsReal,
          custoPorTipo,
          terceiros,
          munck,
          courierPorLoja,
          transportadoraPorLoja,
          courier,
          transportadora,
          aproveitamento,
          custosVsKm,
          daf,
          vw,
        },
      };

      return { data: cachedData, error: null };
    })().catch((err) => {
      console.error(err);
      cachedError = err;
      return { data: null, error: err };
    });
  }

  const result = await loadingPromise;
  return result;
}

export function useLogisticaData() {
  const [state, setState] = useState({
    transports: cachedData?.transports ?? [],
    custos: cachedData?.custos ?? null,
    isLoading: !cachedData && !cachedError,
    error: cachedError,
  });

  useEffect(() => {
    if (cachedData || cachedError) return;
    let cancelled = false;

    loadFromExcel().then(({ data, error }) => {
      if (cancelled) return;
      setState({
        transports: data?.transports ?? [],
        custos: data?.custos ?? null,
        isLoading: !data && !error,
        error,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
