![Logo](packages/microlight/public/logo500.png)

- [Docs](/docs/docs.md)
- [Change Log](packages/microlight/changelog.md)

## Getting started
```shell
# Create new project using @microlight/cli
npx @microlight/cli new internal-tools-microlight

# cd
cd internal-tools-microlight

# install all dependancies
npm install

# start server
npm run dev
# microlight is a nextjs server. So all nextjs deployment pattern works. 
```
Read the [docs](/docs/docs.md) for more instructions.



## About
Microlight is a simple task(cron and adhoc) runner. The idea is this, there are tasks that needs to be done. For developers its easy to write a small script to execute the task - e.g. restart AWS redis. But to ask marketing team/sales team to restart redis by running a script is not practical. At the same time, as a small team, the devops guy getting called by the sales team to restart redis is also not practical. 

This is a solution for small teams. This enables tech team to offload operational tasks to the actual team who needs the task to be executed. This also allows the stack to be light weight and tech teams can write simple scripts to do this. 

Example usecases, 
- restart redis/some server when overloaded. 
- get fresh data . e.g. customer support person wants to know if customer has made a payment. Lets assume your system is not realtime and the CS person wants to trigger a sync. 
- cron jobs

Microlight is designed with the following principles in mind
- Microlight is designed for light work loads such as 
  - personal use, 
  - small company - less than 10 people 
  - simple data pipeline usecases
  - simple automation/devops usecases
- Running tasks should feel simple and easy
  - Developers gets to write scripts to automate a task. 
  - Business team members gets to trigger the job at their convinience using a UI. 
  - Webhooks for other subsystems to trigger jobs
- Setting up and running microlight should be very easy and should have small footprint
  - Single instance by design - no cluster config overhead
  - uses sqlite only - host everything in one single server/container


Microlight also provides a UI for users to run cron jobs

Ways to trigger a job: 
- Trigger jobs from UI
- Trigger jobs via webhooks
- Trigger jos from cronjob 


### Microlight can do
- Execution logic has to be written with code (will not no support no code ever)
- Tasks can be executed by non techincal people from a GUI
- Tasks can be scheduled 
- Show console logs and execution output

thats it

### Microlight cannot and will not do
- No code support
- Multiple server or master/worker mode



### Simplicity

Microlight is designed as simple solution. This is not designed for massive scale. Intentionally Microlight does not support master/worker node. The Microlight server and the execution of task happens on the same machine. If you are looking for a multi node setup, then we recomment using rundeck. For most small startups, rundeck is an overkill. Scaling microlight can only be done by vertical scaling (increasing the size of the server). Microlight does not support horizontal scaling. Microlight is **NOT** designed to scale horizontally. This is intentional. 

Microlight also uses sqlite. So you can run all microlight dependancies on one machine/container. 


## Alternatives to microlight

- trigger.dev
- rundeck.com
- activepieces.com

Microlight is the stripped down, simple version of these meant to be run on a single instance. 

Compared to these solutions, 
- microlight does **NOT** support horizontal scaling
- microlight does **NOT** have a hosted solution
- microlight does **NOT** support drag and drop UI tasks. 
- microlight requires you to write scripts using a text editor and commit the code
- microlight is suitable for one man tech team

You should choose one of the alternatives if any of the above points are deal breakers. 


