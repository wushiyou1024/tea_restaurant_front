import axios from 'axios'
// 编辑页面反查详情接口
export const queryOrderById = (id) => {
  return axios({
    url: `/api/order/getById/${id}`,
    method: 'get'
  })
}

export function getTakeout (params) {
  return axios({
    url: '/api/order/TakeOut',
    method: 'get',
    params
  })
}