import request from '@/utils/request'

// 查询赠送金额统计列表
export function listGiftMountStats(query) {
  return request({
    url: '/merchant/giftMountStats/list',
    method: 'get',
    params: query
  })
}

// 查询赠送金额统计详细
export function getGiftMountStats(id) {
  return request({
    url: '/merchant/giftMountStats/' + id,
    method: 'get'
  })
}

// 新增赠送金额统计
export function addGiftMountStats(data) {
  return request({
    url: '/merchant/giftMountStats',
    method: 'post',
    data: data
  })
}

// 修改赠送金额统计
export function updateGiftMountStats(data) {
  return request({
    url: '/merchant/giftMountStats',
    method: 'put',
    data: data
  })
}

// 删除赠送金额统计
export function delGiftMountStats(id) {
  return request({
    url: '/merchant/giftMountStats/' + id,
    method: 'delete'
  })
}
