<template>
  <div>
    <b-collapse v-model="visible" id="collapse-3">
      <b-form @submit="savecontact">
        <b-card :header="$t('text.contactinfo')" class="mb-2 ">
          <b-card-text>
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1"
              :label="$t('labels.name')"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="form.displayName"
                type="text"
                required
                :placeholder="$t('text.fullname')"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-2"
              :label="$t('labels.phone')"
              label-for="input-2"
              class="input-title"
            >
              <VuePhoneNumberInput
                dir="ltr"
                v-model="vuephone"
                @update="convertphone"
                size="lg"
                default-country-code="LY"
                color="#ff0000"
                clearable
              />
            </b-form-group>
            <b-button type="submit" variant="success">
              {{ $t("buttons.save") }}
            </b-button>
            <b-button @click="cancelcontact" variant="danger">
              {{ $t("buttons.cancel") }}
            </b-button>
          </b-card-text>
          <template v-slot:footer>
            {{ $t("text.choosetoshare") }}
          </template>
        </b-card>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";

export default {
  name: "getclinetinfo",
  props: ["dir", "ta", "lang"],
  data() {
    return {
      visible: false,
      vuephone: "",
      form: {
        displayName: "",
        phoneNumber: "",
      },
    };
  },
  components: { VuePhoneNumberInput },
  computed: {},
  methods: {
    convertphone(payload) {
      if (payload.phoneNumber) {
        if (payload.phoneNumber.length == 9) {
          this.form.phoneNumber = "0" + payload.phoneNumber;
        } else {
          this.form.phoneNumber = payload.phoneNumber;
        }
      } else {
        this.form.phoneNumber = null;
      }
    },
    savecontact(evt) {
      evt.preventDefault();
      this.$emit("savecontact", this.form.displayName, this.form.phoneNumber);
      this.visible = false;
    },
    cancelcontact() {
      this.visible = false;
    },
  },
  beforeCreate() {},
  created() {
    setTimeout(() => {
      this.visible = true;
    }, 3000);
  },
  mounted() {},
};
</script>

<style scoped>
.sponsorcol {
  margin: auto;
  vertical-align: middle;
}
.btn {
  margin: 15px;
}
.input-title {
  font-size: 1.1rem;
}
@media only screen and (max-width: 400px) {
  .card-body {
    padding-right: 5px;
    padding-left: 5px;
    padding-bottom: 5px;
  }
}
</style>
