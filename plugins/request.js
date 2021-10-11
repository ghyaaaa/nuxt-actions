import axios from 'axios';

export const request = axios.create({
  baseURL: 'http://realworld.api.fed.lagounews.com/'
})

// 插件导出成员必须作为默认成员
export default ({ store }) => {
  const { user } = store.state;
  // 请求拦截器
  const {} = store.state;
  request.interceptors.request.use((config) => {
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config;
  }, err => {
    // 请求还没发出去时就失败
    return Promise.reject(err)
  })

  // 响应拦截器
}