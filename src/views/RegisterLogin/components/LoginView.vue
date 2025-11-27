<template>
  <div class="Login-main-box">
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" :size="size">
      <n-form-item :label="$t('common.email')" path="email">
        <n-input
          v-model:value="formValue.email"
          clearable
          :placeholder="$t('common.emailPlaceholder')"
        >
          <template #prefix>
            <img width="20px" src="@/assets/images/Email.svg" alt="Email" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item :label="$t('common.pwd')" path="password">
        <n-input
          v-model:value="formValue.password"
          type="password"
          clearable
          show-password-on="mousedown"
          :placeholder="$t('common.pwdPlaceholder')"
        >
          <template #prefix>
            <img width="20px" src="@/assets/images/passWord.svg" alt="password" />
          </template>
        </n-input>
      </n-form-item>
      <div>
        <span @click="handelforgotPwd">{{ $t('login.forgotPwd') }}</span>
        <div>
          <n-checkbox v-model:checked="formValue.rememberMe" @update:checked="handleRemeberPwd">
            记住我
          </n-checkbox>
        </div>
      </div>
      <n-form-item>
        <n-button style="height: 46px; width: 120px" type="primary" @click="handleLogin">
          {{ $t('common.login') }}
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
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { ref, reactive, onMounted } from 'vue'
import { validateEmail, validatePassword } from '@/utils/validate'
import { loginUserApi, getEncryptionKey } from '@/http/user'
import { useUserInfoStore } from '@/stores/userInfo'
import { _debounce } from '@/utils/publickFun'
import ForgotPwd from '@/views/RegisterLogin/components/ForgotPwd.vue'
import { encodeCredentials, decodeCredentials } from '@/utils/crypto'
import type { ILoginFormType as FormType } from '@/tsInterface'
const { t } = useI18n()
const router = useRouter()
const message = useMessage()
const userInfoStore = useUserInfoStore()
const formRef = ref<FormInst | null>(null)
const size = ref<'samll' | 'medium' | 'large'>('medium')

const showForgotPwdModal = ref(false)
// 加密密钥
const encryptionKey = ref('')
// 获取加密密钥
const fetchEncryptionKey = async () => {
  try {
    const response = await getEncryptionKey()
    const res = response.data
    if (res.code == 200) {
      encryptionKey.value = res.key
      checkSavedCredentials()
    } else {
      console.error(res.message)
    }
  } catch (error: unknown) {
    console.log(error)
  }
}
// 检查已保存的凭据
const checkSavedCredentials = () => {
  const hasKey = localStorage.getItem('key_remrber')
  if (!hasKey) return
  const saved = localStorage.getItem('blog_credentials')
  if (saved) {
    const credentials = decodeCredentials(saved, hasKey)
    if (credentials) {
      formValue.email = credentials.email
      formValue.password = credentials.password
      formValue.rememberMe = true
    }
  } else {
    // 如果没有保存的凭据，则清空表单
    formValue.password = ''
    formValue.rememberMe = false
  }
}
// 表单数据
const formValue: FormType = reactive({
  email: '',
  password: '',
  rememberMe: false,
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

// 记住密码
const handleRemeberPwd = (checked: boolean) => {
  formValue.rememberMe = checked
}

// 登录
const handleLogin = _debounce(() => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const response = await loginUserApi(formValue)
      const res = response.data
      if (res.code === 200) {
        message.success(t('login.loginSuccess') + `${res.data.user.userName}`)
        userInfoStore.setUserInfo(res.data)
        userInfoStore.setAuthStatus(true)
        // 处理记住我选项
        if (formValue.rememberMe) {
          // 先检查localStorage中是否有加密密钥
          const saved = localStorage.getItem('key_remrber')
          if (!saved) {
            const encoded = encodeCredentials(
              formValue.email,
              formValue.password,
              encryptionKey.value,
            )
            localStorage.setItem('key_remrber', encryptionKey.value)
            localStorage.setItem('blog_credentials', encoded)
          } else {
            // 如果有则直接使用
            const encoded = encodeCredentials(formValue.email, formValue.password, saved)
            localStorage.setItem('blog_credentials', encoded)
          }
        } else {
          localStorage.removeItem('blog_credentials')
        }
        router.push({ path: '/' })
      } else {
        message.error(t('login.loginError'))
      }
    } else {
      message.error(t('login.loginError1'))
    }
  })
}, 300)

// 忘记密码
const handelforgotPwd = () => {
  showForgotPwdModal.value = true
}
onMounted(() => {
  fetchEncryptionKey()
})
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
      display: flex;
      justify-content: space-between;
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
