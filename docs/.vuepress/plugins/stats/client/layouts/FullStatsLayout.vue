<template>
  <div class="stats-layout-container">
    <Content />
  </div>
</template>

<script setup>
import { Content } from 'vuepress/client'
</script>

<style>
.stats-layout-container {
    padding-top: var(--vp-nav-height); 
    min-height: 100vh;
}
</style>
