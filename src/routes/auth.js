import Controller from "../controllers/auth";
import Validator from "../validators/auth";
import Interceptor from "../interceptors/try-catch";
const Route = function (app, db) {
  const router = app.Router();
  const controller = Controller(app, db);
  const validate = Validator(app, db);
  router.post(
    "/check/username",
    validate.checkEmail,
    Interceptor(controller.checkEmail)
  );
  router.post("/login", validate.login, Interceptor(controller.login));
  router.post("/logout", validate.logout, Interceptor(controller.logout));
  router.post("/register", validate.register, Interceptor(controller.register));
  return router;
};

export default Route;
