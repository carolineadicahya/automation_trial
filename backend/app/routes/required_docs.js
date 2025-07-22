const express = require("express");
const router = express.Router();
const required_docsController = require("../controllers/required_docsController");

// GET /api/required_docs
router.get("/", required_docsController.findAll);

// GET /api/required_docs/:id
router.get("/:id", required_docsController.findOne);

// POST /api/required_docs
router.post("/", required_docsController.create);

// PUT /api/required_docs/:id
router.put("/:id", required_docsController.update);

// DELETE /api/required_docs/:id
router.delete("/:id", required_docsController.delete);

module.exports = router;
