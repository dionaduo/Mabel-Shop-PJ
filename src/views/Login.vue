<template>
  <div class="login-container">
    <van-nav-bar title="会员登录" left-text="返回" left-arrow @click-left="onBack" />

    <div class="login-form">
      <!-- 表单 -->
      <van-form @submit="onSubmit" ref="formRef">
        <van-cell-group inset>
          <!-- 用户名 -->
          <van-field
              v-model="form.username"
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
              left-icon="user-o"
          />

          <!-- 密码 -->
          <van-field
              v-model="form.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
              left-icon="lock"
          />
        </van-cell-group>

        <!-- 登录按钮 -->
        <div style="margin: 20px 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            登录
          </van-button>
        </div>
      </van-form>

      <!-- 其他操作 -->
      <div class="login-links">
        <router-link to="/register">立即注册</router-link>
        <router-link to="/forgot-password">忘记密码？</router-link>
      </div>
    </div>

    <!-- 提示信息 -->
<!--    <van-toast v-model:show="toast.show" :type="toast.type" :message="toast.message" />-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast} from 'vant'
import { login } from '@/api/user/login.ts'
import type { LoginParams } from '@/types/user/login.ts'

const router = useRouter()

// 表单数据
const form = reactive<LoginParams>({
  username: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 表单引用
const formRef = ref()

// 返回上一页
const onBack = () => {
  router.back()
}

// 提交登录
const onSubmit = async () => {
  loading.value = true
  try {
    const res = await login(form)

    if (res.errno === 0) {
      // 登录成功，保存 token 和用户信息
      const { token, userInfo } = res.data
      // 示例：保存到 localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      // 显示成功提示
      showToast({ type: 'success', message: '登录成功' })

      // 跳转到首页或之前页面
      setTimeout(() => {
        router.replace('/') // 跳转到首页
      }, 1000)
    } else {
      // 业务错误
      showToast({ type: 'fail', message: res.errmsg || '登录失败' })
    }
  } catch (error) {
    console.error('登录异常:', error)
    showToast({ type: 'fail', message: '网络异常，请稍后重试' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  margin-top: 30px;
}

.login-links {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-links a {
  color: #1989fa;
  text-decoration: none;
}
</style>