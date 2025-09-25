<template>
    <div class="message-part">
        <PartRenderer :part="part" />
    </div>
</template>

<script setup lang="ts">
import type { Part } from '@opencode-ai/sdk'
import PartRenderer from './parts/PartRenderer.vue'

interface Props {
    part: Part
}

defineProps<Props>()
</script>
