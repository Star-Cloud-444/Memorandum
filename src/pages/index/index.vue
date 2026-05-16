<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <navigator class="to-login" url="/pages/login/login" open-type="navigate">进入登录页</navigator>
    <navigator class="to-memo" url="/pages/memo/memo" open-type="navigate">备忘录首页</navigator>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {},
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.to-login {
  margin-top: 60rpx;
  font-size: 30rpx;
  color: #6c8cff;
}

.to-memo {
  margin-top: 32rpx;
  font-size: 30rpx;
  color: #6c8cff;
}
</style>
