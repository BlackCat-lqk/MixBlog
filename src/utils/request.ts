import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000 * 60, // 请求超时时间（1分钟）
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('userInfo')
    const token = userData ? JSON.parse(userData).data.token : ''
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.data.code === 200) {
      return res
    } else {
      console.log(res.data.message || '未知错误')
      return Promise.reject(new Error(res.data.message || 'Unknown error'))
    }
  },
  (error) => {
    console.log('网络异常', error)
    const res = {
      data: {
        code: error.response.data.data.code,
        message: error.response.data.data.message,
        data: null,
        success: false,
      },
    }
    return res
  },
)

export default service
