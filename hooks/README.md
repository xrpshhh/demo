# install
```bash
npm i -g xrpld-cli
# 必要であればpathを通す
yarn install
```

# test(local)
```bash
xrpld-cli down:clean
xrpld-cli up:standalone #docker-composeでエラーになるので、表示されたdocker compose...コマンドをdocker-compose..に置き換える
yarn standalone
```

# deploy
TODO

### log

```bash
docker logs xrpld-standalone 2>&1 | grep HookTrace
```
