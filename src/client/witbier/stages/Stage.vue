<template>
  <div class="mt-3">
    <b-container>
      <b-row cols-md="4">
        <div v-for="task in taskList" :key="task.id">
          <b-card
            border-variant="info"
            :header="task.name"
            class="m-2"
            align="center"
          >
            <b-card-text>
              <p>Progress: {{ task.currentCount }} / {{ task.totalCount }}</p>
            </b-card-text>

            <router-link
              :to="{ name: 'annotations', params: { routeId: task.id } }"
            >
              <b-button variant="info">Start!</b-button>
            </router-link>
          </b-card>
        </div>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { Settings } from "../config/api.config";
import axios from "axios";
import auth from "../authentication/auth";

export default {
  data() {
    return {
      taskList: [],
    };
  },
  created() {
    this.fetchStages();
  },
  methods: {
    async fetchStages() {
      this.error = this.taskList = null;
      this.loading = true;

      const offset = (this.currentPage - 1) * this.limit;

      const res = await axios
        .get(`http://${Settings.HOST}:${Settings.PORT}/api/memes/stages`, {
          headers: {
            "x-access-token": auth.getToken(),
          },
        })
        .catch((err) => {
          console.log(err);
        });

      this.loading = false;
      this.taskList = res.data;
    },
  },
};
</script>
