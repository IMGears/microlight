import microlightDB from "./database/microlight"
import async from 'async';
import loadSchedules from "./lib/loadSchedules";
export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {

    await loadSchedules();
    // const interval = setInterval(async () => {
    //   await executeRuns();
    //   console.log('Instrumentation check running...');
    // }, 5000);

    // Clean up interval on process exit
    process.on('SIGTERM', () => {
      clearInterval(interval);
    });


    
  }
}


const executeRuns = async()=>{
  let workflow = {
    getPendingRunsCount:async function(){
      return await microlightDB.Runs.count({
        where: {
          status: 'pending'
        },
        raw:true,
      });
    },
    getPendingRuns:async function(){
      return await microlightDB.Runs.findOne({
        where: {
          status: 'pending'
        },
        limit:100,
        raw:true,
      });
    },
    executeRuns:['getPendingRuns',async function(results){
      console.log(results.getPendingRuns);
    }]
  }

  try{
    // let results = await async.auto(workflow);
    console.log('\n\n\n=====');
    console.log('pending:',results.getPendingRuns);
    console.log('started:',)
    console.log(results);
  }catch(e){
    console.log()
  }
}