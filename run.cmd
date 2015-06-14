@echo off
call "C:\Program Files\nodejs\nodevars.bat"
cd %~dp0Server
start node index.js
start http://localhost:3000/

