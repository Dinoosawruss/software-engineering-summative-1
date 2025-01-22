const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan("dev"))
app.use(express.json());

app.listen(PORT, () => console.log(`Server us running on http://localhost:${PORT}`));