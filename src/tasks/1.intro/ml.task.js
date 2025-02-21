const task = {
  slug: 'ml',
  name: 'Microlight display functions',
  is_enabled:true,
  description: 'Simply prints Hello world',
  inputs: {},
  fn: async function (ml, inputs) {
    await ml.log('Microlight exposes a number of display functions. Using this you can display feedback to the user');
    await ml.log('This is a log. Call this with ml.log("Hello world")');
    await ml.log('ml.json(data)');
    var data = {
      name:'microlight',
      author:'Alex J V',
      github:'https://github.com/IMGears/microlight',
    }
    await ml.json(data);
    await ml.log('ml.markdown(text)');
    await ml.markdown(`
      #### Process FG Details:
      - **Deleted:** 10
      - **Created:** 10
    `);
    await ml.log("ml.error(new Error('test error'))");
    await ml.error(new Error('test error'))
  }
};


export default task;
