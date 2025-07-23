import React, { useState } from "react";
import Papa from "papaparse";
import { Button, Typography, Card, CardBody, Progress, Input } from "@material-tailwind/react";

const API_BASE = "http://localhost:5000/api";

export default function ImportBarang() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [importResult, setImportResult] = useState(null); // { pib_id, barang: [...] }
  const [detailForm, setDetailForm] = useState([]); // [{ id_barang, jumlah, no_invoice, no_bl }]
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setRows([]);
    setMessage("");
    setImportResult(null);
    setDetailForm([]);
    setSaveMessage("");
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
    setImportResult(null);
    setDetailForm([]);
    setSaveMessage("");
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
      if (data.pib_id && Array.isArray(data.barang)) {
        setImportResult({ pib_id: data.pib_id, barang: data.barang });
        setDetailForm(
          data.barang.map((b) => ({
            id_barang: b.part_number,
            jumlah: "",
            no_invoice: "",
            no_bl: "",
          }))
        );
      }
    } catch (err) {
      setMessage("Import failed: " + err.message);
    }
    setImporting(false);
    setProgress(100);
  };

  const handleDetailChange = (idx, field, value) => {
    setDetailForm((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const details = detailForm.map((d) => ({
        id_pib: importResult.pib_id,
        id_barang: d.id_barang,
        jumlah: d.jumlah,
        no_invoice: d.no_invoice,
        no_bl: d.no_bl,
      }));
      const res = await fetch(`${API_BASE}/detail_pib/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details }),
      });
      const data = await res.json();
      if (data.code === 201) {
        setSaveMessage("Detail PIB saved successfully!");
      } else {
        setSaveMessage("Failed to save details: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      setSaveMessage("Failed to save details: " + err.message);
    }
    setSaving(false);
  };

  return (
    <Card className="max-w-5xl mx-auto mt-10 shadow-lg">
      <CardBody>
        <Typography variant="h4" className="mb-6 text-center text-ciput-primary font-bold">Import Barang from CSV</Typography>
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 justify-center mb-6">
          <input type="file" accept=".csv" onChange={handleFileChange} disabled={importing} className="block w-full md:w-auto border rounded px-3 py-2" />
          <Button onClick={handleParse} disabled={!file || importing} className="w-full md:w-auto">Parse CSV</Button>
          {rows.length > 0 && (
            <Button onClick={handleImport} disabled={importing} className="w-full md:w-auto">Import Data</Button>
          )}
        </div>
        {importing && <Progress value={progress} className="mt-4" />}
        <Typography className="mt-4 whitespace-pre-line text-center text-blue-700">{message}</Typography>

        {/* Detail PIB Form */}
        {importResult && (
          <div className="mt-10">
            <Typography variant="h5" className="mb-4 text-ciput-primary font-semibold text-center">Input Detail PIB for Each Barang</Typography>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveDetails();
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border rounded-xl bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2">Part Number</th>
                      <th className="px-3 py-2">Deskripsi</th>
                      <th className="px-3 py-2">Jumlah</th>
                      <th className="px-3 py-2">HS Code</th>
                      <th className="px-3 py-2">Pos Tarif</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">No Invoice</th>
                      <th className="px-3 py-2">No BL</th>
                      <th className="px-3 py-2">Required Docs</th>
                      <th className="px-3 py-2">Instansi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.barang.map((b, idx) => (
                      <tr key={b.part_number} className="even:bg-gray-50">
                        <td className="px-3 py-2 font-mono">{b.part_number}</td>
                        <td className="px-3 py-2">{b.deskripsi}</td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={detailForm[idx]?.jumlah || ""}
                            onChange={e => handleDetailChange(idx, "jumlah", e.target.value)}
                            required
                            className="min-w-[80px]"
                          />
                        </td>
                        <td className="px-3 py-2">{b.hs_code}</td>
                        <td className="px-3 py-2">{b.pos_tarif}%</td>
                        <td className="px-3 py-2">{b.status_lartas}</td>
                        <td className="px-3 py-2">
                          <Input
                            value={detailForm[idx]?.no_invoice || ""}
                            onChange={e => handleDetailChange(idx, "no_invoice", e.target.value)}
                            required
                            className="min-w-[120px]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={detailForm[idx]?.no_bl || ""}
                            onChange={e => handleDetailChange(idx, "no_bl", e.target.value)}
                            required
                            className="min-w-[120px]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {(b.required_docs && Array.isArray(b.required_docs))
                            ? b.required_docs.map(doc => doc.docs_type?.nama).filter(Boolean).join(" & ")
                            : "-"}
                        </td>
                        <td className="px-3 py-2">{b.instansi ? b.instansi.nama_instansi : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <Button type="submit" color="blue" className="px-8 py-2" disabled={saving}>Save Detail PIB</Button>
              </div>
              {saveMessage && <Typography className="mt-4 text-center whitespace-pre-line text-green-700">{saveMessage}</Typography>}
            </form>
          </div>
        )}
      </CardBody>
    </Card>
  );
} 