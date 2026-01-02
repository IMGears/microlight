# Getting Started

## Create a new project

```shell
# Create new project using @microlight/cli
npx @microlight/cli new internal-tools-microlight

# cd
cd internal-tools-microlight

# install all dependencies
npm install

# start server
npm run dev
```

Microlight is a Next.js server. All Next.js deployment patterns work.

## Push to remote repository

```shell
# go to github and create a new repository
# add new remote origin pointing to newly created repo
git remote add origin git@github.com:YourOrg/internal-tools-microlight.git

# push code to origin
git push -u origin main
```

## Next steps

- [Writing Tasks](/docs/guide/writing-tasks.md) - Learn how to create your first task
- [Input Types](/docs/guide/inputs.md) - Accept user input in your tasks
- [ML Functions](/docs/guide/ml-functions.md) - Output feedback to the UI
