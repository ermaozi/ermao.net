---
pageClass: custom-page-class
layout: Layout
sidebar: false
aside: false
comments: false
stats: false
permalink: /stats/
---

<StatsPage />

<style>
.custom-page-class .vp-doc,
.custom-page-class .vp-doc-container .container,
.custom-page-class .vp-doc-container .content,
.custom-page-class .vp-doc-container .content-container {
  max-width: 100% !important;
}

/* Override media query constraints */
@media (min-width: 960px) {
  .custom-page-class .vp-doc-container:not(.has-sidebar) .container,
  .custom-page-class .vp-doc-container:not(.has-sidebar) .content {
    max-width: 90% !important;
  }
}

@media (min-width: 1440px) {
  .custom-page-class .vp-doc-container:not(.has-sidebar) .container,
  .custom-page-class .vp-doc-container:not(.has-sidebar) .content {
    max-width: 90% !important;
  }
}
</style>
<script setup>
import StatsPage from '@stats/StatsPage.vue'
</script>
