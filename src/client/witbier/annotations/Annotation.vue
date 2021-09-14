<template>
  <div class="post">
    <div class="loading" v-if="loading">Loading...</div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <b-container>
      <b-row cols-md="3">
        <meme v-for="annotation in annotationList" :key="annotation.id" v-bind:annotation="annotation"></meme>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Settings } from '../config/api.config';
import Meme from './Meme.vue'
import axios from 'axios';

export default {
  components: {
    'meme': Meme
  },
  data() {
    return {
      offset: 0,
      limit: 9,
      
      loading: false,
      post: null,
      error: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.error = this.annotationList = null;
      this.loading = true;

      axios
        .get(`http://${Settings.HOST}:${Settings.PORT}/api/memes/annotations?offset=${this.offset}&limit=${this.limit}`, {
          headers: {
            "x-access-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjMxNjA5MzU0LCJleHAiOjE2MzE2OTU3NTR9.k6pE6n8OfReqIXIfE4Zu301as9X6V6d2r6DbfMypr-E",
          },
        })
        .then((res) => {
          this.loading = false;
          this.annotationList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
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