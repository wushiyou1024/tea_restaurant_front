import axios from 'axios'
export function loginApi(data) {
  return axios({
    url:'/api/employee/login',
    method: 'post',
    data
  })
}

export function logoutApi(){
  return axios({
    url: '/employee/logout',
    method: 'post',
  })
}
