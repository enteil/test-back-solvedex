import { check } from "express-validator";
import validOrAbort from "../middlewares/validate";
import _response from "../helpers/response";
import checkAuthMD from "../middlewares/check-auth";
export default function (app, db) {
  const { Blog } = db;
  const checkAuth = checkAuthMD(app, db);
  return {
    create: [
      check("data.title")
        .notEmpty()
        .withMessage("data.title.required")
        .isLength({ min: 3 })
        .withMessage("data.title.minimumLength"),
      check("data.content")
        .notEmpty()
        .withMessage("data.content.required")
        .isLength({ min: 3 })
        .withMessage("data.content.minimumLength"),
      check("data.summary")
        .notEmpty()
        .withMessage("data.summary.required")
        .isLength({ min: 3 })
        .withMessage("data.summary.minimumLength"),
      check("data.isPublic").optional(),
      validOrAbort,
      checkAuth,
      async (req, res, next) => {
        const { title } = req.body.data;
        const { user } = req;
        const blog = await Blog.findOne({
          where: {
            title,
            userId: user.id,
          },
        });
        if (blog) {
          return _response(req, res)(null, {
            code: "title.already.saved",
            status: 400,
          });
        }
        next();
      },
    ],
    update: [
      check("data.id").notEmpty().withMessage("data.id.required"),
      check("data.title")
        .notEmpty()
        .withMessage("data.title.required")
        .isLength({ min: 3 })
        .withMessage("data.title.minimumLength"),
      check("data.content")
        .notEmpty()
        .withMessage("data.content.required")
        .isLength({ min: 3 })
        .withMessage("data.content.minimumLength"),
      check("data.summary")
        .notEmpty()
        .withMessage("data.summary.required")
        .isLength({ min: 3 })
        .withMessage("data.summary.minimumLength"),
      check("data.isPublic").optional(),
      validOrAbort,
      checkAuth,
      async (req, res, next) => {
        const { id, title } = req.body.data;
        const { user } = req;
        const blog = await Blog.findOne({
          where: {
            title,
            userId: user.id,
          },
        });
        if (blog && id != blog.id) {
          return _response(req, res)(null, {
            code: "title.already.saved",
            status: 400,
          });
        }
        next();
      },
    ],
  };
}
