'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('User', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    pid: DataTypes.INTEGER,
    images:DataTypes.TEXT,
    password: DataTypes.STRING,
    remark: DataTypes.TEXT,
    device_id: DataTypes.STRING
  });
}
