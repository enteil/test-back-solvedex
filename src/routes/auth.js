import Controller from "../controllers/auth";
import Validator from "../validators/auth";
import Interceptor from "../interceptors/try-catch";
const Route = function (app, db, services) {
  const router = app.Router();

  const controller = Controller(app, db, services);
  const validate = Validator(app, db, services);

  router.post(
    "/check/username",
    validate.checkUsername,
    Interceptor(controller.checkUsername)
  );
  router.post("/login", validate.login, Interceptor(controller.login));

  return router;
};

export default Route;
