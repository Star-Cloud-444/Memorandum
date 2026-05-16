const TOKEN_STORAGE_KEY = 'memorandum_token'
const USER_STORAGE_KEY = 'memorandum_user'

export function getToken() {
  try {
    return uni.getStorageSync(TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function getCurrentUser() {
  try {
    return uni.getStorageSync(USER_STORAGE_KEY) || null
  } catch {
    return null
  }
}

export function setAuth(token, user) {
  try {
    uni.setStorageSync(TOKEN_STORAGE_KEY, token)
    if (user !== undefined) {
      uni.setStorageSync(USER_STORAGE_KEY, user)
    }
  } catch (e) {
    console.error('setAuth failed', e)
  }
}

export function clearAuth() {
  try {
    uni.removeStorageSync(TOKEN_STORAGE_KEY)
    uni.removeStorageSync(USER_STORAGE_KEY)
  } catch (e) {
    console.error('clearAuth failed', e)
  }
}
