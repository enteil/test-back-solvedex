export default function (app, db) {
  const { Blog, User, Comment } = db;
  return {
    create: async function (req) {
      const { data } = req.body;
      const { user } = req;
      const newBlogData = {
        userId: user.id,
        title: data.title,
        content: data.content,
        summary: data.summary,
        isPublic: data.isPublic,
      };
      await Blog.createBlog(newBlogData);
      return {};
    },
    update: async function (req) {
      const { data } = req.body;
      const { blog } = req;
      const newBlogData = {
        title: data.title,
        content: data.content,
        summary: data.summary,
        isPublic: data.isPublic,
      };
      await blog.update(newBlogData);
      return {};
    },
    delete: async function (req) {
      const { blog } = req;
      await blog.destroy();
      return {};
    },
    listPublicBlogs: async function (req) {
      const queryBuilder = {
        attributes: [
          "id",
          "title",
          "summary",
          "content",
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
          content: blog.content,
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
        attributes: [
          "id",
          "title",
          "summary",
          "content",
          "isPublic",
          "publishAt",
          [
            db.Sequelize.fn("COUNT", db.Sequelize.col("Comments.id")),
            "commentCount",
          ],
        ],
        include: [
          {
            model: Comment,
            attributes: [],
            duplicating: false,
            required: false,
          },
        ],
        where: {
          userId: user.id,
        },
        group: ["Blog.id"],
      };
      const result = [];
      const blogs = await Blog.findAll(queryBuilder);
      blogs.forEach((blog) => {
        result.push({
          id: blog.id,
          title: blog.title,
          summary: blog.summary,
          isPublic: blog.isPublic,
          publishAt: blog.publishAt || "",
          content: blog.content,
          comments: blog.dataValues.commentCount,
        });
      });
      return {
        blogs: result,
      };
    },
  };
}
