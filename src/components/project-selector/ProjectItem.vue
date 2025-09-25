<template>
    <div class="flex items-center gap-3">
        <!-- 状态标签 -->
        <div class="flex items-center gap-2 min-w-0 flex-1">
            <div class="min-w-0 flex-1">
                <div class="font-medium truncate">
                    {{ getProjectDisplayName(project) }}
                </div>
                <div class="text-xs text-muted-foreground truncate font-mono flex gap-1">
                    <FolderIcon class="w-2 h-2 text-gray-400" /> {{ getProjectPath(project) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ProjectItem">
import { getProjectDisplayName, getProjectPath } from './utils'
import { FolderIcon } from 'lucide-vue-next';
import type { Project } from '@opencode-ai/sdk';

interface Props {
    project: Project
}
defineProps<Props>()

</script>
