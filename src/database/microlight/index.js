import { Sequelize } from 'sequelize';
import Run from './tables/Run.model.js';
import sqlite3 from 'sqlite3';

/*======================Initialize Sequelize======================*/
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'src/database/microlight/data/microlight.db',
  logging: false,
  dialectModule: sqlite3
});

/*======================Initialize models======================*/
const models = {
  Run: Run(sequelize),
  // Schedule: Schedule(sequelize),
};

//Create db object
const microlightDB = {
  ...models,
  sequelize,
  Sequelize,
  // Add sync method as a property using arrow function
  sync: (...args) => sequelize.sync(...args),
};

// Only sync database in development mode
if (process.env.NODE_ENV === 'development') {
  await microlightDB.sync();
}

export default microlightDB;
