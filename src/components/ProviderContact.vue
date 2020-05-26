<template>
  <div :dir="dir">
    <!-- <b-container > -->
    <b-row>
      <b-col style="display: flex;" v-if="this.provider.displayName">
        <div class="providerinfo">
          <!-- {{ this.provider.displayName }} -->
          <span
            v-if="provider.displayNameLang && provider.displayNameLang[lang]"
          >
            {{ provider.displayNameLang[lang] }}
          </span>
          <span v-else>
            {{ provider.displayName }}
          </span>
        </div>
      </b-col>
      <b-col v-if="this.provider.logo">
        <b-img-lazy :src="this.provider.logo" :width="size" />
      </b-col>
    </b-row>

    <hr />
    <b-row>
      <b-col style="display: flex;" v-if="this.provider.phoneNumber">
        <div class="providercontact">
          <a :href="'tel:' + this.provider.formattedNumber">
            {{ this.provider.phoneNumber }}
          </a>
        </div>
      </b-col>
      <b-col
        style="display: flex;"
        v-if="this.provider.opentime && this.provider.closetime"
      >
        <div class="providercontact">
          {{ [this.provider.opentime, "HH:mm:ss"] | moment("hh:mm a") }} -
          {{ [this.provider.closetime, "HH:mm:ss"] | moment("hh:mm a") }}
        </div>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col v-if="this.provider.avgRating">
        <!-- <label for="rating-readonly">Readonly rating</label> -->
        <b-form-rating
          :value="this.provider.avgRating"
          readonly
          show-value
          precision="1"
        ></b-form-rating>
      </b-col>
    </b-row>
    <!-- </b-container> -->
  </div>
</template>

<script>
export default {
  name: "ProviderContact",
  props: ["ur", "dir", "ta", "lang"],
  data() {
    return {};
  },
  computed: {
    provider() {
      return this.ur;
    },
    size() {
      if (window.innerWidth < 600) return window.innerWidth * 0.25;
      else return window.innerWidth * 0.1;
    },
  },
  methods: {},
  beforeCreate() {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
.providerinfo {
  margin: auto;
  vertical-align: middle;
  font-size: 1.5em;
}
.providercontact {
  margin: auto;
  vertical-align: middle;
  font-size: 1em;
}

@media only screen and (max-width: 400px) {
  .providercontact {
    font-size: 0.9em;
  }
}
</style>
