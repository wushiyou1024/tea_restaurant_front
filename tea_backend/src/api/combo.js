import axios from 'axios'

// 查询列表数据
export const getSetmealPage = (params) => {
  return axios({
    url: '/api/setmeal/page',
    method: 'get',
    params
  })
}

// 删除数据接口
export const deleteSetmeal = (ids) => {
  return axios({
    url: '/api/setmeal',
    method: 'delete',
    params: { ids }
  })
}

// 修改数据接口
export const editSetmeal = (params) => {
  return axios({
    url: '/api/setmeal',
    method: 'put',
    data: { ...params }
  })
}

// 新增数据接口
export const addSetmeal = (params) => {
  return axios({
    url: '/api/setmeal',
    method: 'post',
    data: { ...params }
  })
}

// 查询详情接口
export const querySetmealById = (id) => {
  return axios({
    url: `/api/setmeal/${id}`,
    method: 'get'
  })
}

// 批量起售禁售
export const setmealStatusByStatus = (params) => {
  return axios({
    url: `/api/setmeal/status/${params.status}`,
    method: 'post',
    params: { ids: params.ids }
  })
}
