import Controller from "../controllers/blog";
import Validator from "../validators/blog";
import Interceptor from "../interceptors/try-catch";
const Route = function (app, db) {
  const router = app.Router();

  const controller = Controller(app, db);
  const validate = Validator(app, db);

  router.post("/create", validate.create, Interceptor(controller.create));
  router.put("/update", validate.update, Interceptor(controller.update));
  router.delete("/delete", validate.delete, Interceptor(controller.delete));
  router.get(
    "/list/public",
    validate.listPublicBlogs,
    Interceptor(controller.listPublicBlogs)
  );
  router.get(
    "/list/mine",
    validate.listMineBlogs,
    Interceptor(controller.listMineBlogs)
  );

  return router;
};

export default Route;
