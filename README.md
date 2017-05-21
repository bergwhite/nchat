# NodeJS & SocketIO & Express & & EJS MongoDB 打造多人在线聊天室

项目开发中...

> REST API

```

/  // 首页
/user  // 用户列表
/user/:id  // 用户中心
/user/:id/register  // 注册
/user/:id/login  // 登陆
/user/:id/logout  // 注销
/user/:id/info  // 用户资料

```

> 启动MongoDB服务

首先修改package.json中的MongoDB安装路径，`--dbpath=`后面的路径修改为自己的即可。

```

"mongod": "start X:/MongoDB/bin/mongod --dbpath=X:\\MongoDB\\data\\db"

```

接下来启动MongoDB服务

```

npm run mongod

```