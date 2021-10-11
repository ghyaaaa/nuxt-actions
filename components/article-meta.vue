<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">{{ article.author.username }}</nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY')}}</span>
    </div>
    <template v-if="user.username === article.author.username">
      <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{
        name: 'updateArticle',
        params: {
          slug: article.slug
        }
      }">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button class="btn btn-outline-danger btn-sm" @click="hanleDeleteArticle">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button 
        class="btn btn-sm" 
        :class="{
          'btn-outline-secondary': !article.author.following,
          'btn-secondary': article.author.following
        }"
        :disabled="followDisabled"
        @click="toggleFollowUser"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }} <span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button 
        class="btn btn-sm"
        :class="{
          'btn-outline-primary': !article.favorited,
          'btn-primary': article.favorited
        }" 
        :disabled="favoriteDisabled"
        @click="toggleFavoriteArticle"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? 'UnFavorite' : 'Favorite'}} Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { followUser, unFollowUser } from '../api/user';
import { favoriteArticle, unfavoriteArticle, deleteArticle } from '../api/article';

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      followDisabled: false,
      favoriteDisabled: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async toggleFollowUser() {
      this.followDisabled = true;
      if (this.article.author.following) {
        await unFollowUser(this.article.author.username);
        this.article.author.following = false;
      } else {
        await followUser(this.article.author.username);
        this.article.author.following = true;
      }
      this.followDisabled = false;
    },
    async toggleFavoriteArticle() {
      this.favoriteDisabled = true;
      if (this.article.favorited) {
        await unfavoriteArticle(this.article.slug);
        this.article.favorited = false;
        this.article.favoritesCount -= 1;
      } else {
        await favoriteArticle(this.article.slug);
        this.article.favorited = true;
        this.article.favoritesCount += 1;
      }
      this.favoriteDisabled = false;
    },
    async hanleDeleteArticle() {
      await deleteArticle(this.article.slug);
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<style>

</style>