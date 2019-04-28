'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('User', {
    user_id: {
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
    head_url: DataTypes.TEXT,
    device_id: DataTypes.STRING,
    login_type: DataTypes.STRING
  });
}
