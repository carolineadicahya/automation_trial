import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

const API_BASE = "http://localhost:5000/api";
const resources = [
  { key: "barang", label: "Barang" },
  { key: "detail_pib", label: "Detail PIB" },
  { key: "importir", label: "Importir" },
  { key: "instansi", label: "Instansi" },
  { key: "penjual", label: "Penjual" },
  { key: "pib", label: "PIB" },
  { key: "required_docs", label: "Required Docs" },
  { key: "sarana_pengangkutan", label: "Sarana Pengangkutan" },
];

export function Home() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all(
      resources.map((res) =>
        fetch(`${API_BASE}/${res.key}?limit=1`)
          .then((r) => r.json())
          .then((data) => ({
            key: res.key,
            count: Array.isArray(data.data) ? data.data.length + (data.total || 0) - 1 : (data.data ? 1 : 0),
            fallback: data,
          }))
          .catch(() => ({ key: res.key, count: 0, fallback: null }))
      )
    )
      .then((results) => {
        const countsObj = {};
        results.forEach((r, idx) => {
          let count = 0;
          if (r.fallback && typeof r.fallback.total === "number") {
            count = r.fallback.total;
          } else if (r.fallback && Array.isArray(r.fallback.data)) {
            count = r.fallback.data.length;
          }
          countsObj[resources[idx].key] = count;
        });
        setCounts(countsObj);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-12 min-h-screen bg-gray-50 font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <Typography variant="h6" className="text-gray-900">Loading...</Typography>
        ) : error ? (
          <Typography variant="h6" color="red">{error}</Typography>
        ) : (
          resources.map((res) => (
            <Card
              key={res.key}
              className="p-6 flex flex-col items-center justify-center shadow-lg rounded-2xl bg-white text-gray-900 border hover:scale-105 transition-transform duration-200"
              style={{ fontFamily: 'Poppins, sans-serif', minHeight: 180 }}
            >
              <Typography variant="h6" className="mb-2 text-gray-700 font-semibold tracking-wide uppercase">
                {res.label}
              </Typography>
              <Typography variant="h1" className="mb-1 text-gray-900 font-bold text-5xl">
                {counts[res.key] ?? 0}
              </Typography>
              <Typography variant="small" className="text-gray-500 font-medium">
                Total Data
              </Typography>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
