<template>
  <div class="main">
    <div class="container">
      <div class="grid-item" v-for="i of numberOfItems" :key="i">
        <h4>Cat {{ i }}</h4>
        <img :src="imageSrcs[i - 1]?.url" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CatGrid",
  data() {
    return {
      numberOfItems: 12,
      imageSrcs: [],
    };
  },
  mounted() {
    // console.log(process.env.VUE_APP_CAT_API_KEY);
    console.log("meow");
    this.getCats();
  },
  methods: {
    async getCats() {
      let data = await axios(
        `https://api.thecatapi.com/v1/images/search?mime_types=jpg,png&limit=${this.numberOfItems}`
        // ,{
        //   headers: { "x-api-key": process.env.VUE_APP_CAT_API_KEY },
        // }
      ).then((response) => response.data);
      console.log(data);
      this.imageSrcs = data;
    },
  },
};
</script>

<style scoped>
.main {
  margin: 1rem 0;
}

img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.container {
  display: grid;
  /* grid-template-columns: 33.33% 33.33% 33.33%; */
  grid-template-columns: 1fr 1fr 1fr;
  /* fractional units (only take up available space) */
  gap: 10px;
  max-width: 50%;
  outline: 2px solid grey;
  margin: 0 auto;
}
.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  outline: 1px solid greenyellow;
}
.grid-item > h4 {
  position: absolute;
  backdrop-filter: blur(8px);
  background: rgba(255, 105, 180, 0.15);
  filter: drop-shadow(-2px -2px 10px white);
  padding: 0.2rem 0.4rem;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  border-radius: 5%;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  color: WHITE;
}
</style>
