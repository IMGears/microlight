import microlightDB from '@/database/microlight';
import async from 'async';
const task = {
  slug: 'delete_older_runs',
  name: 'Delete older runs',
  description: 'Dont keep runs older than a certain number of days. Delete them.',
  inputs: {
    retention_period: {
      name: "Retention Period (in days)",
      // description: "in YYYYMMDD format",
      default: 7,
      placeholder:'date to process this',
      type: 'number',
      required: true
    },
  },
  schedules:[
    {
      schedule:'0 2 * * *', // will run at 2am
      is_enabled:true,
      inputs:{
        retention_period:7
      }
    }
  ],
  fn: async function (ml, {retention_period}) {
    const workflow = {
      getDailyRunStats:async function(){
        const result = await microlightDB.Runs.findAll({
          attributes: [
            [microlightDB.sequelize.fn('DATE', microlightDB.sequelize.col('created_at')), 'date'],
            [microlightDB.sequelize.fn('COUNT', '*'), 'count']
          ],
          group: [microlightDB.sequelize.fn('DATE', microlightDB.sequelize.col('created_at'))],
          order: [[microlightDB.sequelize.fn('DATE', microlightDB.sequelize.col('created_at')), 'DESC']]
        });
        
        ml.log('Run counts by date:');
        result.forEach(row => {
          ml.log(`${row.dataValues.date}: ${row.dataValues.count} runs`);
        });
        
        return result;

      },
      deleteOlderRuns: async function() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retention_period);

        // Get the IDs of runs that will be deleted
        const runsToDelete = await microlightDB.Runs.findAll({
          attributes: ['id'],
          where: {
            created_at: {
              [microlightDB.Sequelize.Op.lt]: cutoffDate
            },
            status: {
              [microlightDB.Sequelize.Op.notIn]: ['running']
            }
          }
        });

        const runIds = runsToDelete.map(run => run.id);
        
        const deletedCount = await microlightDB.Runs.destroy({
          where: {
            created_at: {
              [microlightDB.Sequelize.Op.lt]: cutoffDate
            },
            status: {
              [microlightDB.Sequelize.Op.notIn]: ['running']
            }
          }
        });

        ml.log(`Deleted ${deletedCount} runs older than ${retention_period} days`);
        return { deletedCount, runIds };
      },
      deleteOlderLogs:['deleteOlderRuns', async function(results) {
        const { runIds } = results.deleteOlderRuns;

        // Skip if there are no runs to delete
        if (!runIds.length) {
          ml.log('No logs to delete - no runs were found');
          return 0;
        }

        const deletedCount = await microlightDB.Logs.destroy({
          where: {
            run: {
              [microlightDB.Sequelize.Op.in]: runIds
            }
          }
        });
        ml.log(`Deleted ${deletedCount} logs associated with deleted runs`);
        return deletedCount;
      }]
    }
    return await async.auto(workflow);
  }
};


export default task;
