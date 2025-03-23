
const task = {
  slug: 'takes_time',
  name: 'Task that takes time to run',
  is_enabled:true,
  description: 'Simply prints Hello world',
  inputs: {},
  fn: async function (ml, inputs) {
    await ml.log('This task is going to take time complete execution');
    await ml.wait(1000) // Wait for 1 seconds
    await ml.log('Doing step 1');
    await ml.wait(2000) // Wait for 2 seconds
    await ml.log('Doing step 2');
    await ml.wait(2000) // Wait for 2 seconds
    await ml.log('Doing step 3');
    await ml.wait(3000) // Wait for 3 seconds
    await ml.log('Doing step 4');
    await ml.wait(1000) // Wait for 1 seconds
    await ml.log('Doing step 5');
    await ml.wait(100) // Wait for 0.1 seconds
    await ml.log('Doing step 6');
    await ml.wait(100) // Wait for 0.1 seconds
    await ml.log('Doing step 7');
    await ml.wait(100) // Wait for 0.1 seconds
    await ml.wait(2000) // Wait for 2 seconds
    await ml.log('all done');
    
  }
};


export default task;
