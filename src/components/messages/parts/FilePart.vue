<template>
    <div class="file-part">
        <div class="border rounded-lg p-3 bg-muted/50">
            <div class="flex items-center gap-2 mb-2">
                <FileIcon class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm font-medium">{{ (part as any).filename || '文件' }}</span>
                <span class="text-xs text-muted-foreground">{{ (part as any).mime }}</span>
            </div>
            <div v-if="(part as any).source?.type === 'file'" class="text-xs text-muted-foreground">
                路径: {{ (part as any).source.path }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FileIcon } from 'lucide-vue-next'

import type { Part } from '@opencode-ai/sdk'

interface Props {
    part: Part
}

defineProps<Props>()
</script>
