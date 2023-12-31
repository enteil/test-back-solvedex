import _response from "../../helpers/response";
export default function (app, db) {
  const { Comment } = db;
  return async (req, res, next) => {
    const { commentId } = req.body.data;
    const { user } = req;
    try {
      const comment = await Comment.findOne({
        where: {
          id: commentId,
          userId: user.id,
        },
      });
      if (!comment) {
        return _response(req, res)(null, {
          code: "comment.notFound",
          status: 400,
        });
      }
      req.comment = comment;
      next();
    } catch (error) {
      console.error(Date.now(), error);
      return _response(req, res)(null, {
        err: error,
        code: "server.error",
        status: 500,
      });
    }
  };
}
