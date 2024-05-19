const express = require("express");
const app = express.Router();
const AuthRoutes = require("./auth");
const ApiRoutes = require("./api");
const generatePDF = require("../helper/pdf")

app.use("/api/auth", AuthRoutes);
app.use("/api", ApiRoutes);

app.get('/salaryslips.pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req);
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = app;
