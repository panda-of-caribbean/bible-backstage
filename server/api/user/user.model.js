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
    email: DataTypes.TEXT,
    pid: DataTypes.INTEGER,
    password: DataTypes.STRING,
    remark: DataTypes.TEXT,
    DeviceID: DataTypes.STRING
  });
}
