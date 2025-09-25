<template>
    <div class="agent-part">
        <div class="border border-purple-200 rounded-lg p-3 bg-purple-50">
            <div class="flex items-center gap-2">
                <UserIcon class="h-4 w-4 text-purple-600" />
                <span class="text-sm font-medium text-purple-800">Agent: {{ (part as any).name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserIcon } from 'lucide-vue-next'

import type { Part } from '@opencode-ai/sdk'

interface Props {
    part: Part
}

defineProps<Props>()
</script>
