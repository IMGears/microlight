import { Sequelize } from 'sequelize';
import Runs from './tables/Runs.model.js';
import Logs from './tables/Logs.model.js';
import sqlite3 from 'sqlite3';
import pg from 'pg';

/*======================Initialize Sequelize======================*/
let sequelize;
if(process.env.ML_DB_PG){
  sequelize= new Sequelize(process.env.ML_DB_PG, {
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true, // This will force the SSL requirement
        rejectUnauthorized: false // This is to avoid errors due to self-signed certificates
      }
    },
    dialectModule: pg
  });
}else{
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '.microlight/microlight.db',
    logging: false,
    dialectModule: sqlite3
  });
}

/*======================Initialize models======================*/
const models = {
  Runs: Runs(sequelize),
  Logs: Logs(sequelize),
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
// if (process.env.NODE_ENV === 'development') {
  await microlightDB.sync();
// }

export default microlightDB;
