const db = require("../models");
const Barang = db.barang;
const csv = require("csv-parse");
const fs = require("fs");
const Required_Docs = db.required_docs;
const Instansi = db.instansi;
const PIB = db.pib;
const Detail_PIB = db.detail_pib;

// get all
exports.findAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  try {
    const barangs = await Barang.findAll({
      offset,
      limit,
      include: [
        { model: db.instansi },
        { model: db.required_docs, include: [{ model: db.docs_type }] }
      ]
    });
    if (!barangs || barangs.length === 0) {
      return res.status(404).json({ code: 404, message: "No barang found" });
    }
    res.json({
      code: 200,
      message: "Barang retrieved successfully",
      data: barangs,
    });
  } catch (err) {
    next(err);
  }
};

// get by id
exports.findOne = async (req, res, next) => {
  try {
    const barang = await Barang.findByPk(req.params.id, {
      include: [
        { model: db.instansi },
        { model: db.required_docs, include: [{ model: db.docs_type }] }
      ]
    });
    if (!barang) {
      return res.status(404).json({ code: 404, message: "Barang not found" });
    }
    res.json({
      code: 200,
      message: "Barang retrieved successfully",
      data: barang,
    });
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  const { part_number, hs_code, deskripsi, pos_tarif, status_lartas, satuan } =
    req.body;
  try {
    if (
      !part_number ||
      !hs_code ||
      !deskripsi ||
      !pos_tarif ||
      !status_lartas ||
      !satuan
    ) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing required fields" });
    }
    const barang = await Barang.create({
      part_number,
      hs_code,
      deskripsi,
      pos_tarif,
      status_lartas,
      satuan,
    });
    res.status(201).json({
      code: 201,
      message: "Barang created successfully",
      data: barang,
    });
  } catch (err) {
    next(err);
  }
};

// update by id
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { hs_code, deskripsi, pos_tarif, status_lartas, satuan } = req.body;
  try {
    const [num] = await Barang.update(
      { hs_code, deskripsi, pos_tarif, status_lartas, satuan },
      { where: { part_number: id } }
    );
    if (num === 1) {
      res.status(202).json({
        code: 202,
        message: "Barang updated successfully",
        data: { hs_code, deskripsi, pos_tarif, status_lartas, satuan },
      });
    } else {
      res.status(404).json({ code: 404, message: "Barang not found" });
    }
  } catch (err) {
    next(err);
  }
};

// delete by id
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const num = await Barang.destroy({ where: { part_number: id } });
    if (num === 1) {
      res.json({ code: 200, message: "Barang deleted successfully" });
    } else {
      res.status(404).json({ code: 404, message: "Barang not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.importBarang = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: "No file uploaded" });
  }
  const results = [];
  const errors = [];
  const importedBarang = [];
  const parser = fs.createReadStream(req.file.path).pipe(
    csv.parse({ columns: true, trim: true, skip_empty_lines: true, relax_column_count: true })
  );
  for await (const row of parser) {
    try {
      if (!row["PN"] || !row["HSCODE"]) continue;
      // 1. Instansi
      let id_instansi = null;
      const instanceName = row["INSTANCE"]?.trim();
      if (instanceName && instanceName !== "-" && instanceName !== "") {
        let instansi = await Instansi.findOne({ where: { nama_instansi: instanceName } });
        if (!instansi) {
          instansi = await Instansi.create({ nama_instansi: instanceName });
        }
        instansi = instansi.toJSON();
        id_instansi = instansi["id"];
      }
      // 2. Upsert Barang
      let barang = await Barang.findOne({ where: { part_number: row["PN"] } });
      if (!barang) {
        barang = await Barang.create({
          part_number: row["PN"],
          id_instansi: id_instansi,
          hs_code: row["HSCODE"],
          deskripsi: row["DESC"],
          pos_tarif: parseFloat((row["POS TARIF"] || '').replace('%', '')),
          status_lartas: row["STATUS"].toUpperCase(),
        });
      }
      // 3. Required Docs (upsert docs_type, always create required_docs if not exists)
      const docs = (row["REQUIRED DOCS"] || "").split("&").map((d) => d.trim()).filter((d) => d && d !== "-");
      for (const doc of docs) {
        let docsType = await db.docs_type.findOne({ where: { nama: doc } });
        if (!docsType) {
          docsType = await db.docs_type.create({ nama: doc });
        }
        docsType = docsType.toJSON();
        // Only create required_docs if not exists
        const exists = await db.required_docs.findOne({ where: { id_barang: row["PN"], id_docs_type: docsType["id"] } });
        if (!exists) {
          await db.required_docs.create({ id_barang: row["PN"], id_docs_type: docsType["id"] });
        }
      }
      // Collect info for frontend
      barang = await Barang.findOne({
        where: { part_number: row["PN"] },
        include: [
          { model: db.instansi },
          { model: db.required_docs, include: [{ model: db.docs_type }] }
        ]
      });
      importedBarang.push(barang);
      results.push({ part_number: row["PN"], status: "success" });
    } catch (err) {
      errors.push({ row: row, error: err.message });
    }
  }
  // 4. Create new PIB (timestamp only)
  let pib = null;
  try {
    pib = await PIB.create({}); // Add any required fields if needed
  } catch (err) {
    errors.push({ pib: null, error: 'Failed to create PIB: ' + err.message });
  }
  // Clean up uploaded file
  fs.unlinkSync(req.file.path);
  res.json({ code: 200, message: "Import completed", results, errors, pib_id: pib ? pib.id : null, barang: importedBarang });
};

exports.count = async (req, res, next) => {
  try {
    const count = await Barang.count();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
