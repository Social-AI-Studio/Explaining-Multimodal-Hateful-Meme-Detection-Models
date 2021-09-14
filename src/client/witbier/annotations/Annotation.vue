<template>
  <div class="annotation mb-2 mt-2">
    <div class="loading" v-if="loading">Loading...</div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <b-container>
      <b-row cols-md="3">
        <meme
          v-for="annotation in annotationList"
          :key="annotation.id"
          v-bind:annotation="annotation"
        ></meme>
      </b-row>
    </b-container>

    <div class="mt-3">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        align="center"
        per-page="9"
        hide-goto-end-buttons
        last-number
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import { Settings } from "../config/api.config";
import Meme from "./Meme.vue";
import axios from "axios";
import auth from "../authentication/auth"

export default {
  components: {
    meme: Meme,
  },
  data() {
    return {
      rows: 1,
      currentPage: 1,
      limit: 9,

      loading: false,
      post: null,
      error: null,
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    currentPage: function (val, oldVal) {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      this.error = this.annotationList = null;
      this.loading = true;

      const offset = (this.currentPage - 1) * this.limit;

      const res = await axios
        .get(
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/annotations?offset=${offset}&limit=${this.limit}`,
          {
            headers: {
              "x-access-token": auth.getToken()
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });

      this.loading = false;
      this.rows = res.data.count;
      this.annotationList = res.data.rows;
    },
  },
};
</script>

<style>
.loading {
  position: absolute;
  top: 10px;
  right: 10px;
}
.error {
  color: red;
}
.content {
  transition: all 0.35s ease;
  position: absolute;
}
.slide-enter {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-leave-active {
  opacity: 0;
  transform: translate(-30px, 0);
}
</style>