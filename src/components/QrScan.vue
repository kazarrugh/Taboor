<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-row align-v="center" align-h="center">
        <b-col cols="12" md="8">
          <qrcode-stream @decode="onDecode"></qrcode-stream>
        </b-col>
      </b-row>

      <h4 class="container">
        {{ $t("text.usecamera") }}
      </h4>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "QrScan",
  props: ["ur", "dir", "ta"],
  data() {
    return {};
  },
  computed: {},
  methods: {
    onDecode(decodedString) {
      //console.log(decodedString);
      window.location.href = decodedString;
    },
  },
  beforeCreate() {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>
