<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-row align-v="center" align-h="center">
        <b-col cols="12" md="8">
          <qrcode-stream @decode="onDecode"></qrcode-stream>
        </b-col>
      </b-row>

      <h3>SCAN THE QR CODE</h3>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "QrScan",
  props: ["ur", "dir", "td"],
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

<style scoped></style>
