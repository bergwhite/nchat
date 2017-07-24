(() => {
  const userName = document.getElementsByClassName('login-user')[0]
  const userPass = document.getElementsByClassName('login-pass')[0]
  const userLoginBtn = document.getElementsByClassName('login-confirm')[0]
  const userRegisterBtn = document.getElementsByClassName('register-confirm')[0]
  const userTip = document.getElementsByClassName('login-tip')[0]

  const siteOrigin = document.location.origin
  const ajaxUrl = {
    login: `${siteOrigin}/api/user/login`,
    register: `${siteOrigin}/api/user/register`,
  }

  // 默认使用登陆请求
  ajaxUrl.current = ajaxUrl.login

  document.body.onload = () => {

    // 焦点聚焦用户名
    userName.focus()

    // 监听用户登陆事件
    userLoginBtn.addEventListener('click', () => userHandle('login'),false)

    // 监听用户注册事件
    userRegisterBtn.addEventListener('click', () => userHandle('register'),false)
  }

  // 跳转到首页函数
  function jumpToMainPage() {
    document.location = siteOrigin
  }

  function userHandle (type) {

    // 根据传进来的类型，修改请求的Url
    if (type === 'login') {
      ajaxUrl.current = ajaxUrl.login
    }
    else if (type === 'register') {
      ajaxUrl.current = ajaxUrl.register
    }

    // 用户名为空则显示提示信息
    if (userName.value === '') {
      userName.focus()
      userTip.innerHTML = '请输入用户名'
    }

    // 密码为空则显示提示信息
    else if (userPass.value === '') {
      userPass.focus()
      userTip.innerHTML = '请输入密码'
    }

    // 否则提交请求
    else {
      console.log(ajaxUrl.current)
      axios.post(ajaxUrl.current, {
        name: userName.value,
        pass: userPass.value
      })
      .then((res) => {
        // 处理成功则跳转到首页
        if (res.data.msgCode === 200) {
          jumpToMainPage()
        }
        // 否则显示错误信息
        else {
          userTip.innerHTML = res.data.msgCtx
        }
        // 捕获到错误则显示错误信息
      }).catch((err) => userTip.innerHTML = err)
    }
  }
})();
