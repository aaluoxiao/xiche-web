import request from '@/utils/request'

// 查询站点列表列表
export function listStation(query) {
  return request({
    url: '/merchant/station/list',
    method: 'get',
    params: query
  })
}

// 查询站点列表详细
export function getStation(id) {
  return request({
    url: '/merchant/station/' + id,
    method: 'get'
  })
}

// 新增站点列表
export function addStation(data) {
  return request({
    url: '/merchant/station',
    method: 'post',
    data: data
  })
}

// 修改站点列表
export function updateStation(data) {
  return request({
    url: '/merchant/station',
    method: 'put',
    data: data
  })
}

// 删除站点列表
export function delStation(id) {
  return request({
    url: '/merchant/station/' + id,
    method: 'delete'
  })
}
