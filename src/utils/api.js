import { getToken, clearAuth } from './auth.js'

const API_BASE_URL = 'http://localhost:3000/api'

function createHeader(withAuth = true) {
  const header = {
    'Content-Type': 'application/json',
  }
  if (withAuth) {
    const token = getToken()
    if (token) {
      header.Authorization = `Bearer ${token}`
    }
  }
  return header
}

function request(method, path, data = {}, withAuth = true) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${path}`,
      method,
      data,
      header: createHeader(withAuth),
      success(response) {
        const { statusCode, data: body } = response
        if (statusCode >= 200 && statusCode < 300) {
          if (body && body.code === 0) {
            resolve(body)
          } else {
            reject(body || { message: '接口返回格式异常' })
          }
        } else if (statusCode === 401) {
          clearAuth()
          reject({ code: 401, message: '未授权，请重新登录' })
        } else {
          reject(body || { code: statusCode, message: '请求失败' })
        }
      },
      fail(err) {
        reject({ message: err.errMsg || '网络请求失败' })
      },
    })
  })
}

export function apiGet(path, data) {
  return request('GET', path, data)
}

export function apiPost(path, data) {
  return request('POST', path, data)
}

export function apiPut(path, data) {
  return request('PUT', path, data)
}

export function apiDelete(path, data) {
  return request('DELETE', path, data)
}

export function apiPostNoAuth(path, data) {
  return request('POST', path, data, false)
}
