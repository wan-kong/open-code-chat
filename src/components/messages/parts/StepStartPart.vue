<template>
    <div class="step-start-part">

    </div>
</template>

<script setup lang="ts">
// import { PlayIcon } from 'lucide-vue-next'

import type { StepStartPart } from '@opencode-ai/sdk'

interface Props {
    part: StepStartPart
}

defineProps<Props>()

// const formatTime = (timestamp: number) => {
//     return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     })
// }
</script>
