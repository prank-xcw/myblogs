#!/usr/bin/env sh

# 部署静态页面
if [ -z "$1" ]; then
    message="default deploy"
else
    message=$1
fi

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
echo 'index.onceprank.cn' > CNAME

git init
git add -A
git commit -m $message

# 如果发布到 https://<USERNAME>.github.io
# 关联远程仓库地址
git remote add origin https://github.com/prank-xcw/prank-xcw.github.io
git checkout -b master

git push -f https://github.com/prank-xcw/prank-xcw.github.io master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
#git push git@github.com:duktig666/share-blog.git main:gh-pages -f

cd -