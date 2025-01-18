const task = {
  slug: 'hello_world',
  name: 'Hello World',
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
