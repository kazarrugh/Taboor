<template>
  <b-container
    fluid
    style="height:100vh;min-height:100vh;background-color: #2c3e50;"
  >
    <div class="divcenter">
      <img src="../assets/logo.svg" class="loadinglogo" />
      <h1 class="loadingtext" style="color:white;">Taboor</h1>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["ur", "dir", "ta"],
  data() {
    return {};
  },
  computed: {},
  methods: {},
  beforeCreate() {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
.loadinglogo {
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: 100px;
  position: static;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  float: left;
}
.loadingtext {
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: 200px;
  position: static;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  float: right;
  padding-top: 10%;
}

@media only screen and (max-width: 400px) {
  .divcenter {
    width: 80%;
    height: 200px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
@media only screen and (min-width: 400px) and (max-width: 600px) {
  .divcenter {
    width: 70%;
    height: 200px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
@media only screen and (min-width: 600px) and (max-width: 800px) {
  .divcenter {
    width: 40%;
    height: 200px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
@media only screen and (min-width: 800px) and (max-width: 1200px) {
  .divcenter {
    width: 30%;
    height: 200px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
@media only screen and (min-width: 1200px) {
  .divcenter {
    width: 20%;
    height: 200px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
