<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
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
                  <input v-model="userInfo.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="userInfo.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="userInfo.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="userInfo.email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="userInfo.password" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right" type="submit">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import { mapMutations, mapState } from 'vuex';
import { updateUser } from '../../api/user';


export default {
  name: 'Settings',
  middleware: ['authenticated'],
  data() {
    return {
      userInfo: {
        image: "",
        username: "",
        bio: "",
        email: "",
        password: ""
      },
      loading: false,
      errors: {}
    }
  },
  mounted() {
    const { image, username, bio, email } = this.user;
    this.userInfo = {
      image,
      username,
      bio,
      email,
      password: ""
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapMutations(['setUser']),
    logout(){
      Cookie.remove('user');
      this.setUser(null)
      this.$router.push({name: 'home'})
    },
    async onSubmit() {
      this.loading = true;
      try {
        const { data } = await updateUser(this.userInfo);
        const { user } = data;
        Cookie.set('user', user);
        this.setUser(user);
        this.$router.push({
          name: 'profile',
          params: {
            username: user.username
          }
        })
      } catch (err) {
        this.loading = false;
        if (err?.response?.data) {
          this.errors = err.response.data.errors;
        }
      }
    }
  }
}
</script>
