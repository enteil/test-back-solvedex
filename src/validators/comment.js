import { check } from "express-validator";
import validOrAbort from "../middlewares/validate";
import _response from "../helpers/response";
import checkAuthMD from "../middlewares/check-auth";
import checkBlogMD from "../middlewares/blog/check-blog";
import checkCommentMD from "../middlewares/comment/check-comment";
export default function (app, db) {
  const { Comment } = db;
  const checkAuth = checkAuthMD(app, db);
  const checkBlog = checkBlogMD(app, db);
  const checkComment = checkCommentMD(app, db);
  return {
    create: [
      check("data.commentId").optional(),
      check("data.blogId").notEmpty().withMessage("data.id.required"),
      check("data.content")
        .notEmpty()
        .withMessage("data.content.required")
        .isLength({ min: 3 })
        .withMessage("data.content.minimumLength"),
      validOrAbort,
      checkAuth,
      checkBlog,
      async (req, res, next) => {
        const { commentId } = req.body.data;
        console.log("🚀 ~ file: comment.js:26 ~ commentId:", commentId);
        if (commentId) {
          const comment = await Comment.findOne({
            where: {
              id: commentId,
            },
          });
          req.comment = comment || null;
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
      checkBlog,
      async (req, res, next) => {
        const { id, title } = req.body.data;
        const { user } = req;
        const otherBlog = await Blog.findOne({
          title,
          userId: user.id,
        });
        if (otherBlog && otherBlog.id != id && otherBlog.title == title) {
          return _response(req, res)(null, {
            code: "title.already.saved",
            status: 400,
          });
        }
        next();
      },
    ],
    delete: [
      check("data.id").notEmpty().withMessage("data.id.required"),
      validOrAbort,
      checkAuth,
      checkBlog,
    ],
  };
}
