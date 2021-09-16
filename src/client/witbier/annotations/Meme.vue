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
          <b-form-select
            id="sb-locales"
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

      <div class="mt-2" style="text-align: center">
        <b-button variant="primary" @click="onSaveButton()"
          >Save {{ saveTime }}
        </b-button>
      </div>
    </b-card>

    <b-modal
      id="creation-modal"
      ref="modal"
      title="Create New Subcategory"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <label for="sb-locales">Category</label>
        <b-form-select
          id="sb-locales"
          v-model="createCategory"
          :options="availableCategories"
        ></b-form-select>
        <div v-if="!createCategoryState" tabindex="-1" role="alert" aria-live="assertive" aria-atomic="true" class="d-block invalid-feedback" id="__BVID__41__BV_feedback_invalid_">category is required</div>

        <b-form-group
          class="mt-2"
          label="Subcategory"
          label-for="subcategory-input"
          invalid-feedback="subcategory is required"
          :state="createSubcategoryState"
        >
          <b-form-input
            id="subcategory-input"
            v-model="createSubcategory"
            :state="createSubcategoryState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
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
      currentCategory: null,
      searchDesc: "",

      createCategory: null,
      createSubcategory: "",
      createCategoryState: null,
      createSubcategoryState: null,

      availableOptions: [],
      availableCategories: [
        { value: null, text: "None" },
        { value: "Gender", text: "Gender" },
        { value: "Race", text: "Race" },
        { value: "Religion", text: "Religion" },
        { value: "Nationality", text: "Nationality" },
        { value: "Disability", text: "Disability" },
      ],

      labels: this.annotation.labels,
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
      if (this.createdAt != this.updatedAt) {
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
      if (criteria || category) {
        const res = await axios.get(
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/categories?category=${category}&search=${criteria}`,
          {
            headers: { "x-access-token": auth.getToken() },
          }
        );

        var options = res.data;

        if (criteria)
          options.push(`Create new label: ${criteria}`);

        this.availableOptions = options;
      } else {
        // Show all options available
        this.availableOptions = [];
      }
    },
    addTag(option) {
      if (option.includes("Create new label")) {
        this.createSubcategory = option.replace("Create new label: ", "");
        this.showModal();
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
    showModal() {
      this.$bvModal.show("creation-modal");
    },
    checkFormValidity() {
      const categoryValid = this.createCategory != null
      const subcategoryValid = this.$refs.form.checkValidity();
      this.createSubcategoryState = subcategoryValid;

      console.log(categoryValid);
      console.log(subcategoryValid);
      return subcategoryValid && categoryValid;
    },
    resetModal() {
      this.createCategory = null;
      this.createCategoryState = null,

      this.createSubcategory = "";
      this.createSubcategoryState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
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
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/category`,
          body.toString(),
          config
        )
        .catch((error) => {
          console.log(error);
        });

      if (res) {
        this.addTag(`[${this.createCategory}] ${this.createSubcategory}`)
      }

      // Push the name to submitted names
      // this.submittedNames.push(this.name);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("creation-modal");
      });
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
