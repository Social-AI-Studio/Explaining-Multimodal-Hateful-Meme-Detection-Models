<template>
  <div class="annotation">
    <b-card :img-src="annotation.meme.image" img-top tag="article" class="mb-2">
      <p style="margin: 0; padding: 0">
        <b
          >Add. Information <br />
          (Obtained via Google Vision API)</b
        >
      </p>

      <p style="margin: 0; padding: 0">
        <i>best guess label: </i>{{ annotation.meme.best_guess_labels }}
      </p>
      <br />

      <p><i>entities: </i>{{ annotation.meme.entities }}</p>

      <p style="margin: 0; padding: 0"><b>Computer Labels:</b></p>
      <ul
        v-if="annotation.computer_labels.length > 0"
        class="list-inline d-inline-block mb-2"
      >
        <li
          v-for="label in annotation.computer_labels"
          :key="label"
          class="list-inline-item"
        >
          <b-form-tag :title="label" variant="info">{{ label }}</b-form-tag>
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
          <b-dropdown text="All" variant="success">
            <b-dropdown-item
              v-for="category in availableCategories"
              :key="category"
              @click="onCategoryClick({ category })"
            >
              {{ category }}
            </b-dropdown-item>
          </b-dropdown>
        </template>
        <b-form-input
          v-model="search"
          id="tag-search-input"
          type="search"
          autocomplete="off"
        ></b-form-input>
      </b-input-group>

      <div v-if="availableOptions.length > 0" style="border: 1px solid rgba(0, 0, 0, 0.125);">
        <b-dropdown-item-button
          v-for="option in availableOptions"
          :key="option"
          style="list-style:none;"
          @click="onOptionClick({ option, addTag })"
        >
          {{ option }}
        </b-dropdown-item-button>
      </div>

      <div class="mt-2" style="text-align: center">
        <b-button variant="primary" @click="onSaveButton()"
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
  props: ["annotation"],
  data() {
    return {
      error: null,
      tags: [],

      options: [
        "[Gender] Male",
        "[Gender] Female",
        "[Gender] LGBT",
        "[Race] Black",
        "[Race] White",
        "[Race] Middle East",
        "[Race] Hispanic/Latino",
        "[Race] Asia (East Asia + South East Asia)",
        "[Religion] Muslim",
        "[Religion] Jews",
        "[Religion] Catholic Christian",
        "[Religion] Christian",
        "[Nationality] Mexican",
        "[Disability] Down Syndrome",
        "[Disability] Intellectual Disability",
        "[Disability] Autism",
        "[Disability] Dwarfism",
      ],
      search: "",
      category: "All",

      currentSearch: "",
      currentCategory: "All",
      searchDesc: "",
      
      availableOptions: [],
      availableCategories: ["All", "Gender", "Race", "Religion", "Nationality", "Disability"],

      labels: this.annotation.labels,
      createdAt: moment(this.annotation.createdAt).tz("Asia/Singapore"),
      updatedAt: moment(this.annotation.updatedAt).tz("Asia/Singapore"),
    };
  },
  watch: {
    search: async function (val, oldVal) {
      this.currentSearch = val.trim().toLowerCase();
      this.getAvailableOptions(this.currentCategory, this.currentSearch)
    },
    category: async function (val, oldVal) {
      this.currentCategory = val.category;
      this.getAvailableOptions(this.currentCategory, this.currentSearch)
    }
  },
  computed: {
    saveTime: function () {
      if (this.createdAt != this.updatedAt) {
        var currentTime = moment()
        if (this.updatedAt.isSame(currentTime, "day")) {
          var duration = moment.duration(currentTime.diff(this.updatedAt));
          var hours = Math.floor(duration.asHours(), 0);

          if (hours >= 1)
            return `(${hours} hours ago)`;
          else
            var minutes = Math.floor(duration.asMinutes(), 0)
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
    onCategoryClick(category) {
      this.category = category;
    },
    async onSaveButton() {
      const body = new URLSearchParams({
        memeId: this.annotation.id,
        labels: this.labels.join(","),
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
      if (criteria || category != 'All') {
        const res = await axios.get(
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/categories?category=${category}&search=${criteria}`,
          {
            headers: { "x-access-token": auth.getToken() },
          }
        );

        var options = res.data;
        options.push(`Create new label: ${criteria}`);
        this.availableOptions = options;
      } else {
        // Show all options available
        this.availableOptions = [];
      }
    },
    addTag(option) {
      this.category = "All";
      if (!this.labels.includes(option)) {
        this.labels.push(option);
      }
    },
    removeTag(option) {
      const index = this.labels.indexOf(option);
      this.labels.splice(index, 1);
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
