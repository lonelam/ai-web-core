rsync -av --exclude='*.js.map' dist docker-compose.yml package.json pnpm-lock.yaml root@laizn.com:~/aiweb/

# remote: pm2 start ~/aiweb/dist/src/main.js