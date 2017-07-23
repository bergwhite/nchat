## 目录

* 用户

  * [用户注册（非登陆状态才能操作）](/API.md#用户注册（非登陆状态才能操作）)
  * [用户登陆（非登陆状态才能操作）](/API.md#用户登陆（非登陆状态才能操作）)
  * [注销登陆（登陆状态才能操作）](/API.md#注销登陆（登陆状态才能操作）)
  * [用户资料](/API.md#用户资料)
  * [用户列表](/API.md#用户列表)
  * [修改密码（登陆状态才能操作）](/API.md#修改密码（登陆状态才能操作）)
  * [修改资料（登陆状态才能操作）](/API.md#修改资料（登陆状态才能操作）)

* 房间

  * [添加房间（登陆状态才能操作）](/API.md#添加房间（登陆状态才能操作）)
  * [房间描述](/API.md#房间描述)
  * [聊天记录](/API.md#聊天记录)
  * [房间列表](/API.md#房间列表)

## 开始

> API 说明

在线服务器提供支持CORS的REST API，请合理使用在线API。API的测试数据来自Postman。

* 在线：http://47.93.252.247:8086
* 本地：http://localhost:8086

### API 示例

> 请求地址

```

GET http://47.93.252.247:8086/api/user/info/admin

```

> 请求参数

无

> 返回结果

```
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

### msgCode 通用定义

状态码 | 说明
------|------------
200 | 操作成功
304 | 未执行操作
401 | 未登陆
403 | 禁止操作
404 | 未找到信息
500 | 发生错误


## 用户 API

### 用户注册（非登陆状态才能操作）

> 请求地址

方法 | 地址
-----|-----
POST | /api/user/register

> 请求参数

参数 | 类型 | 必须 | 描述
-----|------|------|-------
name | String | √ | 昵称
pass | String | √ | 密码

> 返回结果

```

{
  "msgCode": 200,
  "msgCtx": "Reg success & logined."
}

```

> 返回结果（失败）

```

你当前已经登录
------------------------
{
  "msgCode": 304,
  "msgCtx": "You have logined."
}

```

### 用户登陆（非登陆状态才能操作）

> 请求地址

方法 | 地址
-----|-----
POST | /api/user/login

> 请求参数

参数 | 类型 | 必须 | 描述
-----|------|------|-------
name | String | √ | 昵称
pass | String | √ | 密码

> 返回结果

```

{
  "msgCode": 200,
  "msgCtx": "Login success."
}

```

> 返回结果（失败）

```

用户名不存在
----------------------
{
  "msgCode": 404,
  "msgCtx": "User is not exist."
}

用户名存在但密码错误
------------------------------
{
  "msgCode": 403,
  "msgCtx": "Pass is incorrect."
}

当前已登录
------------------------
{
  "msgCode": 304,
  "msgCtx": "You have already logined."
}

```

### 注销登陆（登陆状态才能操作）

> 请求地址

方法 | 地址
-----|-----
POST | /api/user/logout

> 请求参数

无

> 返回结果

```

{
  "msgCode": 200,
  "msgCtx": "User logout success."
}

```

> 返回结果（失败）

```

当前未登录，不需要注销
------------------
{
  "msgCode": 304,
  "msgCtx": "You have not login."
}

------------

```

### 用户资料

> 请求地址

方法 | 地址
-----|-----
GET | /api/user/info/admin

> 请求参数

无

> 返回结果

```

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

> 返回结果（失败）

```

用户不存在
-----------
{
  "msgCode": 404,
  "msgCtx": "User not exist."
}

```

### 用户列表

> 请求地址

方法 | 地址
-----|-----
GET | /api/user

> 请求参数

无

> 返回结果


```

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

### 修改密码（登陆状态才能操作）

> 请求地址

方法 | 地址
-----|-----
PUT | /api/user/pass

> 请求参数

参数 | 类型 | 必须 | 描述
-----|------|------|-------
passOld | String | √ | 旧密码
passNew | String | √ | 新密码

> 返回结果

```

{
  "msgCode": 200,
  "msgCtx": "Pass is changed."
}

```

> 返回结果（失败）

```

未登录无权限访问当前API
-----------------------
{
  "msgCode": 401,
  "msgCtx": "Please login."
}

旧密码错误
--------------------
{
  "msgCode": 304,
  "msgCtx": "Old password is incorrect."
}

```

### 修改资料（登陆状态才能操作）

> 请求地址

方法 | 地址
-----|-----
PUT | /api/user/info

> 请求参数

参数 | 类型 | 必须 | 描述
-----|------|------|-------
gender | String | √ | 性别
img | String | √ | 头像
city | String | √ | 城市
hobbies | String | √ | 爱好

> 返回结果

```

{
  "msgCode": 200,
  "msgCtx": "User info is changed."
}

```

> 返回结果（失败）

```

未登录无权限访问当前API
-----------------------
{
  "msgCode": 401,
  "msgCtx": "Please login."
}

```

## 房间 API

### 添加房间（登陆状态才能操作）

> 请求地址

方法 | 地址
-----|-----
POST | /api/room/add

> 请求参数

参数 | 类型 | 必须 | 描述
-----|------|------|-------
name | String | √ | 房间名
desc | String | √ | 房间描述

> 返回结果

```

{
  "msgCode": 200,
  "msgCtx": "Room add success."
}

```

> 返回结果（失败）

```

未登录无权限访问当前API
-----------------------
{
  "msgCode": 401,
  "msgCtx": "You cannot access the api. Please login."
}

```

### 房间描述

> 请求地址

方法 | 地址
-----|-----
GET | /api/room/info/:id

> 请求参数

无

> 返回结果

```

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

> 返回结果（失败）

```

{
  "msgCode": 404,
  "msgCtx": "Room is not exist."
}

```

### 聊天记录

> 请求地址

方法 | 地址
-----|-----
GET | /api/room/mess/:id

> 请求参数

无

> 请求结果

```
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

> 请求结果（失败）

```

当前房间不存在
---------
{
  "msgCode": 404,
  "msgCtx": "This room is not exist."
}

```

### 房间列表

> 请求地址

方法 | 地址
-----|-----
GET | /api/room

> 请求参数

无

> 返回结果

```

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
