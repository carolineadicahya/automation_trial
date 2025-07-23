const express = require("express");
const router = express.Router();
const docsTypeController = require("../controllers/docs_typeController");

// GET /api/docs_type
router.get("/", docsTypeController.findAll);
// GET /api/docs_type/count
router.get("/count", docsTypeController.count);
// GET /api/docs_type/:id
router.get("/:id", docsTypeController.findOne);
// POST /api/docs_type
router.post("/", docsTypeController.create);
// PUT /api/docs_type/:id
router.put("/:id", docsTypeController.update);
// DELETE /api/docs_type/:id
router.delete("/:id", docsTypeController.delete);

module.exports = router; 