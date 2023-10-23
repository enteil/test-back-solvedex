export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
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
      blogId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      commentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      paranoid: true,
      tableName: "Comments",
      timestamps: true,
    }
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.User, { foreignKey: "userId" });
    Comment.belongsTo(models.Blog, { foreignKey: "blogId" });
    Comment.belongsTo(models.Comment, {
      foreignKey: "commentId",
      as: "parentComment",
    });
    Comment.hasMany(models.Comment, { foreignKey: "commentId", as: "replies" });
  };

  Comment.createComment = async function (data) {
    return await this.create(data);
  };

  return Comment;
};
