#!/bin/sh
# 작업 디렉토리를 GitHub Actions 기본 작업 디렉토리로 유지
mkdir -p ./output

# frontend 디렉토리에서 파일 복사
cp -R ./frontend/* ./output

# output 디렉토리를 다시 frontend로 복사
cp -R ./output/* ./frontend/
