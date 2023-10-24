import moment from "moment";
export default function (app, db) {
  const { Blog, User, Comment } = db;
  return {
    create: async function (req) {
      const { user, blog, comment } = req;
      const { data } = req.body;
      const newCommentData = {
        userId: user.id,
        blogId: blog.id,
        commentId: (comment && comment.id) || null,
        content: data.content,
      };
      await Comment.createComment(newCommentData);
      return {};
    },
    update: async function (req) {
      const { data } = req.body;
      const { comment } = req;
      const newCommentData = {
        content: data.content,
      };
      await comment.update(newCommentData);
      return {};
    },
    delete: async function (req) {
      const { comment } = req;
      await comment.destroy();
      return {};
    },
    getByBlogId: async function (req) {
      const { blogId } = req.body.data;
      const queryBuilder = {
        attributes: ["id", "content", "createdAt", "commentId", "userId"],
        include: [
          {
            attributes: ["names", "lastNames"],
            model: User,
            required: true,
          },
        ],
        where: {
          blogId,
        },
      };
      const allComments = await Comment.findAll(queryBuilder);
      const buildRecursiveComments = (parentId) => {
        const commentsForParent = allComments
          .filter((comment) => comment.commentId === parentId)
          .map((comment) => {
            return {
              id: comment.id,
              content: comment.content,
              createdAt: comment.createdAt,
              user: {
                names: comment.User.names,
                lastNames: comment.User.lastNames,
              },
              replies: buildRecursiveComments(comment.id),
            };
          });
        return commentsForParent;
      };
      const topLevelComments = buildRecursiveComments(null);
      return {
        comments: topLevelComments,
      };
    },
  };
}
