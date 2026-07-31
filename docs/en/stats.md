---
title: Ermao Blog Content Statistics
description: View article counts, category distribution, update activity, and site-wide content trends for Ermao Blog.
pageClass: custom-page-class
layout: Layout
sidebar: false
aside: false
comments: false
stats: false
permalink: /en/stats/
lang: en-US
translationOf: /stats/
---

<StatsPage />

<style>
.custom-page-class .vp-doc,
.custom-page-class .vp-doc-container .content,
.custom-page-class .vp-doc-container .content-container {
  max-width: 1180px !important;
}

.custom-page-class .vp-doc > h1 {
  max-width: 860px;
}

@media (max-width: 719px) {
  .custom-page-class .vp-doc {
    padding-inline: 16px;
  }
}
</style>
<script setup>
import StatsPage from '@stats/StatsPage.vue'
</script>
