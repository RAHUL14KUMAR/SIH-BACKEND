require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");
const connection = require("./database/db");

const userRoute = require("./routes/userRoutes");

const port=process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("hello!!!!");
});

app.use("/user", userRoute);

app.use(errorMiddleware);

connection();
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
  