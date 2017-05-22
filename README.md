# NodeJS & SocketIO & Express & & EJS MongoDB 打造多人在线聊天室

项目开发中...

> REST API

```

/  // 首页
/user  // 用户列表
/user/:id  // 用户中心
/user/:id/register  // 注册（JSON）
/user/:id/login  // 登陆（JSON）
/user/:id/logout  // 注销（JSON）
/user/:id/info  // 用户资料（JSON）
/room/:id  // 指定聊天室

```

> 开始安装

使用之前，请在package.json中修改MongoDB的安装路径（--dbpath）。

```

git clone https://github.com/bergwhite/nodejs-chat  // 克隆项目到本地
cd nodejs-chat  // 进入项目目录
npm install  // 安装依赖
npm run mongod // 启动MongoDB服务
npm run start // 启动聊天室服务并启动网站

```

