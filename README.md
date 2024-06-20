[![Watch the video]]([https://youtu.be/T-D1KVIuvjA](https://www.youtube.com/watch?v=cn3ZHPAdLyk&ab_channel=EricBollar))
# DEMO VIDEO
[![Watch the video](https://img.youtube.com/vi/cn3ZHPAdLyk&ab_channel=EricBollar/maxresdefault.jpg)](https://youtu.be/cn3ZHPAdLyk&ab_channel=EricBollar)

# PirateIO
A browser game built with Node and AWS that allows players to control a randomly colored pirate ship and fire cannonballs at other players. Ocean is deprecated as of Aug 2022. Online version is shut down due to cost.

Deployed using AWS. Used npm and pm2.

## How to run
Dev: 
$ npm run develop
Prod: 
$ npm run build
$ npm start

## EC2 Setup
Check that project has been built to dist folder.
Give pemkey permissions if need:
$ chmod 400 PATH_TO_PEM_KEY
Make sure in correct region (top right of EC2 dashboard)
Clone Repo:
Install nodejs & npm: 
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - 
sudo apt-get install -y nodejs
Install packages:
$ npm i
Ensure can start (make sure on http not https) Security group should be open on HTTP and HTTPS to IPv4:
$ sudo npm run start
Install pm2
$ sudo npm i pm2 -g
Run script (for this project, path is src/server/server.js)
$ sudo pm2 start PATH_TO_SCRIPT
