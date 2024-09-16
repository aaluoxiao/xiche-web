import request from '@/utils/request'

// 查询加盟列表列表
export function listFranchisee(query) {
  return request({
    url: '/merchant/franchisee/list',
    method: 'get',
    params: query
  })
}

// 查询加盟列表详细
export function getFranchisee(id) {
  return request({
    url: '/merchant/franchisee/' + id,
    method: 'get'
  })
}

// 新增加盟列表
export function addFranchisee(data) {
  return request({
    url: '/merchant/franchisee',
    method: 'post',
    data: data
  })
}

// 修改加盟列表
export function updateFranchisee(data) {
  return request({
    url: '/merchant/franchisee',
    method: 'put',
    data: data
  })
}

// 删除加盟列表
export function delFranchisee(id) {
  return request({
    url: '/merchant/franchisee/' + id,
    method: 'delete'
  })
}
