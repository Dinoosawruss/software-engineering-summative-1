const request = require("supertest");
const express = require("express");
const marked = require("marked");
const renderRoute = require("../src/routes/render");

const app = express();
app.use(express.json());
app.use("/render", renderRoute);

describe("POST /render", () => {
    it("should return rendered HTML for valid Markdown heading input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "# Hello World" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<h1>Hello World</h1>");
    });

    it("should return rendered HTML for valid Markdown link input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "[See Google](https://google.com/)" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<a href=\"https://google.com/\">See Google</a>");
    });

    it("should return rendered HTML for valid Markdown code block input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "```print('Hello World')```" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<code>print(&#39;Hello World&#39;)</code>");
    });

    it("should return rendered HTML for valid Markdown image input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "![My Image](./image.png)" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<img src=\"./image.png\" alt=\"My Image\">");
    });

    it("should return rendered HTML for valid Markdown further heading level inputs", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<h1>H1</h1>\n<h2>H2</h2>\n<h3>H3</h3>\n<h4>H4</h4>\n<h5>H5</h5>\n<h6>H6</h6>");
    });

    it("should return rendered HTML for valid Markdown alternate heading input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "H2\n--" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<h2>H2</h2>");
    });

    it("should return rendered HTML for valid Markdown bold input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "**Bold**" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<strong>Bold</strong>");
    });

    it("should return rendered HTML for valid Markdown italics input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "*Italic*" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<em>Italic</em>");
    });

    it("should return rendered HTML for valid Markdown bold italics input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "***Bold Italic***" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<em><strong>Bold Italic</strong></em>");
    });

    it("should return rendered HTML for valid Markdown quote input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "> Thou shall not pass!" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<blockquote>\n<p>Thou shall not pass!</p>\n</blockquote>");
    });

    it("should return rendered HTML for valid Markdown unordered list input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "1. First\n2. Second" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<ol>\n<li>First</li>\n<li>Second</li>\n</ol>");
    });

    it("should return rendered HTML for valid Markdown ordered list input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "- Item\n- Another Item" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<ul>\n<li>Item</li>\n<li>Another Item</li>\n</ul>");
    });

    it("should return rendered HTML for valid Markdown horizontal rule input", async () => {
        const response = await request(app)
            .post("/render")
            .send({ markdown: "---" });

        expect(response.status).toBe(200);
        expect(response.body.html).toContain("<hr>");
    });
});
