<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title}}</h1>

        <article-meta :article="article" />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <form class="card comment-form" v-if="user">
            <div class="card-block">
              <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="commentValue"></textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img" />
              <button :disabled="postingComment" class="btn btn-sm btn-primary" @click="onPostComment">
              Post Comment
              </button>
            </div>
          </form>
          <p v-else show-authed="false" style="display: inherit;">
            <nuxt-link :to="{name: 'login'}">Sign in</nuxt-link> or <nuxt-link :to="{name: 'register'}">sign up</nuxt-link> to add comments on this article.
          </p>
          
          <div class="card" v-for="comment in comments" :key="comment.id">
            <div class="card-block">
              <p class="card-text">{{comment.body}}</p>
            </div>
            <div class="card-footer">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: comment.author.username
                }
              }" class="comment-author">
                <img :src="comment.author.image" class="comment-author-img" />
              </nuxt-link>
              &nbsp;
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: comment.author.username
                }
              }" class="comment-author">{{ comment.author.username }}</nuxt-link>
              <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY')}}</span>
            </div>
          </div>
          
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getArticle, getComments, addComment } from '../../api/article';
import MarkdownIt from 'markdown-it';
import ArticleMeta from '../../components/article-meta.vue';
export default {
  name: 'Article',
  components: { ArticleMeta },
  async asyncData({params}) {
    const { slug } = params;
    const { data } = await getArticle(slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body)
    return {
      article: article
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  data() {
    return {
      commentValue: '',
      postingComment: false,
      comments: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted() {
    // console.log(this.$route)
    const { data } = await getComments(this.$route.params.slug);
    this.comments = data.comments;
    console.log(data)
  },
  methods: {
    async onPostComment() {
      const commentBody = this.commentValue.trim();
      if (!commentBody) return;
      this.postingComment = true;
      this.commentValue = '';
      const { data } = await addComment(this.$route.params.slug, {
        comment: {
          body: commentBody
        }
      });
      this.postingComment = false;
      console.log(data);
      this.comments.unshift(data.comment);
    }
  }
}
</script>
