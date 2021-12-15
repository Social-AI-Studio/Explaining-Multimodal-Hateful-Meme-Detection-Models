<template>
  <div class="annotation mb-2 mt-2">
    <div class="loading" v-if="loading">Loading...</div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div align="center">
      <span><b>{{this.stage}}</b></span> <br>
      {{this.currCount}} / {{this.totalCount}}
    </div>
    <br>
    <b-container>

      <b-row cols-md="3">
        <explanation
          v-for="annotation in annotationList"
          :key="annotation.id"
          v-bind:annotation="annotation"
          v-on:onSaveClick="onSaveClick"
        ></explanation>
      </b-row>

      <div class="mt-3">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalCount"
          align="center"
          per-page="9"
          hide-goto-end-buttons
          last-number
        ></b-pagination>
      </div>
      
    </b-container>
  </div>
</template>

<script>
import { Settings } from "../config/api.config";
import Explanation from "../components/Explanation.vue";
import auth from "../utils/auth";
import axios from "axios";

export default {
  components: {
    explanation: Explanation,
  },
  data() {
    return {
      stage: "",
      currCount: 0,
      totalCount: 1,

      currentPage: 1,
      limit: 9,

      loading: false,
      post: null,
      error: null,

      annotationList: [],
    };
  },
  async created() {
    await this.fetchStage();
    await this.fetchMemes();
  },
  watch: {
    currentPage: async function () {
      await this.fetchMemes();
    },
  },
  methods: {
    async fetchMemes() {
      this.error = this.annotationList = null;
      this.loading = true;

      const offset = (this.currentPage - 1) * this.limit;
      const stageId = this.$route.params.stageId;

      const res = await axios
        .get(
          `${Settings.PROTOCOL}://${Settings.HOST}:${Settings.PORT}/api/memes/explanations?offset=${offset}&limit=${this.limit}&stage=${stageId}`,
          {
            headers: {
              "x-access-token": auth.getToken(),
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });

      console.log(res)
      this.loading = false;
      this.annotationList = res.data;
    },
    async fetchStage() {
      this.error = this.stage = null;
      this.loading = true;

      const stageId = this.$route.params.stageId;

      const res = await axios
        .get(
          `${Settings.PROTOCOL}://${Settings.HOST}:${Settings.PORT}/api/memes/stage?stage=${stageId}`,
          {
            headers: {
              "x-access-token": auth.getToken(),
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });

      this.loading = false;
      this.stage = res.data.name;
      this.currCount = res.data.currentCount;
      this.totalCount = res.data.totalCount;
    },
    async handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      const body = new URLSearchParams({
        category: this.createCategory,
        subcategory: this.createSubcategory,
      });

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token": auth.getToken(),
        },
      };

      const res = await axios
        .post(
          `${Settings.PROTOCOL}://${Settings.HOST}:${Settings.PORT}/api/memes/category`,
          body.toString(),
          config
        )
        .catch((error) => {
          console.log(error);
        });

      console.log(res);

      if (res.status == 200) {
        this.modalCallback(
          `[${this.createCategory}] ${this.createSubcategory}`
        );
      }

      // Push the name to submitted names
      // this.submittedNames.push(this.name);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("creation-modal");
      });
    },
    checkFormValidity() {
      const categoryValid = this.createCategory != null;
      const subcategoryValid = this.$refs.form.checkValidity();
      this.createSubcategoryState = subcategoryValid;

      return subcategoryValid && categoryValid;
    },
    onSaveClick() {
      this.currCount += 1;
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