<template>
    <PartRenderer :part="part" />
</template>

<script setup lang="ts">
import type { Part } from '@opencode-ai/sdk'
import PartRenderer from './parts/PartRenderer.vue'

interface Props {
    part: Part
}

defineProps<Props>()
</script>
