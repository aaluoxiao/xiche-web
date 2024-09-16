import request from '@/utils/request'

// 查询订单列表
export function listUserOrder(query) {
  return request({
    url: '/merchant/order/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getUserOrder(id) {
  return request({
    url: '/merchant/order/' + id,
    method: 'get'
  })
}

// 新增订单
export function addUserOrder(data) {
  return request({
    url: '/merchant/order',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateUserOrder(data) {
  return request({
    url: '/merchant/order',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delUserOrder(id) {
  return request({
    url: '/merchant/order/' + id,
    method: 'delete'
  })
}
