@echo off
cd "c:\Users\vimal\EnviConnect_sep"
git init
git remote add origin https://github.com/vimalrajaj/EnviConnect.git
git checkout -b vimalraja
git add .
git commit -m "feat: implement modern UI and dynamic project loading"
git push -u origin vimalraja --force
