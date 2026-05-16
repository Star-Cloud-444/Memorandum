<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarPx + 'px' }" />
    <view class="toolbar">
      <text class="toolbar-title">备忘录</text>
    </view>

    <view class="body">
      <view v-if="memos.length === 0" class="empty">
        <text class="empty-text">暂无笔记，点击右下角 + 新建</text>
      </view>

      <view class="grid">
        <view
          v-for="item in memos"
          :key="item.id"
          class="card"
          @tap="openDetail(item.id)"
        >
          <text class="card-title">{{ item.title || '无标题' }}</text>
          <text class="card-content">{{ item.content || ' ' }}</text>
          <text class="card-date">{{ item.dateLabel }}</text>
        </view>
      </view>
    </view>

    <view class="fab" hover-class="fab-hover" @tap="openNew">
      <text class="fab-plus">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { apiGet } from '../../utils/api.js'

const statusBarPx = ref(0)
const memos = ref([])

function formatDateLabel(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function refresh() {
  try {
    const response = await apiGet('/memos')
    memos.value = (response.data || []).map((memo) => ({
      ...memo,
      dateLabel: formatDateLabel(memo.createdAt),
    }))
  } catch (err) {
    uni.showToast({ title: err.message || '加载笔记失败', icon: 'none' })
    if (err.code === 401) {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}

function openNew() {
  uni.navigateTo({ url: '/pages/memo/detail' })
}

function openDetail(id) {
  uni.navigateTo({ url: `/pages/memo/detail?id=${encodeURIComponent(id)}` })
}

onShow(() => {
  refresh()
})

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
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
}

.status-bar {
  width: 100%;
}

.toolbar {
  padding: 16rpx 32rpx 24rpx;
}

.toolbar-title {
  font-size: 40rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.02em;
}

.body {
  padding: 0 24rpx;
}

.empty {
  padding: 80rpx 32rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.card {
  width: calc(50% - 20rpx);
  margin: 0 10rpx 20rpx;
  box-sizing: border-box;
  aspect-ratio: 1;
  border-radius: 24rpx;
  padding: 20rpx 20rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 16rpx 40rpx rgba(31, 38, 135, 0.22),
    0 4rpx 12rpx rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.card-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.35;
  align-self: flex-start;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.card-content {
  flex: 1;
  margin-top: 12rpx;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: rgba(80, 88, 110, 0.95);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  min-height: 0;
}

.card-date {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
  align-self: flex-start;
  margin-top: auto;
}

.fab {
  position: fixed;
  right: calc(32rpx + env(safe-area-inset-right));
  bottom: calc(48rpx + env(safe-area-inset-bottom));
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6c8cff 0%, #8b5cf6 100%);
  box-shadow:
    0 16rpx 40rpx rgba(108, 140, 255, 0.45),
    0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  z-index: 50;
  border: 2rpx solid rgba(255, 255, 255, 0.35);
}

.fab-plus {
  font-size: 64rpx;
  font-weight: 300;
  color: #fff;
  line-height: 1;
  margin-top: -6rpx;
}

.fab-hover {
  transform: scale(0.94);
  opacity: 0.95;
}

@media (min-width: 768px) {
  .body {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 32rpx;
  }

  .fab {
    right: max(32px, calc(50% - 450px + 32px));
  }
}
</style>
