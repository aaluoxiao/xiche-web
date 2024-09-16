import request from '@/utils/request'

// 查询城市管理列表
export function listRegion(query) {
  return request({
    url: '/merchant/region/list',
    method: 'get',
    params: query
  })
}

// 查询城市管理详细
export function getRegion(id) {
  return request({
    url: '/merchant/region/' + id,
    method: 'get'
  })
}

// 新增城市管理
export function addRegion(data) {
  return request({
    url: '/merchant/region',
    method: 'post',
    data: data
  })
}

// 修改城市管理
export function updateRegion(data) {
  return request({
    url: '/merchant/region',
    method: 'put',
    data: data
  })
}

// 删除城市管理
export function delRegion(id) {
  return request({
    url: '/merchant/region/' + id,
    method: 'delete'
  })
}
