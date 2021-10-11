<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div v-if="profile" class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <button v-if="user && user.username === profile.username" class="btn btn-sm btn-outline-secondary action-btn" @click="gotoSettings">
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings
            </button>
            <button v-else class="btn btn-sm btn-outline-secondary action-btn" :disabled="profile.disabled" @click="toggleFollowUser">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{profile.following ? 'Follow' : 'Unfollow'}} {{ profile.username }} 
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  exact
                  :class="{
                    active: $route.name === 'profile'
                  }" 
                  :to="{
                    name: 'profile',
                    params: {
                      username: $route.params.username
                    }
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  exact 
                  :class="{
                    active: $route.name === 'favorites'
                  }" 
                  :to="{
                    name: 'favorites',
                    params: {
                      username: $route.params.username
                    }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <article-preview v-for="article in articles" :key="article.slug" :article="article"/>
          <div v-if="articles.length === 0" class="article-preview">
            No articles are here... yet.
          </div>
          <nav>
            <ul class="pagination">
              <li 
                v-for="item in totalPage" 
                :key="item" 
                class="page-item" 
                :class="{active: item === page}"
              >
                <nuxt-link  
                  class="page-link" 
                  :to="{
                    name: 'profile', 
                    params: {
                      username: $route.params.username
                    },
                    query: {
                      page: item,
                    }
                  }"
                >
                  {{item}}
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

      </div>
      
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getProfile, followUser, unFollowUser } from '../../api/user';
import { getArticles } from '../../api/article';
import ArticlePreview from '../../components/article-preview';

export default {
  name: 'UserProfile',
  components: {
    ArticlePreview
  },
  watchQuery: ['page'],
  async asyncData({ params, query, route }) {
    const { name } = route
    const page = Number.parseInt(query.page || 1);
    const limit = 10;
    const { username } = params;
    const queryPatams = name === 'profile' 
    ? 
      {
        author: username,
        limit,
        offset: (page - 1) * limit
      } 
    : 
      {
        favorited: username,
        limit,
        offset: (page - 1) * limit
      }
    const { data } = await getArticles(queryPatams)
    const { articles, articlesCount } = data;

    const { data: profileData } = await getProfile(username)
    const { profile } = profileData;
    profile.disabled = false;
    return {
      articles,
      articlesCount,
      limit,
      page,
      profile
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    gotoSettings() {
      this.$router.push({
        name: 'settings'
      })
    },
    async toggleFollowUser() {
      this.profile.disabled = true;
      if (this.profile.following) {
        await unFollowUser(this.profile.username);
        this.profile.following = false;
      } else {
        await followUser(this.profile.username);
        this.profile.following = true;
      }
      this.profile.disabled = false;
    }
  }
}
</script>
