## Getting Started
```shell
# clone the repo
git clone git@github.com:IMGears/microlight.git

# rename the folder if required
mv microlight internal-tools-microlight

# cd
cd internal-tools-microlight

# rename origin to microlight
git remote rename origin microlight
# verify that remote has changed
git remote -v

# go to github and create a new repository
# add new remote origin pointing to newly created repo
git remote add origin git@github.com:IMGears/internal-tools-microlight.git

# push code to origin
git push -u origin main

# start server
npm run dev

# microlight is a nextjs server. So all nextjs deployment pattern works. 
```


