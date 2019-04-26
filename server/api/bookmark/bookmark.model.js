'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Bookmark', {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    progress: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER

  });
}
