const express = require("express");
const router = express.Router();
const pibController = require("../controllers/pibController");

// GET /api/pib
router.get("/", pibController.findAll);

// GET /api/pib/count
router.get("/count", pibController.count);

// GET /api/pib/:id
router.get("/:id", pibController.findOne);

// POST /api/pib
router.post("/", pibController.create);

// PUT /api/pib/:id
router.put("/:id", pibController.update);

// DELETE /api/pib/:id
router.delete("/:id", pibController.delete);

module.exports = router;
