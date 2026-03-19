<template>
  <div>
    <page-header></page-header>
    <h2>Login</h2>
    <p v-if="$route.query.redirect">You need to log in first.</p>
    <form @submit.prevent="login">
      <label><input v-model="account" placeholder="account" /></label>
      <label
        ><input v-model="pass" placeholder="password" type="password"
      /></label>
      <button type="submit">log in</button>
      <p v-if="error" class="error">Incorrect login</p>
    </form>
  </div>
</template>
<script>
import auth from "../auth";
import PageHeader from "../components/PageHeader.vue";
export default {
  data() {
    return {
      account: "",
      pass: "",
      error: false
    };
  },
  methods: {
    login() {
      auth.login(this.account, this.pass, (loggedIn) => {
        if (!loggedIn) {
          this.error = true;
        } else {
          this.$router.replace(this.$route.query.redirect || "/");
        }
      });
    }
  },
  components: { PageHeader }
};
</script>
<style>
.error {
  color: #ff0000;
}
</style>
