<template>
    <div
        class="inline-flex items-center gap-2 px-2 py-1 bg-orange-50/50 border border-orange-200/50 rounded-md text-xs">
        <ToolCaseIcon class="h-3 w-3 text-orange-600 shrink-0" />
        <span class="text-orange-800 font-medium">{{ (part as any).tool }}</span>
        <Badge :variant="getToolStateVariant((part as any).state)" class="text-[10px] px-1.5 py-0.5">
            <LoaderIcon v-if="part.state.status === 'running'" class="h-3 w-3 text-orange-600 shrink-0 animate-spin" />
            {{ getToolStateText((part as any).state) }}
        </Badge>
    </div>
</template>

<script setup lang="ts">
import type { ToolPart, ToolState } from '@opencode-ai/sdk'
import { LoaderIcon, ToolCaseIcon } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

interface Props {
    part: ToolPart
}

defineProps<Props>()

const getToolStateVariant = (state: ToolState) => {
    switch (state.status) {
        case 'pending':
            return 'outline'
        case 'running':
            return 'secondary'
        case 'completed':
            return 'default'
        case 'error':
            return 'destructive'
        default:
            return 'outline'
    }
}

const getToolStateText = (state: ToolState) => {
    switch (state.status) {
        case 'pending':
            return '等待中'
        case 'running':
            return '运行中'
        case 'completed':
            return '已完成'
        case 'error':
            return '失败'
        default:
            return state
    }
}
</script>
