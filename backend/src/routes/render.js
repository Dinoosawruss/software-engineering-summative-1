const express = require("express");
const marked = require("marked");
const NodeCache = require("node-cache");
const sanitizeHtml = require("sanitize-html");

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
        const rawHtml = marked.parse(markdown);
        const sanitizedHtml = sanitizeHtml(rawHtml);
        cache.set(cacheKey, sanitizedHtml);
        res.json({ html: sanitizeHtml });
    } catch (err) {
        res.status(500).json({error: `Error rendering Markdown: ${err.message}`})
    }
})

module.exports = router;