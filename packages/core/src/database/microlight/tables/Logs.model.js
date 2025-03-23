import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Logs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // defaultValue: sequelize.literal("nextval('stock_consumption_id_seq'::regclass)")
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    type: { // can be log,json,markdown
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: { // can be pending, running, complete, failed, timeout
      type: DataTypes.TEXT,
      allowNull: true
    },
    run: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'logs',
    timestamps: false,
    // schema: 'public'
  });
};


