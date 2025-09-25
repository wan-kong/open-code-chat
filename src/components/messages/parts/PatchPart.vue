<template>
    <div class="patch-part">
        <div class="border border-amber-200 rounded-lg p-3 bg-amber-50">
            <div class="flex items-center gap-2 mb-2">
                <GitBranchIcon class="h-4 w-4 text-amber-600" />
                <span class="text-sm font-medium text-amber-800">代码补丁</span>
                <span v-if="(part as any).filename" class="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    {{ (part as any).filename }}
                </span>
                <span v-if="(part as any).operation" :class="getOperationClass((part as any).operation)"
                    class="text-xs px-2 py-1 rounded">
                    {{ getOperationText((part as any).operation) }}
                </span>
            </div>

            <div v-if="(part as any).description" class="text-sm text-amber-700 mb-2">
                {{ (part as any).description }}
            </div>

            <div v-if="(part as any).path" class="text-xs text-amber-600 mb-2">
                路径: {{ (part as any).path }}
            </div>

            <!-- 显示差异内容 -->
            <div v-if="(part as any).diff" class="bg-white border border-amber-100 rounded p-2 mt-2">
                <pre class="text-xs font-mono whitespace-pre-wrap overflow-x-auto">{{ (part as any).diff }}</pre>
            </div>

            <!-- 显示变更统计 -->
            <div v-if="(part as any).stats" class="flex items-center gap-4 text-xs text-amber-600 mt-2">
                <span v-if="(part as any).stats.additions" class="text-green-600">
                    +{{ (part as any).stats.additions }} 行
                </span>
                <span v-if="(part as any).stats.deletions" class="text-red-600">
                    -{{ (part as any).stats.deletions }} 行
                </span>
                <span v-if="(part as any).stats.changes" class="text-blue-600">
                    ~{{ (part as any).stats.changes }} 处修改
                </span>
            </div>

            <div v-if="(part as any).timestamp" class="text-xs text-amber-500 mt-1">
                {{ formatTime((part as any).timestamp) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GitBranchIcon } from 'lucide-vue-next'

import type { Part } from '@opencode-ai/sdk'

interface Props {
    part: Part
}

defineProps<Props>()

const getOperationClass = (operation: string) => {
    switch (operation) {
        case 'create':
            return 'bg-green-100 text-green-800'
        case 'delete':
            return 'bg-red-100 text-red-800'
        case 'update':
            return 'bg-blue-100 text-blue-800'
        case 'rename':
        case 'move':
            return 'bg-purple-100 text-purple-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const getOperationText = (operation: string) => {
    switch (operation) {
        case 'create':
            return '新建'
        case 'delete':
            return '删除'
        case 'update':
            return '修改'
        case 'rename':
            return '重命名'
        case 'move':
            return '移动'
        default:
            return operation
    }
}

const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}
</script>
