const express = require("express");
const marked = require("marked");

const router = express.Router();

router.post("/", (req, res) => {
    const { markdown } = req.body;

    if (!markdown) {
        return res.status(400).json({error: "Markdown is required. Please send with { \"markdown\": {markdown} }"});
    }

    const html = marked.parse(markdown);
    res.json({html});

})

module.exports = router;