<template>
  <div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formData.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="formData.email"
          name="email"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-field
          v-model="formData.code"
          name="code"
          label="验证码"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写6位验证码' }]"
        />
        <div>
          <van-button plain type="primary">获取验证码</van-button>
        </div>
        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <p>忘记密码</p>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const formData = reactive({
  username: '',
  email: '',
  code: '',
  password: ''
})


const onSubmit = (values) => {
  console.log('submit!', values)
}
</script>

<style scoped lang="scss">

</style>
