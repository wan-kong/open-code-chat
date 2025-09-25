<template>
    <div class="text-sm">
        <div class="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
            :style="{ paddingLeft: `${level * 16 + 8}px` }" @click="handleClick">
            <div class="w-4 h-4 flex items-center justify-center">
                <FolderOpenIcon v-if="node.type === 'directory' && node.expanded" :size="14" />
                <FolderIcon v-else-if="node.type === 'directory'" :size="14" />
                <FileIcon v-else :size="14" />
            </div>
            <span class="select-none">{{ node.name }}</span>
        </div>

        <div v-if="node.type === 'directory' && node.expanded && node.children">
            <FileTreeNode v-for="child in node.children" :key="child.id" :node="child" :level="level + 1"
                @expand="$emit('expand', $event)" @select="$emit('select', $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderIcon, FolderOpenIcon, FileIcon } from 'lucide-vue-next'

interface FileTreeItem {
    id: string;
    name: string;
    type: 'file' | 'directory';
    children?: FileTreeItem[];
    expanded?: boolean;
    loaded?: boolean;
}

const props = defineProps<{
    node: FileTreeItem;
    level: number;
}>()

const emit = defineEmits<{
    expand: [node: FileTreeItem]
    select: [node: FileTreeItem]
}>()

const handleClick = () => {
    if (props.node.type === 'directory') {
        emit('expand', props.node)
    } else {
        emit('select', props.node)
    }
}
</script>
