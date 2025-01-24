const express = require("express");
const marked = require("marked");
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache();

router.post("/", async (req, res) => {
    const { markdown } = req.body;

    if (!markdown) {
        return res.status(400).json({error: "Markdown is required. Please send with { \"markdown\": {markdown} }"});
    }

    const cacheKey = `markdown:${markdown}`
    const cachedHtml = cache.get(cacheKey);

    if (cachedHtml) {
        return res.json({ html: cachedHtml });
    }

    try {
        const html = marked.parse(markdown);
        cache.set(cacheKey, html);
        res.json({html});
    } catch (err) {
        res.status(500).json({error: `Error rendering Markdown: ${err.message}`})
    }
})

module.exports = router;