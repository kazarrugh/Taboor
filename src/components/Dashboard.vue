<template>
  <b-container class="cont" :dir="dir">
    <div>
      <b-button
        block
        variant="outline-dark"
        @click="geolocate"
        v-if="mylocation == null"
        size="lg"
      >
        {{ $t("buttons.near") }}
      </b-button>
      <b-button-group style="width:100%" v-if="mylocation != null">
        <b-button @click="distance = 100" variant="outline-dark">
          {{ $t("buttons.metres", { value: "100" }) }}
        </b-button>
        <b-button @click="distance = 200" variant="outline-dark">
          {{ $t("buttons.metres", { value: "200" }) }}
        </b-button>
        <b-button @click="distance = 300" variant="outline-dark">
          {{ $t("buttons.metres", { value: "300" }) }}
        </b-button>
      </b-button-group>
    </div>
    <b-overlay :show="loading" rounded="sm">
      <div v-for="(type, index) in uniqueservicetypes" v-bind:key="index">
        <b-alert show variant="dark" class="cont">
          <h4 class="servicetype-title">{{ type }}</h4>
        </b-alert>

        <VueSlickCarousel v-bind="carousel" class="cont">
          <!-- <h2>1</h2>
          <h2>2</h2>
          <h2>3</h2>
          <h2>4</h2> -->
          <div v-for="pro in providerbycat(type)" v-bind:key="pro.id">
            <b-card>
              <b-card-header @click="viewprovider(pro.id)">
                <b-icon-house-door-fill v-if="pro.opennow == true" />
                <b-icon-house-fill v-if="pro.opennow == false" />
                <span v-if="pro.displayNameLang && pro.displayNameLang[lang]">
                  {{ pro.displayNameLang[lang] }}
                </span>
                <span v-else>
                  {{ pro.displayName }}
                </span>
              </b-card-header>
              <b-list-group flush>
                <b-list-group-item @click="viewprovider(pro.id)">
                  <div
                    class="customimg"
                    :style="'background-image: url(' + pro.logo + ');'"
                  ></div>
                </b-list-group-item>
              </b-list-group>

              <b-card-footer>
                <b-row>
                  <b-col v-if="pro.phoneNumber">
                    <a :href="'tel:' + pro.phoneNumber">
                      <b-icon-phone />
                      {{ pro.phoneNumber }}
                    </a>
                  </b-col>
                  <b-col cols="5" v-if="pro.coordinates">
                    <a
                      target="_blank"
                      :href="
                        'http://www.google.com/maps/place/' +
                          pro.coordinates.Pc +
                          ',' +
                          pro.coordinates.Vc
                      "
                      v-if="pro.coordinates"
                    >
                      <b-icon-geo-alt to="maps.google.com" />
                      {{ $t("buttons.map") }}
                    </a>
                  </b-col>
                </b-row>
              </b-card-footer>
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
      <!-- <div dir="ltr">{{ this.time }}</div> -->
      <Adsense
        data-ad-client="ca-pub-8323299523569993"
        ata-ad-slot="1234567890"
      >
      </Adsense>
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
  props: ["dir", "ta", "ur", "providers", "time", "lang"],
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
              arrows: false,
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
        // Object.values(this.providers).filter(m => m.servicetype === type);
        this.providerbygeopoint.filter(
          (m) => m.servicetype[this.lang] === type
        );
    },
    providerbygeopoint() {
      var filtered = Object.values(this.providers).filter(
        (m) => m.displayName !== null
      );
      filtered = filtered.filter((m) => m.logo !== null);
      filtered = filtered.filter((m) => m.phoneNumber !== null);
      filtered = filtered.filter((m) => m.active === true);

      if (
        this.mylocation != null &&
        this.providers[
          Object.keys(this.providers)[Object.keys(this.providers).length - 1]
        ].distance &&
        this.distance != null
      ) {
        return filtered.filter((m) => m.distance <= this.distance);
      } else {
        return filtered;
      }
    },
    uniqueservicetypes() {
      const servicetypes = this.providerbygeopoint.map(
        (a) => a.servicetype[this.lang]
      );
      return [...new Set(servicetypes)];
    },
  },
  watch: {},
  methods: {
    viewprovider(key) {
      this.$router.push({ path: "Provider", query: { key: key } });
    },

    geolocate() {
      this.loading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.mylocation = {
            Pc: position.coords.latitude,
            Vc: position.coords.longitude,
          };
          this.$emit("getdistance", this.mylocation);
          this.loading = false;
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
  },
  created() {},
};
</script>

<style scoped>
.cont {
  margin-top: 30px;
  margin-bottom: 30px;
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
  margin: 5px;
}
.card-header {
  cursor: pointer;
  font-size: 1.3em;
}
.card-body {
  padding: 0px;
  min-height: 200px;
  /* max-height: 200px; */
  position: relative;
  cursor: pointer;
}
.card-footer {
  font-size: 1em;
  cursor: default;
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
