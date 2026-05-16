<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarPx + 'px' }" />

    <view class="shell">
      <view class="card">
        <view class="hd-row">
          <input
            v-model="title"
            class="title-inp"
            type="text"
            placeholder="标题"
            placeholder-class="ph-title"
            maxlength="80"
          />
          <view class="del-wrap" hover-class="del-hover" @tap="onDeleteTap">
            <text class="trash-emoji">🗑️</text>
          </view>
        </view>

        <textarea
          v-model="content"
          class="body-area"
          placeholder="内容"
          placeholder-class="ph"
          maxlength="8000"
          :show-confirm-bar="false"
        />

        <view class="ft-row">
          <button class="half primary" hover-class="btn-hover" @tap="onSave">保存</button>
          <button class="half ghost" hover-class="btn-hover-light" @tap="onBack">返回</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api.js'

const statusBarPx = ref(0)

const memoId = ref('')
const isNew = ref(true)
const title = ref('')
const content = ref('')

async function loadMemo() {
  if (!memoId.value) return
  try {
    const response = await apiGet(`/memos/${memoId.value}`)
    title.value = response.data.title || ''
    content.value = response.data.content || ''
  } catch (err) {
    uni.showToast({ title: err.message || '加载笔记失败', icon: 'none' })
    if (err.code === 401) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
    setTimeout(() => uni.navigateBack(), 800)
  }
}

onLoad((options) => {
  const id = options?.id ? String(options.id) : ''
  memoId.value = id
  isNew.value = !id
  if (id) {
    loadMemo()
  } else {
    title.value = ''
    content.value = ''
  }
})

async function onSave() {
  const t = title.value.trim()
  if (!t) {
    uni.showToast({ title: '请填写标题', icon: 'none' })
    return
  }

  try {
    if (isNew.value) {
      await apiPost('/memos', {
        title: t,
        content: content.value.trim(),
      })
      uni.showToast({ title: '创建成功', icon: 'success' })
    } else {
      await apiPut(`/memos/${memoId.value}`, {
        title: t,
        content: content.value.trim(),
      })
      uni.showToast({ title: '更新成功', icon: 'success' })
    }
    setTimeout(() => uni.navigateBack(), 350)
  } catch (err) {
    uni.showToast({ title: err.message || '保存失败', icon: 'none' })
    if (err.code === 401) {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}

function onBack() {
  uni.navigateBack()
}

function onDeleteTap() {
  if (isNew.value) {
    uni.showModal({
      title: '放弃创建？',
      content: '确定离开且不保存吗？',
      success(res) {
        if (res.confirm) uni.navigateBack()
      },
    })
    return
  }

  uni.showModal({
    title: '删除笔记',
    content: '删除后无法恢复，确定删除吗？',
    success: async (res) => {
      if (!res.confirm) return
      try {
        await apiDelete(`/memos/${memoId.value}`)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 300)
      } catch (err) {
        uni.showToast({ title: err.message || '删除失败', icon: 'none' })
        if (err.code === 401) {
          uni.reLaunch({ url: '/pages/login/login' })
        }
      }
    },
  })
}

onMounted(() => {
  try {
    const sys = uni.getSystemInfoSync()
    statusBarPx.value = sys.statusBarHeight || 0
  } catch {
    statusBarPx.value = 0
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  background: linear-gradient(
    125deg,
    #2563eb 0%,
    #4f7cff 18%,
    #7c8cff 38%,
    #a78bfa 58%,
    #e879f9 78%,
    #fb7185 92%,
    #fda4af 100%
  );
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.status-bar {
  width: 100%;
  flex-shrink: 0;
}

.shell {
  flex: 1;
  align-self: center;
  width: calc(100% - 48rpx);
  max-width: 700rpx;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  min-height: 0;
}

.card {
  width: 100%;
  height: 8000rpx;
  box-sizing: border-box;
  border-radius: 28rpx;
  padding: 28rpx 24rpx 24rpx;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 32rpx 64rpx rgba(31, 38, 135, 0.28),
    0 12rpx 32rpx rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
  display: flex;
  flex-direction: column;
  min-height: 72vh;
  max-height: 88vh;
}

.hd-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
}

.title-inp {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1f2e;
  padding: 12rpx 0;
  line-height: 1.3;
}

.ph {
  color: #a8b0c4;
}

/* 标题占位符：高亮提示 */
.ph-title {
  color: #4f6fff;
  font-weight: 700;
  opacity: 1;
}

.del-wrap {
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  margin-left: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  background: #ff5c6c;
  border: 2rpx solid #e84858;
  box-shadow: 0 4rpx 12rpx rgba(232, 72, 88, 0.35);
}

.del-hover {
  opacity: 0.85;
  transform: scale(0.95);
}

.trash-emoji {
  font-size: 36rpx;
  line-height: 1;
}

.body-area {
  flex: 1;
  min-height: 360rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.65);
  font-size: 28rpx;
  line-height: 1.55;
  color: #4b5569;
  margin-bottom: 28rpx;
}

.ft-row {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.half {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  margin: 0;
  padding: 0;
}

.half::after {
  border: none;
}

.half.primary {
  background: linear-gradient(135deg, #6c8cff 0%, #7c6bff 100%);
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(108, 140, 255, 0.35);
}

.half.ghost {
  background: rgba(255, 255, 255, 0.55);
  color: #4b5569;
  border: 1px solid rgba(255, 255, 255, 0.75);
}

.btn-hover {
  opacity: 0.92;
  transform: scale(0.98);
}

.btn-hover-light {
  opacity: 0.88;
}

@media (min-width: 768px) {
  .shell {
    max-width: 440px;
    width: calc(100% - 64px);
    align-self: center;
    justify-content: center;
  }

  .card {
    flex-shrink: 0;
    max-height: min(88vh, 820px);
    min-height: auto;
  }
}
</style>
