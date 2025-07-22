const express = require("express");
const router = express.Router();
const instansiController = require("../controllers/instansiController");

// GET /api/instansi
router.get("/", instansiController.findAll);

// GET /api/instansi/:id
router.get("/:id", instansiController.findOne);

// POST /api/instansi
router.post("/", instansiController.create);

// PUT /api/instansi/:id
router.put("/:id", instansiController.update);

// DELETE /api/instansi/:id
router.delete("/:id", instansiController.delete);

module.exports = router;
