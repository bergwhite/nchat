(() => {
  const userInfoGenderWrap = document.getElementsByClassName('info-gender-wrap')[0]
  const userInfoImg = document.getElementsByClassName('info-img')[0]
  const userDisImg = document.getElementsByClassName('user-info-img')[0]
  const userInfoCity = document.getElementsByClassName('info-city')[0]
  const userInfoHobbies = document.getElementsByClassName('info-hobbies')[0]
  const infoTip = document.getElementsByClassName('info-tip')[0]
  const infoModBtn = document.getElementsByClassName('top-next')[0]
  const siteOrigin = document.location.origin
  const ajaxUrl = `${siteOrigin}/api/user/info`
  const currentGender = ['男', '女', '保密']
  const changImgArr = ['men', 'women', 'random']

  // 监听点击头像换图片
  userInfoImg.addEventListener('click', (e) => {
    userDisImg.src = getRandomImg(changImgArr[userInfoGenderWrap.value])
  }, false)

  // 监听信息修改按钮的点击事件
  infoModBtn.addEventListener('click', (e) => {
    e.preventDefault()
    submitModUserInfo()
  }, false)

  function getRandomImg(gender) {
    if (gender === 'random' ) {
      gender = Math.random() > 0.5 ? changImgArr[0] : changImgArr[1]
    }
    const randomNumber = parseInt(Math.random() * 100)
    return 'https://randomuser.me/api/portraits/' + gender + '/' + randomNumber + '.jpg'
  }

  // 提交修改后的用户信息的函数
  function submitModUserInfo() {
    const token = localStorage.getItem('token')
    axios.put(`${ajaxUrl}?token=${token}`,{
      gender: currentGender[userInfoGenderWrap.value],
      img: userDisImg.src,
      city: userInfoCity.value,
      hobbies: userInfoHobbies.value
    }).then((res) => {
        // 成功则跳转到首页
        if (res.data.msgCode === 200) {
          document.location = '/'
        }
        // 否则显示返回的提示信息
        else {
          infoTip.innerText = res.data.msgCtx
        }
        // 捕获到错误则进行提示
      }).catch((err) => infoTip.innerText = err)
  }
})();
