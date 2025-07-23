const express = require("express");
const router = express.Router();
const detail_pibController = require("../controllers/detail_pibController");

// GET /api/detail_pib
router.get("/", detail_pibController.findAll);

// GET /api/detail_pib/count
router.get("/count", detail_pibController.count);

// GET /api/detail_pib/:id
router.get("/:id", detail_pibController.findOne);

// POST /api/detail_pib
router.post("/", detail_pibController.create);

// POST /api/detail_pib/bulk
router.post("/bulk", detail_pibController.bulkCreate);

// PUT /api/detail_pib/:id
router.put("/:id", detail_pibController.update);

// DELETE /api/detail_pib/:id
router.delete("/:id", detail_pibController.delete);

module.exports = router;
