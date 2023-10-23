export default function (app, db) {
  const { Blog } = db;
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
  };
}
