<template>
  <img
    @keypress.m="meow = !meow"
    tabindex="0"
    class="rounded"
    :alt="!meow ? 'SPASSU logo' : 'Meow!'"
    :src="logo_url"
  />
  <CatGrid v-if="meow" />
  <ReportGen v-else msg="Gerador de relatório de sprint" />
</template>

<script>
import ReportGen from "./components/ReportGen.vue";
import CatGrid from "./components/CatGrid.vue";

export default {
  name: "App",

  components: {
    ReportGen,
    CatGrid,
  },
  data() {
    return {
      meow: false,
    };
  },
  computed: {
    logo_url() {
      return this.meow
        ? require("./assets/cat-thumb.jpg")
        : require("./assets/spassu-logo.jpg");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img.rounded {
  height: 200px;
  border-radius: 15px;
}
</style>
