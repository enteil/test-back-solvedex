import { check } from "express-validator";
import _response from "../helpers/response";
import validOrAbort from "../middlewares/validate";
import checkAuthMD from "../middlewares/check-auth";
import checkBlogMD from "../middlewares/blog/check-blog";
export default function (app, db) {
  const { Blog } = db;
  const checkAuth = checkAuthMD(app, db);
  const checkBlog = checkBlogMD(app, db);
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
      check("data.blogId").notEmpty().withMessage("data.id.required"),
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
      checkBlog,
      async (req, res, next) => {
        const { blogId, title } = req.body.data;
        const { user } = req;
        const otherBlog = await Blog.findOne({
          title,
          userId: user.id,
        });
        if (otherBlog && otherBlog.id != blogId && otherBlog.title == title) {
          return _response(req, res)(null, {
            code: "title.already.saved",
            status: 400,
          });
        }
        next();
      },
    ],
    delete: [
      check("data.blogId").notEmpty().withMessage("data.id.required"),
      validOrAbort,
      checkAuth,
      checkBlog,
    ],
    listPublicBlogs: [checkAuth],
    listMineBlogs: [checkAuth],
  };
}
