<template>
  <div class="mt-3">
    <b-container>
      <b-row cols-md="4">
        <div v-for="task in taskList" :key="task.id">
          <b-card
            border-variant="info"
            :header="task.name"
            class="m-1"
            align="center"
          >
            <b-card-text>
              <p>Progress: {{ task.currentCount }} / {{ task.totalCount }}</p>
            </b-card-text>

            <router-link
              :to="{ name: 'annotations', params: { stageId: task.id } }"
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
import auth from "../utils/auth";
import axios from "axios";

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

      const res = await axios
        .get(`${Settings.PROTOCOL}://${Settings.HOST}:${Settings.PORT}/api/memes/stages`, {
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
