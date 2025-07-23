import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const defaultApiBase = "http://localhost:5000/api";

// Foreign key mapping: resourceKey -> { columnKey: { ref: resourceKey, label: columnNameForLabel } }
const foreignKeyMap = {
  barang: {
    // part_number is PK, not FK
    // id_instansi: { ref: "instansi", label: "nama_instansi" }, // if used
  },
  detail_pib: {
    id_pib: { ref: "pib", label: "id" },
    // id_barang: { ref: "barang", label: "part_number" }, // not in columns
  },
  importir: {},
  instansi: {},
  penjual: {},
  pib: {
    id_penjual: { ref: "penjual", label: "nama" },
    id_importir: { ref: "importir", label: "nitku" },
    id_sarana_pengangkutan: { ref: "sarana_pengangkutan", label: "nama" },
  },
  required_docs: {
    id_barang: { ref: "barang", label: "part_number" },
  },
  sarana_pengangkutan: {},
};

export default function TablePage({ resourceKey, resourceLabel, columns, apiBase = defaultApiBase }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  // Foreign data state
  const [foreignData, setForeignData] = useState({});
  const [foreignLoading, setForeignLoading] = useState(false);
  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // PIB Detail Dialog state
  const [viewPibId, setViewPibId] = useState(null);
  const [pibDetails, setPibDetails] = useState([]);
  const [pibDetailsLoading, setPibDetailsLoading] = useState(true);
  const [pibDetailsError, setPibDetailsError] = useState(null);

  function handleViewPibDetails(pibId) {
    setViewPibId(pibId);
    setPibDetailsLoading(true);
    setPibDetailsError(null);
    setPibDetails([]);
    fetch(`${apiBase}/detail_pib?id_pib=${pibId}&limit=10000`)
      .then(r => r.json())
      .then(res => {
        setPibDetails(res.data || []);
        setPibDetailsLoading(false);
      })
      .catch(err => {
        setPibDetailsError("Failed to fetch PIB details");
        setPibDetailsLoading(false);
      });
  }

  const fetchData = () => {
    setLoading(true);
    fetch(`${apiBase}/${resourceKey}?limit=${pageSize}&page=${page}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  const fetchCount = () => {
    fetch(`${apiBase}/${resourceKey}/count`)
      .then((r) => r.json())
      .then((res) => {
        setTotal(res.count || 0);
      });
  };

  useEffect(() => {
    setPage(1); // Reset to first page when resource changes
  }, [resourceKey]);

  useEffect(() => {
    fetchData();
    fetchCount();
    // eslint-disable-next-line
  }, [page, resourceKey]);

  const handleOpenAdd = () => {
    setForm({});
    setOpenAdd(true);
    setOpenEdit(false); // Ensure edit is closed when adding
  };
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEdit = (row) => {
    setEditId(row.id || row.part_number);
    setForm(row);
    setOpenEdit(true);
    setOpenAdd(false); // Ensure add is closed when editing
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    fetch(`${apiBase}/${resourceKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then(() => {
        handleCloseAdd();
        fetchData();
      });
  };

  const handleEdit = () => {
    fetch(`${apiBase}/${resourceKey}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then(() => {
        handleCloseEdit();
        fetchData();
      });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const confirmDelete = () => {
    fetch(`${apiBase}/${resourceKey}/${deleteId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then(() => {
        setDeleteOpen(false);
        setDeleteId(null);
        fetchData();
      });
  };
  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const statusLartasOptions = [
    "Lartas Export",
    "Lastas Import",
    "Non-Lartas",
  ];

  // Map of resourceKey to auto-increment PK field name
  const autoIncrementPK = {
    detail_pib: 'id',
    importir: 'id',
    instansi: 'id',
    penjual: 'id',
    pib: 'id',
    required_docs: 'id',
    sarana_pengangkutan: 'id',
    // barang: no auto-increment PK
  };
  const isAutoIncrementPK = (col) => autoIncrementPK[resourceKey] === col.key;

  // Fetch foreign key data when dialog opens
  useEffect(() => {
    if (openAdd || openEdit) {
      const fks = foreignKeyMap[resourceKey] || {};
      const fetches = Object.entries(fks).map(([col, { ref }]) =>
        fetch(`${apiBase}/${ref}?limit=1000`).then(r => r.json()).then(res => [col, res.data || []])
      );
      if (fetches.length > 0) {
        setForeignLoading(true);
        Promise.all(fetches).then(results => {
          const obj = {};
          results.forEach(([col, arr]) => { obj[col] = arr; });
          setForeignData(obj);
          setForeignLoading(false);
        });
      } else {
        setForeignData({});
      }
    }
  }, [openAdd, openEdit, resourceKey, apiBase]);

  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  // Helper to get display value for a cell
  function getDisplayValue(row, col, resourceKey, columns) {
    // Barang: show instansi.nama_instansi for id_instansi
    if (resourceKey === 'barang' && col.key === 'id_instansi' && row.instansi) {
      return row.instansi.nama_instansi;
    }
    // Required Docs: show docs_type.nama for id_docs_type
    if (resourceKey === 'required_docs' && col.key === 'id_docs_type' && row.docs_type) {
      return row.docs_type.nama;
    }
    // Required Docs: show barang.part_number for id_barang
    if (resourceKey === 'required_docs' && col.key === 'id_barang' && row.barang) {
      return row.barang.part_number;
    }
    // Detail PIB: show barang.part_number for id_barang
    if (resourceKey === 'detail_pib' && col.key === 'id_barang' && row.barang) {
      return row.barang.part_number;
    }
    // Detail PIB: show pib.id for id_pib
    if (resourceKey === 'detail_pib' && col.key === 'id_pib' && row.pib) {
      return row.pib.id;
    }
    // Show pos_tarif with %
    if (col.key === 'pos_tarif' && row[col.key] !== undefined && row[col.key] !== null) {
      return row[col.key] + '%';
    }
    // Default: show the value
    return row[col.key];
  }

  // Helper to get combined docs for barang
  function getCombinedDocs(row) {
    if (!row.required_docs || !Array.isArray(row.required_docs)) return '-';
    // Each required_doc has docs_type with nama
    const docNames = row.required_docs
      .map(doc => doc.docs_type && doc.docs_type.nama)
      .filter(Boolean);
    return docNames.length > 0 ? docNames.join(' & ') : '-';
  }

  // For barang, define the desired column order
  const barangColumnOrder = [
    'part_number',
    'deskripsi',
    'hs_code',
    'pos_tarif',
    'status_lartas',
  ];
  // Filter and order columns for barang
  const filteredColumns = resourceKey === 'barang'
    ? barangColumnOrder.map(key => columns.find(col => col.key === key)).filter(Boolean)
    : columns;

  const handleClosePibDialog = () => {
    setViewPibId(null);
    setPibDetailsLoading(true);
    setPibDetailsError(null);
    setPibDetails([]);
  };

  return (
    <div className="p-8 font-sans">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" className="text-ciput-primary">
          {resourceLabel} Table
        </Typography>
        <div>
          <Typography variant="small" className="mr-4">Total: {total}</Typography>
          <Button color="blue" onClick={handleOpenAdd} className="font-sans" disabled={openAdd || openEdit}>Add {resourceLabel}</Button>
        </div>
      </div>
      {/* Inline Add/Edit Form */}
      {(openAdd || openEdit) && (
        <Card className="mb-8 p-6 max-w-xl mx-auto">
          <Typography variant="h5" className="mb-4 font-bold">
            {openAdd ? `Add ${resourceLabel}` : `Edit ${resourceLabel}`}
          </Typography>
          {foreignLoading ? <Typography>Loading options...</Typography> : null}
          <form
            onSubmit={e => {
              e.preventDefault();
              openAdd ? handleAdd() : handleEdit();
            }}
          >
            {columns.filter(col => !isAutoIncrementPK(col)).map((col) => {
              // Foreign key dropdown
              const fk = (foreignKeyMap[resourceKey] || {})[col.key];
              if (fk && foreignData[col.key]) {
                return (
                  <div key={col.key} className="mb-4">
                    <Select
                      label={col.label}
                      value={form[col.key] || ""}
                      onChange={val => setForm({ ...form, [col.key]: val })}
                      className="font-sans"
                      searchable
                    >
                      {foreignData[col.key].map(opt => (
                        <Option key={opt.id || opt.part_number} value={opt.id || opt.part_number}>
                          {(opt.id || opt.part_number) + ' - ' + (opt[fk.label] || '')}
                        </Option>
                      ))}
                    </Select>
                  </div>
                );
              }
              // Barang status_lartas dropdown
              if (resourceKey === 'barang' && col.key === 'status_lartas') {
                return (
                  <div key={col.key} className="mb-4">
                    <Select
                      label={col.label}
                      value={form[col.key] || ""}
                      onChange={val => setForm({ ...form, [col.key]: val })}
                      className="font-sans"
                    >
                      {statusLartasOptions.map(opt => (
                        <Option key={opt} value={opt}>{opt}</Option>
                      ))}
                    </Select>
                  </div>
                );
              }
              // Default input
              return (
                <div key={col.key} className="mb-4">
                  <Input
                    label={col.label}
                    name={col.key}
                    value={form[col.key] || ""}
                    onChange={handleChange}
                    className="font-sans"
                  />
                </div>
              );
            })}
            <div className="flex gap-2 mt-4">
              <Button type="button" variant="text" color="gray" onClick={() => { openAdd ? handleCloseAdd() : handleCloseEdit(); }} className="font-sans">Cancel</Button>
              <Button type="submit" variant="gradient" color="blue" className="font-sans">{openAdd ? 'Add' : 'Save'}</Button>
            </div>
          </form>
        </Card>
      )}
      {/* Table */}
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">No.</th>
              {filteredColumns.map((col) => (
                <th key={col.key} className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">
                  {col.label}
                </th>
              ))}
              {/* Add custom headers for foreign keys in the correct order */}
              {resourceKey === 'barang' && <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">DOCS</th>}
              {resourceKey === 'barang' && <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">Instansi</th>}
              {resourceKey === 'required_docs' && <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">Barang</th>}
              {resourceKey === 'required_docs' && <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">Docs Type</th>}
              {resourceKey === 'detail_pib' && <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">Barang</th>}
              {resourceKey === 'detail_pib' && <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">PIB</th>}
              <th className="px-4 py-2 text-left text-gray-800 font-semibold uppercase text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={filteredColumns.length + 3} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={filteredColumns.length + 3} className="text-center py-8 text-red-500">{error}</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={filteredColumns.length + 3} className="text-center py-8">No data for this table</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id || row.part_number || idx} className="border-b">
                  <td className="px-4 py-2 text-gray-900">{(page - 1) * pageSize + idx + 1}</td>
                  {filteredColumns.map((col) => (
                    <td key={col.key} className="px-4 py-2 text-gray-900">{getDisplayValue(row, col, resourceKey, filteredColumns)}</td>
                  ))}
                  {/* Custom display for foreign keys in the correct order */}
                  {resourceKey === 'barang' && <td className="px-4 py-2 text-gray-900">{getCombinedDocs(row)}</td>}
                  {resourceKey === 'barang' && <td className="px-4 py-2 text-gray-900">{row.instansi ? row.instansi.nama_instansi : '-'}</td>}
                  {resourceKey === 'required_docs' && <td className="px-4 py-2 text-gray-900">{row.barang ? row.barang.part_number : '-'}</td>}
                  {resourceKey === 'required_docs' && <td className="px-4 py-2 text-gray-900">{row.docs_type ? row.docs_type.nama : '-'}</td>}
                  {resourceKey === 'detail_pib' && <td className="px-4 py-2 text-gray-900">{row.barang ? row.barang.part_number : '-'}</td>}
                  {resourceKey === 'detail_pib' && <td className="px-4 py-2 text-gray-900">{row.pib ? row.pib.id : '-'}</td>}
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      color="amber"
                      variant="filled"
                      onClick={() => handleOpenEdit(row)}
                      className="mr-2 font-sans flex items-center gap-2"
                      disabled={openAdd || openEdit}
                    >
                      <PencilIcon className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      variant="filled"
                      onClick={() => handleDelete(row.id || row.part_number)}
                      className="font-sans flex items-center gap-2"
                      disabled={openAdd || openEdit}
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Delete
                    </Button>
                    {resourceKey === 'pib' && (
                      <Button
                        size="sm"
                        color="blue"
                        variant="outlined"
                        onClick={() => handleViewPibDetails(row.id)}
                        className="ml-2 font-sans"
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
      <div className="flex justify-between items-center mt-4">
        <Button disabled={page === 1 || openAdd || openEdit} onClick={() => setPage(page - 1)} variant="outlined" size="sm" className="font-sans">Previous</Button>
        <Typography variant="small" className="font-sans">Page {page} of {maxPage}</Typography>
        <Button disabled={data.length < pageSize || openAdd || openEdit || page === maxPage} onClick={() => setPage(page + 1)} variant="outlined" size="sm" className="font-sans">Next</Button>
      </div>
      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} handler={cancelDelete} size="xs">
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={cancelDelete} className="mr-2 font-sans">Cancel</Button>
          <Button variant="gradient" color="red" onClick={confirmDelete} className="font-sans">Delete</Button>
        </DialogFooter>
      </Dialog>
      {/* PIB Detail Dialog - always render, only open when viewPibId is set */}
      <Dialog open={!!viewPibId} handler={handleClosePibDialog} size="xl">
        <DialogHeader>PIB Details (ID: {viewPibId})</DialogHeader>
        <DialogBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {pibDetailsLoading ? (
            <Typography>Loading...</Typography>
          ) : pibDetailsError ? (
            <Typography color="red">{pibDetailsError}</Typography>
          ) : pibDetails.length === 0 ? (
            <Typography>No details found for this PIB.</Typography>
          ) : (
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
                  {pibDetails.map((d, idx) => (
                    <tr key={d.id || idx} className="even:bg-gray-50">
                      <td className="px-3 py-2 font-mono">{d.barang?.part_number || '-'}</td>
                      <td className="px-3 py-2">{d.barang?.deskripsi || '-'}</td>
                      <td className="px-3 py-2">{d.jumlah}</td>
                      <td className="px-3 py-2">{d.barang?.hs_code || '-'}</td>
                      <td className="px-3 py-2">{d.barang?.pos_tarif ? d.barang.pos_tarif + '%' : '-'}</td>
                      <td className="px-3 py-2">{d.barang?.status_lartas || '-'}</td>
                      <td className="px-3 py-2">{d.no_invoice}</td>
                      <td className="px-3 py-2">{d.no_bl}</td>
                      <td className="px-3 py-2">{d.barang?.required_docs && Array.isArray(d.barang.required_docs) ? d.barang.required_docs.map(doc => doc.docs_type?.nama).filter(Boolean).join(' & ') : '-'}</td>
                      <td className="px-3 py-2">{d.barang?.instansi ? d.barang.instansi.nama_instansi : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={handleClosePibDialog} className="font-sans">Close</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
} 