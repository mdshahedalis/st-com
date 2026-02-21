const express = require("express");
const router = express.Router();

const { getAllSpecialists, createSpecialist, updateSpecialist, publishSpecialist, getSpecialistById, previewPricing, deleteSpecialist } = require("../controllers/specialist");


router.get("/", getAllSpecialists);

router.get("/preview-pricing", previewPricing);

router.get("/:id", getSpecialistById);

router.post("/", createSpecialist);

router.put("/:id", updateSpecialist);

router.post("/:id/publish", publishSpecialist);

router.delete("/:id", deleteSpecialist);


module.exports = router;
