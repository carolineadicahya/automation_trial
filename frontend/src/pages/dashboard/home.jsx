import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
} from "@material-tailwind/react";

const API_BASE = import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const resources = [
  { key: "barang", label: "Barang" },
  { key: "pib", label: "PIB" },
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
        fetch(`${API_BASE}/${res.key}/count`)
          .then((r) => r.json())
          .then((data) => ({ key: res.key, count: data.count || 0 }))
          .catch(() => ({ key: res.key, count: 0 }))
      )
    )
      .then((results) => {
        const countsObj = {};
        results.forEach((r) => {
          countsObj[r.key] = r.count;
        });
        setCounts(countsObj);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-12 min-h-screen bg-ciput-bg font-sans">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <Typography variant="h6" className="text-ciput-primary">Loading...</Typography>
        ) : error ? (
          <Typography variant="h6" style={{ color: '#e53935' }}>{error}</Typography>
        ) : (
          resources.map((res) => (
            <Card
              key={res.key}
              className="p-6 flex flex-col items-center justify-center shadow-lg rounded-2xl bg-white text-ciput-primary border hover:scale-105 transition-transform duration-200"
              style={{ fontFamily: 'Poppins, sans-serif', minHeight: 180 }}
            >
              <Typography variant="h6" className="mb-2 text-ciput-secondary font-semibold tracking-wide uppercase">
                {res.label}
              </Typography>
              <Typography variant="h1" className="mb-1 text-ciput-primary font-bold text-5xl">
                {counts[res.key] ?? 0}
              </Typography>
              <Typography variant="small" className="text-ciput-secondary font-medium">
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
