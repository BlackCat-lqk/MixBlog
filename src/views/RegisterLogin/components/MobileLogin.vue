<template>
  <div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formData.email"
          name="email"
          label="邮箱"
          placeholder="邮箱"
          :rules="[
            { required: true, message: '请填写电子邮箱' },
            {
              required: true,
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '邮箱格式不正确',
            },
          ]"
        />
        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              validator: (value) => {
                return value && value.length >= 6 && value.length <= 20
              },
              message: '密码长度需在6到20个字符之间',
            },
            { pattern: /^[^\u4e00-\u9fa5]*$/, required: true, message: '密码为数字、字母、符号' },
          ]"
        />
      </van-cell-group>
      <div><van-highlight keywords="忘记密码?" source-string="忘记密码?" @click="handelforgotPwd" /></div>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 登录 </van-button>
      </div>
    </van-form>
  </div>
  <ForgotPwd
    v-model:show="showForgotPwdModal"
    @update:show="showForgotPwdModal = $event"
  ></ForgotPwd>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { loginUserApi } from '@/http/user'
import { useUserInfoStore } from '@/stores/userInfo'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'
import ForgotPwd from '@/views/RegisterLogin/components/H5/MobileForgotPwd.vue'

const showForgotPwdModal = ref(false)
const router = useRouter()
const userInfoStore = useUserInfoStore()
const formData = reactive({
  email: '',
  password: '',
})

interface FormValues {
  email: string
  password: string
}
// 登录
const onSubmit = ( async (values: FormValues) => {
  const response = await loginUserApi(values)
  const res = response.data
  if (res.code === 200) {
    showNotify({ type: 'primary', message: `欢迎您：${res.data.user.userName}` });
    userInfoStore.setUserInfo(res.data)
    userInfoStore.setAuthStatus(true)
    router.push({ path: '/' })
  } else {
    showNotify({ type: 'danger', message: '登录失败,请检查账号邮箱或密码' });
  }
})
// 忘记密码
const handelforgotPwd = () => {
  showForgotPwdModal.value = true
}
</script>

<style scoped lang="scss">
.van-cell-group--inset {
  display: flex;
  gap: 16px;
  flex-direction: column;
  .van-cell-group {
    background: none;
  }
  .van-cell{
    border-radius: 8px;
  }
}
:deep(.van-highlight) {
  margin: 16px 0 0 16px;
  .van-highlight__tag {
    font-size: 0.8rem;
    color: var(--text-color1);
  }
}
</style>
