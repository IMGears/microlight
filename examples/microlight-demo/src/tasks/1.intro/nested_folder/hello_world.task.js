const task = {
  slug: 'hello_world2',
  name: 'Hello World from nested folder',
  is_enabled:true,
  description: 'Simply prints Hello world',
  inputs: {
    name:{
      name: "Name",
      description: "Name of the person",
      // default: new Date(Date.now() - 86400000).toISOString().substring(0,10),
      default: 'World',
      placeholder:'Your name',
      type: 'string',
      required: false
    },
  },
  fn: async function (ml, inputs) {
    ml.log('hello world');
  }
};


export default task;
