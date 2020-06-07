'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};