<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(errorGroup, errorType) in errors">
              <li v-for="error in errorGroup" :key="error">
                {{ errorType + error}}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                  <input :disabled="loading" v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input :disabled="loading" v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea :disabled="loading" v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input :disabled="loading" v-model="article.tagList" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit" :disabled="loading">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from '../../api/article';
export default {
  middleware: ['authenticated'],
  name: "Editor",
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: ''
      },
      loading: false,
      errors: {}
    }
  },
  computed: {
    isUpdate() {
      return this.$route.name === 'updateArticle';
    }
  },
  async created() {
    if (this.isUpdate) {
      this.loading = true
      const { data } = await getArticle(this.$route.params.slug);
      this.loading = false
      const { article } = data;
      this.article = {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.join(',')
      }
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true
      this.errors = {}
      const articleParams = {...this.article};
      this.article = {
        title: '',
        description: '',
        body: '',
        tagList: ''
      }
      
      articleParams.tagList = articleParams.tagList.trim().split(',').map(item => item.trim()).filter(item => item !== '');
      try {
        let result;
        if (this.isUpdate) {
          result = await updateArticle(this.$route.params.slug, articleParams)
        } else {
          result = await createArticle(articleParams);
        }

        const { article } = result.data;
        this.$router.push({
          name: 'article',
          params: {
            slug: article.slug
          }
        })
      } catch(err) {
        this.loading = false;
        if (err?.response?.data) {
          this.errors = err.response.data.errors;
        }
      }
    }
  }
}
</script>
