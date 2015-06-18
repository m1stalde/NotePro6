@echo off
call "C:\Program Files\nodejs\nodevars.bat"
cd %~dp0Server
call npm install
start node index.js
start http://localhost:3000/

