# My Hugo Blog

Visit https://dfkaye.com, built with [Hugo](https://gohugo.io), currently hosted on [Netlify](https://www.netlify.com/)

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

## Run locally, test with multiple devices

Find your local IP address and bind to it as the base URL (using 192.168.0.108 as an example) with the following command:

```
hugo server --bind 0.0.0.0 --baseURL 192.168.0.111 --cleanDestinationDir
```

Now you can test your build with any device on your network at (per example) http://192.168.0.111:1313/.
