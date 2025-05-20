import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const token = localStorage.getItem('token')
    if (token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = token
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
    const res = response
    // @ts-expect-error 后端返回结构可能不符合ResponseData接口，需兼容不同格式
    if (res.code === 200) {
      return response
    } else {
      // @ts-expect-error 忽略类型检查
      $naiveMessage.error(res.message || '未知错误')
      // @ts-expect-error 后端返回结构可能不符合ResponseData接口
      return Promise.reject(new Error(res.message || 'Unknown error'))
    }
  },
  (error) => {
    // @ts-expect-error 忽略类型检查
    $naiveMessage.error('网络异常，请稍后再试')
    return Promise.reject(error)
  },
)

export default service
