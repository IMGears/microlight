const task = {
  slug: 'delete_older_runs',
  name: 'Delete older runs',
  description: 'Dont keep runs older than a certain number of days. Delete them.',
  inputs: {
    retain_for_days: {
      name: "Days",
      // description: "in YYYYMMDD format",
      default: 7,
      placeholder:'date to process this',
      type: 'number',
      required: true
    },
    date: {
      name: "Days",
      // description: "in YYYYMMDD format",
      default: new Date().toISOString().substring(0,10),
      placeholder:'date to process this',
      type: 'date',
      required: false
    },
  },
  fn: async function (ml, {date, bucketName, fileName}) {
    
  }
};


export default task;
