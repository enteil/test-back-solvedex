import _response from "../../helpers/response";
export default function (app, db) {
  const { Blog } = db;
  return async (req, res, next) => {
    const { blogId } = req.body.data;
    const { user } = req;
    try {
      const currentBlog = await Blog.findOne({
        where: {
          id: blogId,
          userId: user.id,
        },
      });
      if (!currentBlog) {
        return _response(req, res)(null, {
          code: "blog.notFound",
          status: 400,
        });
      }
      req.blog = currentBlog;
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
