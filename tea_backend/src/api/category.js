import axios from 'axios'
// 查询列表接口
export const getCategoryPage = (params) => {
  return axios({
    url: '/api/category/page',
    method: 'get',
    params
  })
}

// 编辑页面反查详情接口
export const queryCategoryById = (id) => {
  return axios({
    url: `/api/category/${id}`,
    method: 'get'
  })
}

// 删除当前列的接口
export const deleCategory = (ids) => {
  return axios({
    url: '/api/category',
    method: 'delete',
    params: { ids }
  })
}

// 修改接口
export const editCategory = (params) => {
  return axios({
    url: '/api/category',
    method: 'put',
    data: { ...params }
  })
}

// 新增接口
export const addCategory = (params) => {
  return axios({
    url: '/api/category',
    method: 'post',
    data: { ...params }
  })
}
