import { check } from "express-validator";
import validOrAbort from "../middlewares/validate";
import _response from "../helpers/response";
import checkAuthMD from "../middlewares/check-auth";
import checkBlogMD from "../middlewares/blog/check-blog";
import checkMyCommentMD from "../middlewares/comment/check-my-comment";
export default function (app, db) {
  const { Comment } = db;
  const checkAuth = checkAuthMD(app, db);
  const checkBlog = checkBlogMD(app, db);
  const checkMyComment = checkMyCommentMD(app, db);
  return {
    create: [
      check("data.commentId").optional(),
      check("data.blogId").notEmpty().withMessage("data.blogId.required"),
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
      check("data.commentId").notEmpty().withMessage("data.commentId.required"),
      check("data.content")
        .notEmpty()
        .withMessage("data.content.required")
        .isLength({ min: 3 })
        .withMessage("data.content.minimumLength"),
      validOrAbort,
      checkAuth,
      checkMyComment,
    ],
    delete: [
      check("data.commentId").notEmpty().withMessage("data.commentId.required"),
      validOrAbort,
      checkAuth,
      checkMyComment,
    ],
    getByBlogId: [
      check("data.blogId").notEmpty().withMessage("data.blogId.required"),
      validOrAbort,
      checkAuth,
    ],
  };
}
