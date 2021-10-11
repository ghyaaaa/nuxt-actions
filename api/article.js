import { request } from '../plugins/request';

export const getArticles = (params) => {
  return request({
    url: '/api/articles',
    params
  })
}

export const getFeedArticles = (params) => {
  return request({
    url: '/api/articles/feed',
    params,
    headers: {
      Authorization: `Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTI0MTg5LCJ1c2VybmFtZSI6Inlpc2h1YWkiLCJleHAiOjE2MTA5MzY5MTB9.eFxzc-k4pJm43vYVlPmRMErT98ZIR9vKWIq276iTedY`
    }
  })
}

// 点赞
export const addFavorite = (slug) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`
  })
}

export const getArticle = (slug) => {
  return request({
    url: `/api/articles/${slug}`
  })
}

export const getComments = (slug) => {
  return request({
    url: `/api/articles/${slug}/comments`
  })
}

export const addComment = (slug, data) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/comments`,
    data
  })
}

export const favoriteArticle = (slug) => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'POST'
  })
}

export const unfavoriteArticle = (slug) => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'DELETE'
  })
}

export const createArticle = (data) => {
  return request({
    url: `/api/articles`,
    data,
    method: 'POST'
  })
}

export const updateArticle = (slug, data) => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'PUT',
    data
  })
}


export const deleteArticle = (slug) => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'DELETE'
  })
}