import request from '@/util/request.js'
export  function loginApi(data) {
    return request({
      'url': '/user/login',
      'method': 'post',
      data
    })
}

export  function sendMsgApi(data) {
    return request({
        'url': '/user/sendMsg',
        'method': 'post',
        data
    })
}

export  function loginoutApi() {
  return request({
    'url': '/user/loginout',
    'method': 'post',
  })
}

  