<template>
    <div class="reasoning-part">
        <div class="bg-gray-50 border-l-4 border-gray-200 p-2 pl-3 rounded-r-md">
            <div class="text-sm text-gray-400 whitespace-pre-wrap">
                {{ (part as any).text }}
            </div>
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
