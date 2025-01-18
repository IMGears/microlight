import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Runs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // defaultValue: sequelize.literal("nextval('stock_consumption_id_seq'::regclass)")
    },
    task: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: { // can be pending, running, complete, failed, timeout
      type: DataTypes.TEXT,
      allowNull: true
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    logs: {
      type: DataTypes.JSON,
      allowNull: true
    },
    inputs: {
      type: DataTypes.JSON,
      allowNull: true
    },
    triggered_by: { // user,api,webhook,schedule
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
      // defaultValue: sequelize.literal("nextval('stock_consumption_id_seq'::regclass)")
    },
  }, {
    tableName: 'runs',
    timestamps: false,
    // schema: 'public'
  });
};


