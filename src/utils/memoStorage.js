const STORAGE_KEY = 'memorandum_memos_v1'

export function loadMemos() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveMemos(list) {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('saveMemos failed', e)
  }
}
