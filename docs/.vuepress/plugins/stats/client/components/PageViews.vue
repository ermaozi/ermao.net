<template>
  <span class="view-count" v-if="count !== null">
    <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3"/></svg></span> {{ count }}
  </span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  path: String
})

const count = ref(null)

// @ts-ignore
let workerUrl = __STATS_WORKER_URL__
// Fix double quotes if they exist
if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
    workerUrl = workerUrl.slice(1, -1)
}

const fetchCount = async (p) => {
    if (!workerUrl || !p) return
    
    try {
        const res = await fetch(`${workerUrl}/count?path=${encodeURIComponent(p)}`)
        if (res.ok) {
            const data = await res.json()
            count.value = data.count
        }
    } catch (e) {
        console.error('[stats] fetch count error', e)
    }
}

onMounted(() => {
    fetchCount(props.path)
})

watch(() => props.path, (newPath) => {
    fetchCount(newPath)
})
</script>

<style scoped>
.view-count {
  display: inline-flex;
  align-items: center;
  font-size: 0.9em;
  color: var(--vp-c-text-2, #666); /* Try to match theme color var */
  margin-left: 0.5em;
  vertical-align: middle;
}
.view-count .icon {
    margin-right: 4px;
}
</style>