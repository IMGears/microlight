Microlight next is a rewrite of microlight in nextjs


## Getting Started
```shell
# clone the repo
git clone git@github.com:IMGears/microlight-next.git

# rename the folder
mv microlight-next internal-tools-microlight-next

# cd
cd internal-tools-microlight-next

# rename origin to microlight
git remote rename origin microlight
# verify that remote has changed
git remote -v

# go to github and create a new repository
# add new remote origin pointing to newly created repo
git remote add origin git@github.com:IMGears/internal-tools-microlight-next.git

# push code to origin
git push -u origin main
```


## Updating microlight

```shell
# Fetch the latest changes
git fetch microlight


# Merge the changes (might require resolving conflicts)
git merge microlight/main --allow-unrelated-histories
```