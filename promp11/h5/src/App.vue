<template>
  <router-view />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
</style>
