const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    const fonts = [
        { name: "Courier Prime", value: "\"Courier Prime\", monospace" },
        { name: "Arial", value: "Arial" },
        { name: "Verdana", value: "Verdana" },
        { name: "Georgia", value: "Georgia" },
    ];
    res.json(fonts);
});

module.exports = router;