const express = require("express");
const marked = require("marked");

const router = express.Router();

router.post("/", (req, res) => {
    const { markdown } = req.body;

    const html = marked.parse(markdown);
    res.json({html});

})

module.exports = router;