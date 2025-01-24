const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
// const rateLimit = require("express-rate-limit");

const fontsRoute = require("./routes/fonts");
const renderRoute = require("./routes/render");

// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 500, // Rate limit is 500 requests per minute
//     message: "Too many requests",
// })

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(morgan("dev"))
app.use(express.json());

app.use("/fonts", fontsRoute);
// app.use("/render", limiter);
app.use("/render", renderRoute);

app.listen(PORT, () => console.log(`Server us running on http://localhost:${PORT}`));