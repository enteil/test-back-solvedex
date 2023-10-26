import dotenv from "dotenv";
import express, { Router } from "express";
import Models from "./models";
import Routes from "./routes";

dotenv.config();

const app = express();
const db = new Models();
const routes = new Routes(express, db);

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

app.post("/", (req, res) => {
  res.send("¡Hola desde Express!");
});

const router = Router();
app.use("/api/v1", router);
router.use("/auth", routes.Auth);
router.use("/blog", routes.Blog);
router.use("/comment", routes.Comment);

app.listen(process.env.PORT, () => {
  clog(COLORS.YELLOW, "APP SOLVEDEX");
  clog(COLORS.CYAN, `Running on port ${process.env.PORT}`);
  clog(COLORS.CYAN, `Environment mode ${process.env.ENV}`);
});
