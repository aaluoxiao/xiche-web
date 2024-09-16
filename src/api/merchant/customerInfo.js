import request from '@/utils/request'

// 查询用户列表列表
export function listCustomerInfo(query) {
  return request({
    url: '/merchant/customer/list',
    method: 'get',
    params: query
  })
}

// 查询用户列表详细
export function getCustomerInfo(id) {
  return request({
    url: '/merchant/customer/' + id,
    method: 'get'
  })
}



// 修改用户列表
export function updateCustomerInfo(data) {
  return request({
    url: '/merchant/customer',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/merchant/customer',
    method: 'put',
    data: data
  })
}

// 删除用户列表
export function delCustomerInfo(id) {
  return request({
    url: '/merchant/customer/' + id,
    method: 'delete'
  })
}
