const express = require("express");
const router = express.Router();
const sarana_pengangkutanController = require("../controllers/sarana_pengangkutanController");

// GET /api/sarana_pengangkutan
router.get("/", sarana_pengangkutanController.findAll);

// GET /api/sarana_pengangkutan/:id
router.get("/:id", sarana_pengangkutanController.findOne);

// POST /api/sarana_pengangkutan
router.post("/", sarana_pengangkutanController.create);

// PUT /api/sarana_pengangkutan/:id
router.put("/:id", sarana_pengangkutanController.update);

// DELETE /api/sarana_pengangkutan/:id
router.delete("/:id", sarana_pengangkutanController.delete);

module.exports = router;
