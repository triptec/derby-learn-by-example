derby learn by example

$sudo npm -g install git://github.com/codeparty/derby.git#master

$derby new derby-learn-by-example

$cd derby-learn-by-example

$cat .gitignore

output:
.DS_Store
public/gen
*.swp

$echo "node_modules/" >> .gitignore

$cat .gitignore

output:
.DS_Store
public/gen
*.swp
node_modules/

$git checkout -b 01-edit-gitignore

$git add .

$git commit -am "initial commit"

$git checkout master

$git merge 01-edit-gitignore

$node server.js

Everything seems to be working!

