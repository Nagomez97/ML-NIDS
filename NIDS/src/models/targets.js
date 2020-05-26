'use strict';
module.exports = (sequelize, DataTypes) => {
  const targets = sequelize.define('targets', {
    ip: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false
    },
    blocked: DataTypes.BOOLEAN
  }, {});
  targets.associate = function(models) {
    targets.hasMany(models.flows, {
      foreignKey: 'src_ip',
      sourceKey: 'ip'
    })
  };
  return targets;
};