'use strict';
module.exports = (sequelize, DataTypes) => {
  const flows = sequelize.define('flows', {
    ip_src: DataTypes.STRING,
    ip_dst: DataTypes.STRING,
    port_dst: DataTypes.STRING,
    label: DataTypes.STRING,
    len_fwd: DataTypes.FLOAT,
    len_bwd: DataTypes.FLOAT,
    timestamp: DataTypes.STRING
  }, {});
  flows.associate = function(models) {
  };
  return flows;
};