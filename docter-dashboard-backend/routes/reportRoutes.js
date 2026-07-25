const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {

  getDashboardReport,

  exportReportPDF,

  exportReportExcel,

} = require("../controllers/reportController");

router.get(

  "/dashboard",

  protect,

  roleMiddleware("admin"),

  getDashboardReport

);

router.get(
  "/export/pdf",
  protect,
  roleMiddleware("admin"),
  exportReportPDF
);

router.get(

  "/export/excel",

  protect,

  roleMiddleware("admin"),

  exportReportExcel

);

module.exports = router;