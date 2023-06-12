#!/usr/bin/env sh

if [ -z "$1" ]; then
    message="default"
else
    message=$1
fi
echo "执行start $message"
echo "执行的文件名：$message"
