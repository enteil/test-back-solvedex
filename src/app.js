import dotenv from "dotenv";
import express, { Router } from "express";
import cors from "cors";
import Models from "./models";
import Routes from "./routes";
import response from "./helpers/response";

dotenv.config();

const app = express();
const db = new Models();
const routes = new Routes(express, db, response);

const COLORS = {
  YELLOW: "\x1b[33m",
  CYAN: "\x1b[36m",
};

const clog = (color, text) => {
  console.log(color, text);
};

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/", (req, res) => {
  res.send("¡Hola desde Express!");
});

const router = Router();
app.use("/api/v1", router);
router.use("/auth", routes.Auth);

app.listen(process.env.PORT, () => {
  clog(COLORS.YELLOW, "APP SOLVEDEX");
  clog(COLORS.CYAN, `Running on port ${process.env.PORT}`);
  clog(COLORS.CYAN, `Environment mode ${process.env.ENV}`);
});
