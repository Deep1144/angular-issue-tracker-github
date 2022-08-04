## How to run project?

### Steps:

- do `yarn install` to install dependencies
- run `yarn run dev` or `npm run dev` command to start the project


## Information About the API used:

We could have used https://docs.github.com/en/rest/issues/issues#list-repository-issues
this API to get the list of issues, but the problem with this API is  it does not provided total count of issues (which we will need for pagination)

even call for getting information about repository only provides count of open issues and not of closed once,

So, we are using search API instead as stated here in this comment
https://stackoverflow.com/questions/49207654/how-to-find-number-of-closed-issues-for-a-repository