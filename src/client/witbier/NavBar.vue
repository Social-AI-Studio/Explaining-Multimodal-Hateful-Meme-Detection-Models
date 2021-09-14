<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">SocialAI Studio</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <router-link v-if="loggedIn" to="/annotation">Annotation</router-link>
            <router-link v-if="loggedIn" to="/logout">Log out</router-link>
            <router-link v-if="!loggedIn" to="/login">Log in</router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import auth from "./authentication/auth";

export default {
  data() {
    return {
      loggedIn: auth.loggedIn(),
    };
  },
  created() {
    auth.onChange = (loggedIn) => {
      this.loggedIn = loggedIn;
    };
  },
};
</script>
