# dfkaye.com

Hugo Blog

## Set up

Create a new, empty github repo - no readme, no license, no gitignore.

Call it whatever <YOURBLOGNAME> should be.

For example, locally:

```
cd ~/Projects
mkdir YOURBLOGNAME
cd YOURBLOGNAME
hugo new site YOURBLOGNAME
cd YOURBLOGNAME
git init
git add .
git commit -am "Initial commit"
git remote add origin https://github.com:USERNAME/YOURBLOGNAME.git
git push -u origin master
hugo server
```

## Create a home page template

See [Zach Betz's post for a nice example.](https://zwbetz.com/make-a-hugo-blog-from-scratch/#homepage-layout).

## Add content

Reorganize this later, just get a file in place.

## Push changes

```
git add .
git commit -am "changes commit"
git push -u origin master
```

## 💫 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dfkaye/dfkaye-blog)

