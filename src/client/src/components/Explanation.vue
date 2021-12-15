<template>
  <div class="annotation p-1">
    <b-card :img-src="imagepath" img-top tag="article">
      <p style="margin: 0; padding: 0">
        <b>Best Guess Labels:</b> <br />
        {{ annotation.Meme.best_guess_labels }}
      </p>
      <br />

      <p style="margin: 0; padding: 0"><b>Entities Detected:</b></p>
      <ul>
        <li v-for="entity in annotation.Meme.entities" :key="entity">
          {{ entity }}
        </li>
      </ul>

      <p style="margin: 0; padding: 0"><b>Protected Category:</b></p>
      <ul
        v-if="protected_pc.length > 0"
        class="list-inline d-inline-block mb-2"
      >
        <li v-for="label in protected_pc" :key="label" class="list-inline-item">
          <b-form-tag :title="label" variant="light">{{ label }}</b-form-tag>
        </li>
      </ul>

      <p style="margin: 0; padding: 0"><b>Fine-Grain Labels:</b></p>
      <ul
        v-if="annotation.Meme.final_labels.length > 0"
        class="list-inline d-inline-block mb-2"
      >
        <li
          v-for="label in annotation.Meme.final_labels"
          :key="label"
          class="list-inline-item"
        >
          <b-form-tag :title="label" variant="light">{{ label }}</b-form-tag>
        </li>
      </ul>

      <p class="mt-4 mb-1 p-0"><b>Reasoning:</b></p>
      <b-input-group>
        <b-form-input
          v-model="reasoning"
          id="reasoning-input"
          autocomplete="off"
        ></b-form-input>
      </b-input-group>
      <p v-if="reasoningError" class="error mt-0 pt-0">Do not leave your reasonings blank!</p>

      <div class="mt-2" style="text-align: center">
        <b-button
          variant="info"
          v-if="saveTime != '(Unsaved)'"
          @click="onSaveButton()"
          >Save {{ saveTime }}
        </b-button>
        <b-button
          variant="warning"
          v-if="saveTime == '(Unsaved)'"
          @click="onSaveButton()"
          >Save {{ saveTime }}
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import { Settings } from "../config/api.config";
import auth from "../utils/auth";
import axios from "axios";
import moment from "moment-timezone";

export default {
  name: "explanation",
  props: ["annotation"],
  data() {
    return {
      imagepath: `${Settings.PROTOCOL}://${Settings.HOST}:${Settings.PORT}/${this.annotation.Meme.image}`,
      protected_pc: this.annotation.Meme.gold_pc.split(","),

      createdAt: moment(this.annotation.createdAt).tz("Asia/Singapore"),
      updatedAt: moment(this.annotation.updatedAt).tz("Asia/Singapore"),

      reasoning: this.annotation.reasoning,
      reasoningError: false
    };
  },
  computed: {
    saveTime: function () {
      if (this.reasoning != null && !this.createdAt.isSame(this.updatedAt)) {
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
      if (this.reasoning === "") {
        this.reasoningError = true;
        return null
      } else {
        this.reasoningError = false;
      }

      const body = new URLSearchParams({
        memeId: this.annotation.id,
        reasoning: this.reasoning,
        remarks: this.remarks
      });

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token": auth.getToken(),
        },
      };

      const res = await axios
        .post(
          `${Settings.PROTOCOL}://${Settings.HOST}:${Settings.PORT}/api/memes/explanation`,
          body.toString(),
          config
        )
        .catch((error) => {
          console.log(error);
        });

      if (res) {
        this.updatedAt = moment().tz("Asia/Singapore");
      }

      this.$emit("onSaveClick");
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


<style>
.error {
  color: red;
}
</style>
