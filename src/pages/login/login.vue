<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarPx + 'px' }" />

    <view class="login">
      <view class="brand">
        <view class="logo">M</view>
        <view class="brand-text">
          <text class="title">欢迎回来</text>
        </view>
      </view>
      <text class="sub">使用账号与密码登录 Memorandum</text>

      <view class="field">
        <view
          class="input-wrap"
          :class="{ focused: accountFocus, error: accountError }"
        >
          <text class="field-label" :class="{ 'label-active': accountFocus && !accountError }">账号</text>
          <view class="input-inner">
            <input
              class="inp"
              type="text"
              v-model="account"
              placeholder="手机号 / 邮箱 / 用户名"
              placeholder-class="ph"
              maxlength="64"
              :adjust-position="true"
              @focus="onAccountFocus"
              @blur="onAccountBlur"
            />
          </view>
        </view>
        <text v-if="accountErrorMsg" class="field-hint">{{ accountErrorMsg }}</text>
      </view>

      <view class="field">
        <view
          class="input-wrap"
          :class="{ focused: passwordFocus, error: passwordError }"
        >
          <text class="field-label" :class="{ 'label-active': passwordFocus && !passwordError }">密码</text>
          <view class="input-inner">
            <input
              class="inp inp-pwd"
              :password="!pwdVisible"
              v-model="password"
              placeholder="请输入密码"
              placeholder-class="ph"
              maxlength="128"
              :adjust-position="true"
              @focus="onPasswordFocus"
              @blur="onPasswordBlur"
            />
            <text class="toggle-pw" @tap.stop="pwdVisible = !pwdVisible">{{ pwdVisible ? '隐藏' : '显示' }}</text>
          </view>
        </view>
        <text v-if="passwordErrorMsg" class="field-hint">{{ passwordErrorMsg }}</text>
      </view>

      <view class="row-pre">
        <checkbox-group class="remember-group" @change="onRememberChange">
          <label class="check-inline">
            <checkbox value="1" :checked="rememberMe" color="#6c8cff" class="cb" />
            <text class="check-text">记住密码</text>
          </label>
        </checkbox-group>
        <text class="link" @tap="onForgot">忘记密码？</text>
      </view>

      <checkbox-group class="agree-group" @change="onAgreeChange">
        <label class="agree-row">
          <checkbox value="agree" :checked="agreeTerms" color="#6c8cff" class="cb" />
          <view class="agree-text">
            <text>我已阅读并同意</text>
            <text class="link-inline" @tap.stop="openTerms">《服务条款》</text>
            <text>与</text>
            <text class="link-inline" @tap.stop="openPrivacy">《隐私政策》</text>
          </view>
        </label>
      </checkbox-group>
      <text v-if="agreeErrorMsg" class="agree-hint">{{ agreeErrorMsg }}</text>

      <button
        class="btn-submit"
        :class="{ 'btn-disabled': loading }"
        :disabled="loading"
        hover-class="btn-hover"
        @tap="onSubmit"
      >
        {{ loading ? '登录中…' : '登录' }}
      </button>

      <view class="sub-entry-wrap">
        <navigator class="register-link" url="/pages/register/register" open-type="navigate">注册新账号</navigator>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiPost } from '../../utils/api.js'
import { setAuth } from '../../utils/auth.js'

const statusBarPx = ref(0)

const account = ref('')
const password = ref('')
const rememberMe = ref(false)
const agreeTerms = ref(false)
const pwdVisible = ref(false)

const accountFocus = ref(false)
const passwordFocus = ref(false)

const accountError = ref(false)
const passwordError = ref(false)
const accountErrorMsg = ref('')
const passwordErrorMsg = ref('')
const agreeErrorMsg = ref('')

const loading = ref(false)

function onAccountFocus() {
  accountFocus.value = true
}

function onAccountBlur() {
  accountFocus.value = false
}

function onPasswordFocus() {
  passwordFocus.value = true
}

function onPasswordBlur() {
  passwordFocus.value = false
}

function clearErrors() {
  accountError.value = false
  passwordError.value = false
  accountErrorMsg.value = ''
  passwordErrorMsg.value = ''
  agreeErrorMsg.value = ''
}

function onRememberChange(e) {
  const v = e.detail.value || []
  rememberMe.value = v.includes('1')
}

function onAgreeChange(e) {
  const v = e.detail.value || []
  agreeTerms.value = v.includes('agree')
  if (agreeTerms.value) agreeErrorMsg.value = ''
}

function onForgot() {
  uni.showToast({ title: '演示：跳转找回密码', icon: 'none' })
}

function openTerms() {
  uni.showToast({ title: '演示：打开服务条款', icon: 'none' })
}

function openPrivacy() {
  uni.showToast({ title: '演示：打开隐私政策', icon: 'none' })
}

function validate() {
  clearErrors()
  let ok = true
  if (!account.value.trim()) {
    accountError.value = true
    accountErrorMsg.value = '请输入账号'
    ok = false
  }
  if (!password.value) {
    passwordError.value = true
    passwordErrorMsg.value = '请输入密码'
    ok = false
  }
  if (!agreeTerms.value) {
    agreeErrorMsg.value = '请先勾选同意服务条款与隐私政策'
    ok = false
  }
  return ok
}

async function onSubmit() {
  if (loading.value) return
  if (!validate()) return

  loading.value = true
  try {
    const response = await apiPost('/auth/login', {
      account: account.value.trim(),
      password: password.value,
      rememberMe: rememberMe.value,
    })
    setAuth(response.data.token, response.data.user)
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/memo/memo' })
    }, 300)
  } catch (err) {
    uni.showToast({ title: err.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
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
  box-sizing: border-box;
  background: linear-gradient(180deg, #f4f6fb 0%, #eef1f8 100%);
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.status-bar {
  width: 100%;
}

.login {
  padding: 32rpx 48rpx 48rpx;
}

.brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16rpx;
}

.logo {
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #6c8cff 0%, #8b5cf6 100%);
  color: #fff;
  font-size: 40rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(108, 140, 255, 0.35);
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #1a1f2e;
  letter-spacing: -0.02em;
}

.sub {
  display: block;
  font-size: 28rpx;
  color: #6b7289;
  margin-bottom: 48rpx;
  line-height: 1.5;
}

.field {
  margin-bottom: 20rpx;
}

.input-wrap {
  position: relative;
  background: #fff;
  border: 3rpx solid #e2e6ef;
  border-radius: 28rpx;
  padding: 36rpx 28rpx 24rpx;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrap.focused {
  border-color: #6c8cff;
  box-shadow: 0 0 0 8rpx rgba(108, 140, 255, 0.18);
}

.input-wrap.error {
  border-color: #ff6b7a;
  box-shadow: 0 0 0 8rpx rgba(255, 107, 122, 0.15);
}

.field-label {
  position: absolute;
  left: 24rpx;
  top: -18rpx;
  padding: 0 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #6b7289;
  background: #fff;
  line-height: 1.2;
  z-index: 1;
}

.field-label.label-active {
  color: #6c8cff;
}

.input-wrap.error .field-label {
  color: #ff6b7a;
}

.input-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 48rpx;
}

.inp {
  flex: 1;
  font-size: 32rpx;
  color: #1a1f2e;
  min-width: 0;
}

.ph {
  color: #a8b0c4;
}

.inp-pwd {
  padding-right: 16rpx;
}

.toggle-pw {
  font-size: 24rpx;
  font-weight: 600;
  color: #6c8cff;
  padding: 8rpx 0 8rpx 16rpx;
}

.field-hint {
  display: block;
  font-size: 24rpx;
  color: #ff6b7a;
  margin-top: 8rpx;
  min-height: 32rpx;
}

.row-pre {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 8rpx 0 32rpx;
}

.check-inline {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cb {
  transform: scale(0.92);
}

.check-text {
  font-size: 26rpx;
  color: #4b5569;
  margin-left: 8rpx;
}

.link {
  font-size: 26rpx;
  font-weight: 600;
  color: #6c8cff;
}

.agree-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.remember-group {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
}

.agree-group {
  display: block;
  margin-bottom: 0;
}

.agree-text {
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  font-size: 24rpx;
  line-height: 1.55;
  color: #6b7289;
  margin-left: 8rpx;
}

.link-inline {
  color: #6c8cff;
  font-weight: 600;
}

.agree-hint {
  display: block;
  font-size: 24rpx;
  color: #ff6b7a;
  margin: -4rpx 0 28rpx 52rpx;
  min-height: 36rpx;
}

.btn-submit {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 28rpx;
  border: none;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6c8cff 0%, #7c6bff 100%);
  box-shadow: 0 12rpx 32rpx rgba(108, 140, 255, 0.35);
  margin-top: 8rpx;
}

.btn-submit::after {
  border: none;
}

.btn-hover {
  transform: scale(0.98);
  opacity: 0.96;
}

.btn-submit.btn-disabled {
  opacity: 0.65;
}

.sub-entry-wrap {
  margin-top: 32rpx;
  text-align: center;
}

.register-link {
  font-size: 28rpx;
  font-weight: 600;
  color: #6c8cff;
}

/* 电脑网页端：蓝粉渐变背景 + 居中毛玻璃登录卡片 */
@media (min-width: 768px) {
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px calc(32px + env(safe-area-inset-bottom));
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
  }

  .status-bar {
    display: none;
  }

  .login {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 40px 36px 44px;
    box-sizing: border-box;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.38);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow:
      0 32px 64px rgba(31, 38, 135, 0.28),
      0 12px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.65);
  }

  .login .field-label {
    background: rgba(255, 255, 255, 0.82);
  }

  .login .input-wrap {
    background: rgba(255, 255, 255, 0.92);
  }
}
</style>
