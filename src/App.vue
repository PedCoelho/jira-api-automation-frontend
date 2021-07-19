<template>
  <img
    class="rounded"
    alt="SPASSU logo"
    src="https://mir-s3-cdn-cf.behance.net/projects/404/d3d36636282889.Y3JvcCw0MDQsMzE2LDAsMA.jpg"
  />
  <HelloWorld msg="Gerador de relatório de sprint" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
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
