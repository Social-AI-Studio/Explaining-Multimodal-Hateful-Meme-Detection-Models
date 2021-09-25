<template>
  <div class="annotation">
    <b-card :img-src="imagepath" img-top tag="article" class="mb-2">
      <p style="margin: 0; padding: 0">
        <b>Best Guess Labels:</b> <br />
        {{ annotation.Meme.best_guess_labels }}
      </p>
      <br />

      <p style="margin: 0; padding: 0"><b>Entities Detected:</b></p>
      <ul>
        <li v-for="entity in annotation.Meme.entities" :key="entity">{{entity}}</li>
      </ul>

      <p style="margin: 0; padding: 0"><b>Protected Category:</b></p>
      <ul
        v-if="protected_pc.length > 0"
        class="list-inline d-inline-block mb-2"
      >
        <li
          v-for="label in protected_pc"
          :key="label"
          class="list-inline-item"
        >
          <b-form-tag :title="label" variant="light">{{ label }}</b-form-tag>
        </li>
      </ul>

      <p style="margin: 0; padding: 0"><b>Automated Labels:</b></p>
      <ul
        v-if="annotation.Meme.automated_labels.length > 0"
        class="list-inline d-inline-block mb-2"
      >
        <li
          v-for="label in annotation.Meme.automated_labels"
          :key="label"
          class="list-inline-item"
        >
          <b-form-tag :title="label" variant="light">{{ label }}</b-form-tag>
        </li>
      </ul>

      <p style="margin: 0; padding: 0"><b>Annotator Labels:</b></p>
      <ul v-if="labels.length > 0" class="list-inline d-inline-block mb-2">
        <li v-for="label in labels" :key="label" class="list-inline-item">
          <b-form-tag
            @remove="removeTag(label)"
            :title="label"
            variant="info"
            >{{ label }}</b-form-tag
          >
        </li>
      </ul>

      <b-input-group>
        <template #prepend>
          <b-form-select
            id="category-select"
            v-model="currentCategory"
            :options="availableCategories"
          ></b-form-select>
        </template>
        <b-form-input
          v-model="search"
          id="tag-search-input"
          type="search"
          autocomplete="off"
        ></b-form-input>
      </b-input-group>

      <div
        v-if="availableOptions.length > 0"
        style="border: 1px solid rgba(0, 0, 0, 0.125)"
      >
        <b-dropdown-item-button
          v-for="option in availableOptions"
          :key="option"
          style="list-style: none"
          @click="onOptionClick({ option, addTag })"
        >
          {{ option }}
        </b-dropdown-item-button>
      </div>

      <p style="padding: 0; margin-top: 0.5rem; margin-bottom: 0">
        <b>Hateful Components:</b>
      </p>

      <b-form-select
        id="component-select"
        v-model="components"
        :options="availableComponents"
      ></b-form-select>

      <div
        v-if="components == null"
        tabindex="-1"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        class="d-block invalid-feedback"
        id="__BVID__41__BV_feedback_invalid_"
      >
        component is required
      </div>

      <div class="mt-2" style="text-align: center">
        <b-button variant="info" v-if="saveTime != '(Unsaved)'" @click="onSaveButton()"
          >Save {{ saveTime }}
        </b-button>
        <b-button variant="warning" v-if="saveTime == '(Unsaved)'" @click="onSaveButton()"
          >Save {{ saveTime }}
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import { Settings } from "../config/api.config";
import axios from "axios";
import moment from "moment-timezone";
import auth from "../authentication/auth";

export default {
  name: "meme",
  props: [
    "annotation",
    "availableCategories"
  ],
  data() {
    return {
      imagepath: `http://${Settings.HOST}:${Settings.PORT}/${this.annotation.Meme.image}`,
      protected_pc: this.annotation.Meme.gold_pc.split(','),

      error: null,
      search: "",
      category: "All",

      currentSearch: "",
      currentCategory: null,
      searchDesc: "",

      availableOptions: [],
      availableComponents: [
        { value: null, text: "Choose an option" },
        { value: "None", text: "Neither Components" },
        { value: "Text", text: "Text Component" },
        { value: "Image", text: "Image Components" },
        { value: "Text + Image", text: "Both Components" },
      ],

      labels: this.annotation.labels,
      components: this.annotation.components,
      createdAt: moment(this.annotation.createdAt).tz("Asia/Singapore"),
      updatedAt: moment(this.annotation.updatedAt).tz("Asia/Singapore"),
    };
  },
  watch: {
    search: async function (val, oldVal) {
      this.currentSearch = val.trim().toLowerCase();
      this.getAvailableOptions(this.currentCategory, this.currentSearch);
    },
    currentCategory: async function (val, oldVal) {
      this.getAvailableOptions(this.currentCategory, this.currentSearch);
    },
  },
  computed: {
    saveTime: function () {
      if (!this.createdAt.isSame(this.updatedAt)) {
        var currentTime = moment();
        if (this.updatedAt.isSame(currentTime, "day")) {
          var duration = moment.duration(currentTime.diff(this.updatedAt));
          var hours = Math.floor(duration.asHours(), 0);

          if (hours >= 1) return `(${hours} hours ago)`;
          else var minutes = Math.floor(duration.asMinutes(), 0);
          return `(${minutes} minutes ago)`;
        } else {
          return `(${this.updatedAt.format("DD/MM h:mm:ss A")})`;
        }
      }

      return "(Unsaved)";
    },
  },
  methods: {
    onOptionClick({ option, addTag }) {
      addTag(option);
      this.search = "";
    },
    async onSaveButton() {
      if (this.components == null) return;

      const body = new URLSearchParams({
        memeId: this.annotation.id,
        labels: this.labels.join(","),
        components: this.components,
      });

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token": auth.getToken(),
        },
      };

      const res = await axios
        .post(
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/annotation`,
          body.toString(),
          config
        )
        .catch((error) => {
          console.log(error);
        });

      if (res) {
        this.updatedAt = moment().tz("Asia/Singapore");
      }
    },
    async getAvailableOptions(category, criteria) {
      if (criteria || category) {
        const res = await axios.get(
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/categories?category=${category}&search=${criteria}`,
          {
            headers: { "x-access-token": auth.getToken() },
          }
        );

        var options = res.data;

        if (criteria) options.push(`Create new label: ${criteria}`);

        this.availableOptions = options;
      } else {
        // Show all options available
        this.availableOptions = [];
      }
    },
    addTag(option) {
      if (option.includes("Create new label")) {
        this.showModal(option.replace("Create new label: ", ""));
        return;
      }

      this.currentCategory = null;

      // Check for duplicates
      if (!this.labels.includes(option)) {
        this.labels.push(option);
      }
    },
    removeTag(option) {
      const index = this.labels.indexOf(option);
      this.labels.splice(index, 1);
    },
    showModal(subcategory) {
      this.$emit("onDialogClick", subcategory, this.addTag)
    },
  },
};
</script>

<style>
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
