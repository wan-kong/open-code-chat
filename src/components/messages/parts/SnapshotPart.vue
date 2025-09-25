<template>
    <div class="snapshot-part">
        <div class="border border-indigo-200 rounded-lg p-3 bg-indigo-50">
            <div class="flex items-center gap-2 mb-2">
                <CameraIcon class="h-4 w-4 text-indigo-600" />
                <span class="text-sm font-medium text-indigo-800">代码快照</span>
                <span v-if="(part as any).filename" class="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    {{ (part as any).filename }}
                </span>
            </div>

            <div v-if="(part as any).description" class="text-sm text-indigo-700 mb-2">
                {{ (part as any).description }}
            </div>

            <div v-if="(part as any).path" class="text-xs text-indigo-600 mb-2">
                路径: {{ (part as any).path }}
            </div>

            <div v-if="(part as any).content" class="bg-white border border-indigo-100 rounded p-2 mt-2">
                <pre
                    class="text-xs text-gray-800 whitespace-pre-wrap font-mono overflow-x-auto">{{ (part as any).content }}</pre>
            </div>

            <div v-if="(part as any).lineRange" class="text-xs text-indigo-500 mt-1">
                行范围: {{ (part as any).lineRange.start }} - {{ (part as any).lineRange.end }}
            </div>

            <div v-if="(part as any).timestamp" class="text-xs text-indigo-500 mt-1">
                {{ formatTime((part as any).timestamp) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CameraIcon } from 'lucide-vue-next'

import type { Part } from '@opencode-ai/sdk'

interface Props {
    part: Part
}

defineProps<Props>()

const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}
</script>
