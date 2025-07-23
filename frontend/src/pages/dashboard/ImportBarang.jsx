import React, { useState } from "react";
import Papa from "papaparse";
import { Button, Typography, Card, CardBody, Progress } from "@material-tailwind/react";

const API_BASE = "http://localhost:5000/api";

function splitDocs(docs) {
  if (!docs) return [];
  return docs.split("&").map((d) => d.trim()).filter(Boolean);
}

async function fetchInstansiId(nama_instansi) {
  if (!nama_instansi || nama_instansi === "-" || nama_instansi === "") return null;
  // Try to find instansi by name
  const res = await fetch(`${API_BASE}/instansi?limit=1000`);
  const data = await res.json();
  if (data && data.data) {
    const found = data.data.find((i) => i.nama_instansi === nama_instansi);
    if (found) return found.id;
  }
  // Not found, create new
  const createRes = await fetch(`${API_BASE}/instansi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama_instansi }),
  });
  const createData = await createRes.json();
  return createData.data?.id || null;
}

export default function ImportBarang() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setRows([]);
    setMessage("");
  };

  const handleParse = () => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data);
        setMessage(`Parsed ${results.data.length} rows.`);
      },
      error: (err) => setMessage("CSV parse error: " + err.message),
    });
  };

  const handleImport = async () => {
    setImporting(true);
    setProgress(0);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/barang/import`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(
        `Imported: ${data.results?.length || 0} success, ${data.errors?.length || 0} errors.` +
        (data.errors && data.errors.length > 0 ? "\nFirst error: " + data.errors[0].error : "")
      );
    } catch (err) {
      setMessage("Import failed: " + err.message);
    }
    setImporting(false);
    setProgress(100);
  };

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardBody>
        <Typography variant="h5" className="mb-4">Import Barang from CSV</Typography>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={importing} />
        <Button onClick={handleParse} className="mt-2" disabled={!file || importing}>Parse CSV</Button>
        {rows.length > 0 && (
          <Button onClick={handleImport} className="mt-2 ml-2" disabled={importing}>Import Data</Button>
        )}
        {importing && <Progress value={progress} className="mt-4" />}
        <Typography className="mt-4">{message}</Typography>
      </CardBody>
    </Card>
  );
} 