<template>
  <div id="app">
    <SidebarHome v-if="showSideBar"/>
    <router-view />
  </div>
</template>

<script>
import SidebarHome from "@/components/SidebarHome.vue";

export default {
  name: "HomeView",
  components: {
    SidebarHome,
  },
  props: {
    menuLoginBody: {
      type: String,
      default: "0px",
    },
  },
  computed: {
    showSideBar() {
      this.menuLoginBody
      return this.$route.name !== "Login";
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
