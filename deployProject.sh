#!/usr/bin/env sh

# 检查是否传入了 message 参数
if [ -z "$1" ]; then
    message="default deploy"
else
    message=$1
fi

#####1.推送整个项目到GitHub
git init
git add -A
git commit -m $message
git branch -M master
git remote add origin git@github.com:prank-xcw/myblogs.git
git push -u origin master