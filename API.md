## 开始

> API 说明

在线服务器提供支持CORS的REST API，请合理使用在线API。API的测试数据来自Postman。

* 在线：http://47.93.252.247:8086
* 本地：http://localhost:8086

> API 示例

```

GET http://47.93.252.247:8086/api/user/info/admin

{
  "msgCode": 200,
  "msgCtx": {
    "_id": "596b71a6cbed776ffee90c4c",
    "user": "admin",
    "gender": "男",
    "img": "https://randomuser.me/api/portraits/men/2.jpg",
    "city": "北京",
    "__v": 0,
    "hobbies": [
      ""
    ]
  }
}

```

> msgCode 通用定义

状态码 | 说明
------|------------
200 | 操作成功
304 | 未执行操作
401 | 未登陆
403 | 禁止操作
404 | 未找到信息
500 | 发生错误


## 用户 API

> 用户注册（非登陆状态才能操作）

```

POST   /api/user/register

当前为登陆状态则不可注册
------------------------
{
  "msgCode": 304,
  "msgCtx": "You have logined."
}

注册成功时的提示
----------------
{
  "msgCode": 200,
  "msgCtx": "Reg success & logined."
}

```

参数 | 类型 | 必须 | 描述
-----|-------------------
name | String | √ | 昵称
pass | String | √ | 密码

> 用户登陆（非登陆状态才能操作）

```

POST   /api/user/login

用户名不存在则进行提示
----------------------
{
  "msgCode": 404,
  "msgCtx": "User is not exist."
}

用户名存在但密码错误则进行提示
------------------------------
{
  "msgCode": 403,
  "msgCtx": "Pass is incorrect."
}

登陆成功时的提示
-----------------
{
  "msgCode": 200,
  "msgCtx": "Login success."
}

当前已登录则不可继续登陆
------------------------
{
  "msgCode": 304,
  "msgCtx": "You have already logined."
}

```

参数 | 类型 | 必须 | 描述
-----|-------------------
name | String | √ | 昵称
pass | String | √ | 密码

> 注销登陆（登陆状态才能操作）

```

POST   /api/user/logout

未登录则提示未登录
------------------
{
  "msgCode": 304,
  "msgCtx": "You have not login."
}

已登录则注销
------------
{
  "msgCode": 200,
  "msgCtx": "User logout success."
}

```

> 用户资料

```

GET /api/user/info/admin

{
  "msgCode": 200,
  "msgCtx": {
    "_id": "596b71a6cbed776ffee90c4c",
    "user": "admin",
    "gender": "男",
    "img": "https://randomuser.me/api/portraits/men/2.jpg",
    "city": "北京",
    "__v": 0,
    "hobbies": [
      ""
    ]
  }
}

用户列表   √      GET    /api/user            无      空

```

> 用户列表

```

GET /api/user

{
  "msgCode": 200,
  "msgCtx": [
    {
      "_id": "596b71a6cbed776ffee90c4c",
      "user": "admin",
      "gender": "男",
      "img": "https://randomuser.me/api/portraits/men/2.jpg",
      "city": "北京",
      "__v": 0,
      "hobbies": [
        ""
      ]
    },
    ...
    ]
}

```

> 修改密码（登陆状态才能操作）

```

PUT    /api/user/pass

未登录则进行提示
-----------------
{
  "msgCode": 401,
  "msgCtx": "Please login."
}

旧密码错误则进行提示
--------------------
{
  "msgCode": 304,
  "msgCtx": "Old password is incorrect."
}

旧密码输入正确则修改密码
------------------------
{
  "msgCode": 200,
  "msgCtx": "Pass is changed."
}

```

参数 | 类型 | 必须 | 描述
-----|-------------------
passOld | String | √ | 旧密码
passNew | String | √ | 新密码

> 修改资料（登陆状态才能操作）

```

PUT    /api/user/info

未登录则进行提示
-----------------
{
  "msgCode": 401,
  "msgCtx": "Please login."
}

修改成功则进行提示
------------------
{
  "msgCode": 200,
  "msgCtx": "User info is changed."
}

```

参数 | 类型 | 必须 | 描述
-----|-------------------
gender | String | √ | 性别
img | String | √ | 头像
city | String | √ | 城市
hobbies | String | √ | 爱好

## 房间 API

> 添加房间（登陆状态才能操作）

```

POST  /api/room/add

未登录则进行提示
----------------
{
  "msgCode": 401,
  "msgCtx": "You cannot access the api. Please login."
}

添加成功则进行提示
------------------
{
  "msgCode": 200,
  "msgCtx": "Room add success."
}

```

参数 | 类型 | 必须 | 描述
-----|-------------------
name | String | √ | 房间名
desc | String | √ | 房间描述

> 房间描述

```

GET   /api/room/info/:id

{
  "msgCode": 200,
  "msgCtx": {
    "_id": "596cece4531efc30af8da9ca",
    "name": "Test",
    "desc": "Test for anything.",
    "__v": 0
  }
}

```

> 聊天记录

```

GET   /api/room/mess/:id

{
  "msgCode": 200,
  "msgCtx": [
    {
      "_id": "596cecfe531efc30af8da9cb",
      "room": "Test",
      "user": "admin",
      "mess": "hello",
      "time": 1500310756,
      "img": "https://randomuser.me/api/portraits/men/2.jpg",
      "__v": 0
    },
    {
      "_id": "596ced01531efc30af8da9cc",
      "room": "Test",
      "user": "admin",
      "mess": "world",
      "time": 1500310760,
      "img": "https://randomuser.me/api/portraits/men/2.jpg",
      "__v": 0
    }
  ]
}

```

> 房间列表

```

GET   /api/room

{
  "msgCode": 200,
  "msgCtx": [
    {
      "_id": "596b7224cbed776ffee90c4d",
      "name": "小美",
      "desc": "我是小美，今年14岁，一起唠嗑吧",
      "__v": 0
    },
    {
      "_id": "596b723acbed776ffee90c4e",
      "name": "center",
      "desc": "中心聊天室",
      "__v": 0
    },
    ...
  ]
}

```
