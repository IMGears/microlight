# Decisions

### Why degit?
So that it can setup a scafolding. Storybook also runs a server without using degit. Maybe simple stuff like that is good enough.


### Why not an npm package that can run a server? 
Yes possible. Donno how to do it. So not done. 

### Why microlight have a database? 
So that it can store the history of execution. 

### Create a microlight 

### Run a demo server


### Should microlight have login? 


### Database support?


### Switch to Nextjs

Unlike sailsjs, nextjs has 2 specific benefits
- changes made to task will reflect in the dev server without restarting the server. Sailsjs by default needs a server restart. This slows down the dev process
- Since the server does not need a restart, its easier to run/test the script from the dev server UI than to execute it from the terminal
- its easier to implement streaming html in Nextjs. Currently sailsjs app does not give any user feedback when the task is running. If the task takes 60 secs to complete, all output is servered after 60secs. This makes it feel slow. If we can present the output to the customer as and when we process it - via streaming, the user feels it is fast. This is easier to do in Nextjs. 
- Exist sailsjs. As a team we have stopped using sailsjs for other projects. makes sense to exit sails from this project as well.