<template>
  <div>
    <b-container :dir="dir">
      <b-row>
        <b-col style="display: flex;" v-if="this.provider.displayName">
          <div class="providerinfo">{{ this.provider.displayName }}</div>
        </b-col>
        <b-col v-if="this.provider.logo">
          <b-img-lazy :src="this.provider.logo" :width="size" />
        </b-col>
      </b-row>

      <hr />
      <b-row>
        <b-col style="display: flex;" v-if="this.provider.phoneNumber">
          <div class="providercontact">
            <a :href="'tel:' + this.provider.phoneNumber">
              {{ this.provider.phoneNumber }}
            </a>
          </div>
        </b-col>
        <b-col
          style="display: flex;"
          v-if="this.provider.opentime && this.provider.closetime"
        >
          <div class="providercontact">
            {{ this.provider.opentime }} - {{ this.provider.closetime }}
          </div>
        </b-col>
      </b-row>
      <hr />
    </b-container>
  </div>
</template>

<script>
export default {
  name: "ProviderContact",
  props: ["ur", "dir", "td"],
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
  direction: ltr;
}
</style>
