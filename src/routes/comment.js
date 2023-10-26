import Controller from "../controllers/comment";
import Validator from "../validators/comment";
import Interceptor from "../interceptors/try-catch";
const Route = function (app, db) {
  const router = app.Router();
  const controller = Controller(app, db);
  const validate = Validator(app, db);
  router.post("/create", validate.create, Interceptor(controller.create));
  router.put("/update", validate.update, Interceptor(controller.update));
  router.post("/delete", validate.delete, Interceptor(controller.delete));
  router.post(
    "/getByBlogId",
    validate.getByBlogId,
    Interceptor(controller.getByBlogId)
  );
  return router;
};

export default Route;
