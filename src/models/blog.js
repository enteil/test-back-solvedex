export default (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      summary: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      isPublic: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
      },
      publishAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      tableName: "Blogs",
      timestamps: true,
      hooks: {
        beforeCreate: (blog) => {
          if (blog.isPublic == true) {
            blog.publishAt = Date.now();
          }
        },
      },
    }
  );

  Blog.associate = function (models) {
    Blog.belongsTo(models.User, { foreignKey: "userId" });
    Blog.hasMany(models.Comment, { foreignKey: "blogId" });
  };

  Blog.createBlog = async function (data) {
    return await this.create(data);
  };

  return Blog;
};
