'use strict';
module.exports = (sequelize, DataTypes) => {
  const flows = sequelize.define('flows', {
    ip_src: DataTypes.STRING,
    ip_dst: DataTypes.STRING,
    port_dst: DataTypes.STRING,
    label: DataTypes.STRING
  }, {});
  flows.associate = function(models) {
    // associations can be defined here
  };
  return flows;
};