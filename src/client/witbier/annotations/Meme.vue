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

      <b-input-group class="mb-2">
        <template #prepend>
          <b-dropdown text="All" variant="success">
            <b-dropdown-item>All</b-dropdown-item>
            <b-dropdown-item>Gender</b-dropdown-item>
            <b-dropdown-item>Race</b-dropdown-item>
            <b-dropdown-item>Religion</b-dropdown-item>
            <b-dropdown-item>Nationality</b-dropdown-item>
            <b-dropdown-item>Disability</b-dropdown-item>
          </b-dropdown>
        </template>
        <b-form-input
          v-model="search"
          id="tag-search-input"
          type="search"
          autocomplete="off"
        ></b-form-input>
      </b-input-group>

      <b-dropdown-item-button
        v-for="option in availableOptions"
        :key="option"
        @click="onOptionClick({ option, addTag })"
      >
        {{ option }}
      </b-dropdown-item-button>
      <div style="text-align: center">
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
      searchDesc: "",
      availableOptions: [],

      labels: this.annotation.labels,
      createdAt: moment(this.annotation.createdAt).tz('Asia/Singapore'),
      updatedAt: moment(this.annotation.updatedAt).tz('Asia/Singapore'),
    };
  },
  watch: {
    search: async function (val, oldVal) {
      const criteria = val.trim().toLowerCase();

      if (criteria) {
        const res = await axios.get(
          `http://${Settings.HOST}:${Settings.PORT}/api/memes/categories?search=${criteria}`,
          {
            headers: {
              "x-access-token":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjMxNjA5MzU0LCJleHAiOjE2MzE2OTU3NTR9.k6pE6n8OfReqIXIfE4Zu301as9X6V6d2r6DbfMypr-E",
            },
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
  },
  computed: {
    saveTime: function () {
      if (this.createdAt != this.updatedAt) {
        console.log(this.updatedAt)
        console.log(moment())
        if (this.updatedAt.isSame(moment(), "day")) {
          return `(${this.updatedAt.startOf("day").fromNow()})`;
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

      console.log(body)

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
        this.updatedAt = moment().tz('Asia/Singapore')
      }
    },
    addTag(option) {
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
