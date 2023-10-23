import Controller from "../controllers/blog";
import Validator from "../validators/blog";
import Interceptor from "../interceptors/try-catch";
const Route = function (app, db) {
  const router = app.Router();

  const controller = Controller(app, db);
  const validate = Validator(app, db);

  router.post("/create", validate.create, Interceptor(controller.create));

  return router;
};

export default Route;
