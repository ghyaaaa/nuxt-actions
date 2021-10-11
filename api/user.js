import { request } from '../plugins/request';

// login
export const login = (data) => {
  return request({
    url: '/api/users/login',
    method: 'POST',
    data,
  })
}

// register
export const register = (data) => {
  return request({
    url: '/api/users',
    method: 'POST',
    data
  })
}

export const getProfile = (username) => {
  return request({
    url: `/api/profiles/${username}`,
  })
}

export const followUser = (username) => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

export const unFollowUser = (username) => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}

export const updateUser = (data) => {
  return request({
    method: 'PUT',
    url: `/api/user`,
    data
  })
}