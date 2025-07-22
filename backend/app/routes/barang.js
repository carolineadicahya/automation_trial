const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");

// GET /api/barang
router.get("/", barangController.findAll);

// GET /api/barang/:id
router.get("/:id", barangController.findOne);

// POST /api/barang
router.post("/", barangController.create);

// PUT /api/barang/:id
router.put("/:id", barangController.update);

// DELETE /api/barang/:id
router.delete("/:id", barangController.delete);

module.exports = router;
