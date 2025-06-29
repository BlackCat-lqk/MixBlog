<template>
  <div class="Login-main-box">
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" :size="size">
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="formValue.email" placeholder="请输入邮箱..." />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="mousedown"
          placeholder="请输入密码..."
        />
      </n-form-item>
      <div @click="handelforgotPwd"><span>忘记密码?</span></div>
      <n-form-item>
        <n-button style="height: 46px; width: 120px" type="primary" @click="handleLogin">
          登录
        </n-button>
      </n-form-item>
    </n-form>
  </div>
  <ForgotPwd
    v-model:show="showForgotPwdModal"
    @update:show="showForgotPwdModal = $event"
  ></ForgotPwd>
</template>

<script lang="ts" setup>
import { NButton, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { ref, reactive } from 'vue'
import { validateEmail, validatePassword } from '@/utils/validate'
import { loginUserApi } from '@/http/user'
import { useUserInfoStore } from '@/stores/userInfo'
import { _debounce } from '@/utils/publickFun'
import ForgotPwd from '@/views/RegisterLogin/components/ForgotPwd.vue'
// import { addAdminRoutes } from '@/router'
const router = useRouter()
const message = useMessage()
const userInfoStore = useUserInfoStore()
const formRef = ref<FormInst | null>(null)
const size = ref<'samll' | 'medium' | 'large'>('medium')

const showForgotPwdModal = ref(false)
interface FormType {
  email: string
  password: string
}
// 表单数据
const formValue: FormType = reactive({
  email: '',
  password: '',
})
// 表单验证规则
const rules = {
  email: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateEmail,
  },
  password: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validatePassword,
  },
}

// 登录
const handleLogin = _debounce(() => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const response = await loginUserApi(formValue)
      const res = response.data
      if (res.code === 200) {
        message.success(`欢迎您：${res.data.user.userName}`)
        userInfoStore.setUserInfo(res.data)
        userInfoStore.setAuthStatus(true)
        // 如果是管理员则注入后台路由
        // if (res.data.user.role === 'admin') {
        //   addAdminRoutes()
        // }
        router.push({ path: '/' })
      } else {
        message.error('登录失败,请检查账号邮箱或密码')
      }
    } else {
      message.error('请检查账号邮箱或密码')
    }
  })
}, 300)

// 忘记密码
const handelforgotPwd = () => {
  showForgotPwdModal.value = true
}
</script>

<style scoped lang="scss">
.Login-main-box {
  height: 100%;
  @include g.borderRadius(10px);
  display: flex;
  :deep(.n-form--inline) {
    display: flex;
    flex-direction: column;
    padding: 25px 25px 25px 0;
    justify-content: flex-start;
    & > div {
      width: 100%;
      margin: 30px 0;
    }
    & > div:nth-child(2) {
      margin-bottom: 10px;
    }
    & > div:nth-child(3) {
      margin: 0 0 10px 0;
      text-align: left;
      & > span:hover {
        cursor: pointer;
        color: blue;
      }
    }
    & > div:nth-child(4) {
      display: flex;
      justify-content: flex-end;
      margin: 0;
    }
    .n-input__input-el {
      height: 46px;
    }
  }
}
</style>
