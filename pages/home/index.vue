<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link 
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'your-feed'
                  }" 
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your-feed'
                    }
                  }"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  exact
                  :class="{
                    active: tab === 'global-feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global-feed'
                    }
                  }"
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                >#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <article-preview v-for="article in articles" :key="article.slug" :article="article" />
          <div v-if="articles.length === 0" class="article-preview">
            No articles are here... yet.
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link 
                v-for="item in tags" 
                :key="item" 
                :to="{
                  name: 'home',
                  query: { 
                    tag: item,
                    tab: 'tag'
                  }
                }" 
                class="tag-pill tag-default"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>

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
                name: 'home', 
                query: {
                  page: item,
                  tag: tag,
                  tab: tab
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
</template>

<script>
import { mapState } from 'vuex';
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '../../api/article';
import { getTags } from '../../api/tag';
import ArticlePreview from '../../components/article-preview';

export default {
  name: 'HomeIndex',
  watchQuery: ['page', 'tag', 'tab'],
  components: {
    ArticlePreview
  },
  async asyncData({ query, store }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 10;
    const { tag, tab = 'global-feed' } = query;
    const loadArticle = store.state.user && tab === 'your-feed' 
      ? getFeedArticles
      : getArticles
    const { data } = await loadArticle({
      limit,
      offset: (page - 1) * limit
    })
    const { data: tagData } = await getTags();
    data.articles.forEach(article => {
      article.favoriteDisabled = false;
    })
    return {
      articles: data.articles,
      articlesCount: data.articlesCount,
      limit,
      page,
      tags: tagData.tags,
      tag,
      tab
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite(article) {
      console.log(article)
      article.favoriteDisabled = true;
      const { favorited, slug } = article;
      if (favorited) {
        await deleteFavorite(slug)
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await addFavorite(slug)
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    }
  }
}
</script>
