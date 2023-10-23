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
    listPublicBlogs: async function (req) {
      const queryBuilder = {
        attributes: [
          "id",
          "title",
          "summary",
          "publishAt",
          [
            db.Sequelize.fn("COUNT", db.Sequelize.col("Comments.id")),
            "commentCount",
          ],
        ],
        include: [
          {
            attributes: ["names", "lastNames"],
            model: User,
            required: true,
          },
          {
            model: Comment,
            attributes: [],
            duplicating: false,
            required: false,
          },
        ],
        where: {
          isPublic: true,
        },
        group: ["Blog.id", "User.id"],
      };
      const result = [];
      const blogs = await Blog.findAll(queryBuilder);
      blogs.forEach((blog) => {
        result.push({
          id: blog.id,
          title: blog.title,
          summary: blog.summary,
          comments: blog.dataValues.commentCount,
          publishAt: blog.publishAt,
          user: {
            names: blog.User.names,
            lastNames: blog.User.lastNames,
          },
        });
      });
      return {
        blogs: result,
      };
    },
    listMineBlogs: async function (req) {
      const { user } = req;
      const queryBuilder = {
        attributes: ["id", "title", "summary", "isPublic", "publishAt"],
        where: {
          userId: user.id,
        },
        raw: true,
      };
      const result = [];
      const blogs = await Blog.findAll(queryBuilder);
      blogs.forEach((blog) => {
        result.push({
          id: blog.id,
          title: blog.title,
          summary: blog.summary,
          content: blog.content,
          isPublic: blog.isPublic,
          publishAt: blog.publishAt || "",
        });
      });
      return {
        blogs: result,
      };
    },
  };
}
