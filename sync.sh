#!/bin/sh
git init
git add .
git config user.email "ashaugusto@gmail.com"
git config user.name "ashaugusto"
git commit -m "Initial commit"
git remote add origin https://github.com/ashaugusto/airpoject.git
git push -f origin main