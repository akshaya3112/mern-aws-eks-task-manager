const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Test Route
router.get("/", (req, res) => {
    res.json({
        message: "Test Route Working Successfully ✅"
    });
});

router.post("/", (req, res) => {
    res.json({
        message: "POST request received successfully ✅",
        data: req.body
    });
});

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "Welcome! You have accessed a protected route 🎉",
    user: req.user,
  });
});

module.exports = router;