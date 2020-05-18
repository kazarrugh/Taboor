<template>
  <b-container class="container" :dir="dir">
    <div class="margin-bottom">
      <b-button
        block
        variant="outline-dark"
        @click="geolocate"
        v-if="mylocation == null"
        size="lg"
      >
        البحث في نطاق قريب
      </b-button>
      <b-button-group style="width:100%" v-if="mylocation != null">
        <b-button @click="distance = 100" variant="outline-dark"
          >100 متر</b-button
        >
        <b-button @click="distance = 200" variant="outline-dark"
          >200 متر</b-button
        >
        <b-button @click="distance = 300" variant="outline-dark"
          >300 متر</b-button
        >
      </b-button-group>
    </div>
    <b-overlay :show="loading" rounded="sm">
      <div v-for="(type, index) in uniqueservicetypes" v-bind:key="index">
        <b-alert show variant="dark" class="margin-bottom">
          <h4 class="servicetype-title">{{ type }}</h4>
        </b-alert>

        <VueSlickCarousel v-bind="carousel" class="margin-bottom">
          <!-- <h2>1</h2>
          <h2>2</h2>
          <h2>3</h2>
          <h2>4</h2> -->
          <div v-for="pro in providerbycat(type)" v-bind:key="pro.id">
            <b-card :header="pro.displayName" @click="viewprovider(pro.id)">
              <b-list-group flush>
                <b-list-group-item>
                  <div
                    class="customimg"
                    :style="'background-image: url(' + pro.logo + ');'"
                  ></div>
                </b-list-group-item>
              </b-list-group>
              <a :href="'tel:' + pro.phoneNumber">
                <b-card-footer>{{ pro.phoneNumber }}</b-card-footer>
              </a>
            </b-card>
          </div>
          <!-- In Case the array is empty, give empty div for slick -->
          <div v-if="providerbycat(type).length == 0" />
          <template #prevArrow="arrowOption">
            <div class="custom-arrow">
              {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }}
            </div>
          </template>
          <template #nextArrow="arrowOption">
            <div class="custom-arrow">
              {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }}
            </div>
          </template>
        </VueSlickCarousel>
      </div>
    </b-overlay>
  </b-container>
</template>

<script>
//import firebase from "../firebaseConfig.js";
// const db = firebase.firestore();

import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

export default {
  name: "Dashboard",
  props: ["dir", "ta", "ur", "providers"],
  data() {
    return {
      loading: false,
      mylocation: null,
      distance: 1000,
      carousel: {
        arrows: true,
        dots: true,
        // rtl: true,
        focusOnSelect: false,
        infinite: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 4000,
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
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              touchThreshold: 3,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    };
  },
  components: { VueSlickCarousel },
  computed: {
    providerbycat() {
      return type =>
        // Object.values(this.providers).filter(m => m.servicetype === type);
        this.providerbygeopoint.filter(m => m.servicetype === type);
    },
    providerbygeopoint() {
      var filtered = Object.values(this.providers).filter(
        m => m.displayName !== null
      );
      filtered = filtered.filter(m => m.logo !== null);
      filtered = filtered.filter(m => m.phoneNumber !== null);

      if (
        this.mylocation != null &&
        this.providers[
          Object.keys(this.providers)[Object.keys(this.providers).length - 1]
        ].distance &&
        this.distance != null
      ) {
        return filtered.filter(m => m.distance <= this.distance);
      } else {
        return filtered;
      }
    },
    uniqueservicetypes() {
      const servicetypes = this.providerbygeopoint.map(a => a.servicetype);
      return [...new Set(servicetypes)];
    }
  },
  watch: {},
  methods: {
    viewprovider(key) {
      this.$router.push({ path: "Provider", query: { key: key } });
    },

    geolocate() {
      this.loading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.mylocation = {
            Pc: position.coords.latitude,
            Vc: position.coords.longitude
          };
          this.$emit("getdistance", this.mylocation);
          this.loading = false;
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  },
  created() {}
};
</script>

<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
.margin-bottom {
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
  margin: 5px;
}
.card-header {
  font-size: 18px;
}
.card-body {
  padding: 0px;
  min-height: 200px;
  /* max-height: 200px; */
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
.list-group-item {
  padding: 0px;
}
</style>
