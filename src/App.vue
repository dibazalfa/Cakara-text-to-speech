<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <router-link to="/">Text to Speech</router-link>
  <router-link to="/about">Upload txt</router-link>
  <RouterView />
</template>