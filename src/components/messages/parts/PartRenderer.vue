<template>
    <component :is="partComponent" :part="part as any" v-if="partComponent" />
    <!-- Fallback for unknown part types -->
    <div v-else class="unknown-part">
        <div class="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium text-yellow-800">未知消息类型: {{ part.type }}</span>
            </div>
            <pre class="text-xs text-yellow-700 mt-2 whitespace-pre-wrap">{{ JSON.stringify(part, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Part } from '@opencode-ai/sdk'
import TextPart from './TextPart.vue'
import ReasoningPart from './ReasoningPart.vue'
import FilePart from './FilePart.vue'
import ToolPart from './ToolPart.vue'
import AgentPart from './AgentPart.vue'
import StepStartPart from './StepStartPart.vue'
import StepFinishPart from './StepFinishPart.vue'
import SnapshotPart from './SnapshotPart.vue'
import PatchPart from './PatchPart.vue'
import PermissionPart from './PermissionPart.vue'

interface Props {
    part: Part
}

const props = defineProps<Props>()

// TextPart | ReasoningPart | FilePart | ToolPart | StepStartPart | StepFinishPart | SnapshotPart | PatchPart | AgentPart | PermissionPart
const partComponentMap = {
    text: TextPart,
    reasoning: ReasoningPart,
    file: FilePart,
    tool: ToolPart,
    agent: AgentPart,
    'step-start': StepStartPart,
    'step-finish': StepFinishPart,
    snapshot: SnapshotPart,
    patch: PatchPart,
    permission: PermissionPart,
} as const

// 动态选择组件
const partComponent = computed(() => {
    return partComponentMap[props.part.type as keyof typeof partComponentMap]
})
</script>
