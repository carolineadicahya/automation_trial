const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// GET /api/barang
router.get("/", barangController.findAll);

// GET /api/barang/count
router.get("/count", barangController.count);

// GET /api/barang/:id
router.get("/:id", barangController.findOne);

// POST /api/barang
router.post("/", barangController.create);

// PUT /api/barang/:id
router.put("/:id", barangController.update);

// DELETE /api/barang/:id
router.delete("/:id", barangController.delete);

// POST /api/barang/import
router.post("/import", upload.single("file"), barangController.importBarang);

module.exports = router;
