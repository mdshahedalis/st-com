const express = require("express");
const router = express.Router();

const { getAllSpecialists, createSpecialist, updateSpecialist, publishSpecialist, getSpecialistById } = require("../controllers/specialist");


router.get("/", getAllSpecialists);

router.get("/:id", getSpecialistById);

router.post("/", createSpecialist);

router.put("/:id", updateSpecialist);

router.post("/:id/publish", publishSpecialist);

module.exports = router;
