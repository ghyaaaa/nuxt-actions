import axios from 'axios';

const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // config.headers.Authorization = `Token `
  return config;
}, err => {
  // 请求还没发出去时就失败
  return Promise.reject(err)
})

// 响应拦截器

export default request;
