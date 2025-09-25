<template>
    <div class="step-finish-part">
        <!-- <div class="border border-green-200 rounded-lg p-3 bg-green-50">
            <div class="flex items-center gap-2">
                <CheckCircleIcon class="h-4 w-4 text-green-600" />
                <span class="text-sm font-medium text-green-800">完成步骤</span>
                <span v-if="(part as any).step" class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    {{ (part as any).step }}
                </span>
                <span v-if="(part as any).status" :class="getStatusClass((part as any).status)"
                    class="text-xs px-2 py-1 rounded">
                    {{ getStatusText((part as any).status) }}
                </span>
            </div>
            <div v-if="(part as any).result" class="text-sm text-green-700 mt-2">
                {{ (part as any).result }}
            </div>
            <div v-if="(part as any).duration" class="text-xs text-green-600 mt-1">
                耗时: {{ formatDuration((part as any).duration) }}
            </div>
            <div v-if="(part as any).timestamp" class="text-xs text-green-500 mt-1">
                {{ formatTime((part as any).timestamp) }}
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
// import { CheckCircleIcon } from 'lucide-vue-next'

import type { Part } from '@opencode-ai/sdk'

interface Props {
    part: Part
}

defineProps<Props>()

// const getStatusClass = (status: string) => {
//     switch (status) {
//         case 'success':
//             return 'bg-green-100 text-green-800'
//         case 'error':
//             return 'bg-red-100 text-red-800'
//         case 'warning':
//             return 'bg-yellow-100 text-yellow-800'
//         default:
//             return 'bg-gray-100 text-gray-800'
//     }
// }

// const getStatusText = (status: string) => {
//     switch (status) {
//         case 'success':
//             return '成功'
//         case 'error':
//             return '失败'
//         case 'warning':
//             return '警告'
//         default:
//             return status
//     }
// }

// const formatDuration = (duration: number) => {
//     if (duration < 1000) {
//         return `${duration}ms`
//     }
//     return `${(duration / 1000).toFixed(2)}s`
// }

// const formatTime = (timestamp: number) => {
//     return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     })
// }
</script>
