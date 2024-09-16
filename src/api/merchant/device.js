import request from '@/utils/request'

// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/merchant/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备列表详细
export function getDevice(id) {
  return request({
    url: '/merchant/device/' + id,
    method: 'get'
  })
}

// 新增设备列表
export function addDevice(data) {
  return request({
    url: '/merchant/device',
    method: 'post',
    data: data
  })
}

// 修改设备列表
export function updateDevice(data) {
  return request({
    url: '/merchant/device',
    method: 'put',
    data: data
  })
}

// 删除设备列表
export function delDevice(id) {
  return request({
    url: '/merchant/device/' + id,
    method: 'delete'
  })
}
