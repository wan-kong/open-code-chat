<template>
    <MarkdownRender :markdown="part.text" class="prose prose-sm text-sm" />
</template>

<script setup lang="ts">
import { MarkdownRender } from '@/components/markdown-render';
import type { TextPart } from '@opencode-ai/sdk'

interface Props {
    part: TextPart
}

defineProps<Props>()
</script>
