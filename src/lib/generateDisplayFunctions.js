import microlightDB from "@/database/microlight";
import markdownit from 'markdown-it'
const md = markdownit();

const cleanMD = function(md){
  if(!md)
    md='<empty>';
  var lines = md.split('\n');
  var trimmed_lines=[];
  lines.forEach(function(line){
    trimmed_lines.push(line.trim())
  })
  return trimmed_lines.join('\n');
}
export default function generateDisplayfunctions(run_id){
  let ml = {
    log:async function(text){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'log',
        content:text,
      })
    },
    json:async function(data){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'json',
        content:JSON.stringify(data),
      })
    },
    markdown:async function(text){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'markdown',
        content:md.render(cleanMD(text)),
      })
    },
    error:async function(error){
      const data = {
        message:error.message,
        stack:error.stack,
      }
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'error',
        content: JSON.stringify(data),
      })
    },
    wait:async function(time){
      this.log(`waiting for ${time/1000} secs`);
      return await new Promise(resolve => setTimeout(resolve, time));
    },
    danger:async function(text){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'danger',
        content:text,
      })
    },
    warn:async function(text){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'warn',
        content:text,
      })
    },
    info:async function(text){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'info',
        content:text,
      })
    },
    success:async function(text){
      await microlightDB.Logs.create({
        created_at:new Date(),
        run:run_id,
        type:'success',
        content:text,
      })
    },
  };
  return ml;
}