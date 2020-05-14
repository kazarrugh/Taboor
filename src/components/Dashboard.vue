<template>
  <b-container class="container" :dir="dir">
    <div v-if="renderComponent" />
    <div v-for="(type, index) in servicetypes" v-bind:key="index">
      <b-alert show variant="dark"
        ><h4 class="servicetype-title">{{ type }}</h4></b-alert
      >
      <br />
      <!-- <div
        style="width: 100px; 
    height: 100px; 
     background-image: url(https://firebasestorage.googleapis.com/v0/b/taboor-ly.appspot.com/o/Logos%2FUTMFtoyzEHXJVPGHHZankJ8gOGS2_200x200.jpg?alt=media&token=36f16637-9682-4a70-8c16-e231e881d123);"
      /> -->
      <VueSlickCarousel v-bind="carousel">
        <div v-for="pro in providerbycat(type)" v-bind:key="pro.id">
          <b-card
            :header="pro.displayName"
            :footer="'Tel :' + pro.phoneNumber"
            style="max-width: 20rem;"
            inline-block
            @click="viewprovider(pro.id)"
          >
            <!-- <b-card-img
              style="padding:0px;vertical-align: middle;"
              :src="pro.logo"
            /> -->
            <!-- <div :style='background-image: url('+pro.logo+');"></div> -->
            <div
              class="customimg"
              :style="'background-image: url(' + pro.logo + ');'"
            ></div>
          </b-card>
        </div>
      </VueSlickCarousel>
      <br /><br />
    </div>
  </b-container>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

export default {
  name: "Dashboard",
  props: ["dir", "tr", "ur"],
  data() {
    return {
      providers: {},
      renderComponent: true,
      servicetypes: [],
      carousel: {
        arrows: false,
        dots: true,
        // rtl: true,
        focusOnSelect: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2500,
        slidesToShow: 4,
        slidesToScroll: 1,
        lazyLoad: "progressive",
        swipeToSlide: true,
        draggable: true,
        touchMove: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              touchThreshold: 3,
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      },
    };
  },
  components: { VueSlickCarousel },
  computed: {
    providerbycat() {
      return (type) =>
        Object.values(this.providers).filter((m) => m.servicetype === type);
      //return Object.values(this.providers);
    },
  },
  methods: {
    viewprovider(key) {
      //console.log(key);
      this.$router.push({ path: "Provider", query: { key: key } });
    },
  },
  created() {
    /*
    db.collection("users")
      .orderBy("servicetype")
      .startAfter(null)
      //   .select("servicetype")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(`${doc.id} => ${doc.data()}`);
          this.servicetypes.push(doc.data());
        });
      });
*/

    db.collection("users")
      .orderBy("servicetype")
      .onSnapshot((querySnapshot) => {
        this.renderComponent = false;

        querySnapshot.forEach((doc) => {
          //this.servicetypes.push(doc.data(), doc.id);
          this.providers[doc.id] = doc.data();
          this.providers[doc.id].id = doc.id;

          //Get all the service types
          if (
            doc.data().servicetype != null &&
            !this.servicetypes.includes(doc.data().servicetype)
          ) {
            this.servicetypes.push(doc.data().servicetype);
          }
        });

        this.$nextTick(() => {
          // Add the component back in
          this.renderComponent = true;
        });
      });

    /*
       db.collection("servicetypes")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(`${doc.id} => ${doc.data()}`);
          this.servicetypes.push(doc.data().servicetype);
        });
      });
      */
  },
};
</script>

<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
.servicetype-title {
  margin: 0px;
}
.slick-prev,
.slick-next {
  color: black;
}
.slick-arrow {
  color: black !important;
}
.custom-arrow {
  color: black;
}
.slick-prev:before,
.slick-next:before {
  color: black;
}
.slick-slider {
  touch-action: auto;
  -ms-touch-action: auto;
}
.card {
  cursor: pointer;
}
.card-header {
  font-size: 18px;
}
.card-body {
  padding: 0px;
  min-height: 200px;
  max-height: 200px;
  position: relative;
}
.card-footer {
  direction: ltr;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.customimg {
  width: 200px; /* image width */
  height: 200px; /* image height */
  margin: auto;
  padding: 0px;

  background-repeat: no-repeat;
  background-position: center;
}
</style>
