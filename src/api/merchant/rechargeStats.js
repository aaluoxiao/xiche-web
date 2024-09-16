import request from '@/utils/request'

// 查询用户充值统计列表
export function listRechargeStats(query) {
  return request({
    url: '/merchant/rechargeStats/list',
    method: 'get',
    params: query
  })
}

// 查询用户充值统计详细
export function getRechargeStats(id) {
  return request({
    url: '/merchant/rechargeStats/' + id,
    method: 'get'
  })
}

// 新增用户充值统计
export function addRechargeStats(data) {
  return request({
    url: '/merchant/rechargeStats',
    method: 'post',
    data: data
  })
}

// 修改用户充值统计
export function updateRechargeStats(data) {
  return request({
    url: '/merchant/rechargeStats',
    method: 'put',
    data: data
  })
}

// 删除用户充值统计
export function delRechargeStats(id) {
  return request({
    url: '/merchant/rechargeStats/' + id,
    method: 'delete'
  })
}
