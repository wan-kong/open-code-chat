<template>
    <div class="prose prose-sm max-w-none">
        <div class="whitespace-pre-wrap text-sm leading-relaxed">
            {{ (part as any).text }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Part } from '@opencode-ai/sdk'

interface Props {
    part: Part
}

defineProps<Props>()
</script>
