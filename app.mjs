import express from "express";
import bodyParser from "body-parser";
import questionsRouter from "./questions.mjs";

const app = express();
const port = 4001;

app.use(bodyParser.json());

app.use("/questions", questionsRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
