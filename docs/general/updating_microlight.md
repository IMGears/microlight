## Updating microlight

setup microlight as a remote-tracking branch. You can keep pulling from this branch occasionally and merging the content

```shell
# Fetch the latest changes
git fetch microlight


# Merge the changes (might require resolving conflicts)
git merge microlight/main --allow-unrelated-histories
```