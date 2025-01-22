const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
    res.json({"html": "<h1>Hello World</h1>"});
})

module.exports = router;