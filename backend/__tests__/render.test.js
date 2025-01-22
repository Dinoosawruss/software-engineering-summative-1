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
});
