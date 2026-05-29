<script setup lang="ts">
import Game from './components/Game.vue'
</script>

<template>
  <Game />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  max-width: none;
}
</style>
