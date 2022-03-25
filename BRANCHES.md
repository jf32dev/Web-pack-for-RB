# bigtincan hub web app v5

## Branches
See [this article](http://nvie.com/posts/a-successful-git-branching-model/) for an explanation of how we handle our branches.

### Supporting branches
The different types of branches we use are:

  - Feature branches
  - Release branches
  - Hotfix branches

#### Feature branches
May branch off from: `develop`

Must merge back into: `develop`

Branch naming convention: anything except `master`, `develop`, `release-*`, or `hotfix-*` 

##### Creating a feature branch
When starting work on a new feature, branch off from the develop branch.

    git checkout -b myfeature develop

##### Incorporating a finished feature on develop
Finished features may be merged into the develop branch to definitely add them to the upcoming release:

    git checkout develop
    git merge --no-ff myfeature
    git branch -d myfeature
    git push origin develop

The `--no-ff` flag causes the merge to always create a new commit object. Once our feature branch is merged it is safe to delete.

#### Release branches
May branch off from: `preview`

Must merge back into: `preview` and `master`

Branch naming convention: `release-*`

When `develop` is ready, it may be merged in to `preview` in preparation for release.

##### Creating a release branch

    git checkout -b release-5.2 preview
    # (update release version numbers in package.json etc.)
    git commit -a -m "Bumped version number to 5.2"

This new branch may exist for a while, until the release may be rolled out definitely. During that time, bug fixes may be applied in this branch (rather than on the `develop` branch). Adding large new features here is strictly prohibited.

##### Finishing a release branch
When a release is ready, we merge in to `master` and tag with the version number for future reference. 

    git checkout master
    git merge --no-ff release-5.2
    git tag -a 5.2

To keep any changes made in the release branch, we must merge them back to `develop`.

    git checkout develop
    git merge --no-ff release-5.2

This step may lead to a merge conflict (at least from changing the version number), if so, fix and commit it.

We are now done and safe to remove the feature branch

    git branch -d release-5.2

#### Hotfix branches
May branch off from: `preview` or `master`.

May merge back into: `develop`, `preview`, `master`.

Branch naming convention: `hotfix-*` 

In most cases, `master` and `preview` will be equivalent.

    git checkout preview

Create a fix branch.

    git checkout -b hotfix-HWv5-99

Make sure any submodules are checked out at the correct commit.

    git diff _assets/style-guide

If commit differs, check it out.

    cd _assets/style-guide
    git checkout commitid

Make your desired changes, commit and merge to `preview` for testing.

    git checkout preview
    git merge --no-ff hotfix-HWv5-99
    git push

When testing is complete, merge the fix branch to `master` and `develop` is applicable.
  
    git checkout master
    git merge --no-ff hotfix-HWv5-99
