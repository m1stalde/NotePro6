@echo off
call "C:\Program Files\nodejs\nodevars.bat"
cd %~dp0
call npm install
start node index.js
start http://127.0.0.1:3000/

