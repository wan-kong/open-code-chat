<template>
    <div class="text-sm">
        <div class="flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-all duration-150 hover:bg-gray-200 hover:scale-[1.02]"
            :style="{ paddingLeft: `${level * 16 + 8}px` }" @click="handleClick">
            <div class="w-4 h-4 flex items-center justify-center">
                <FolderOpenIcon v-if="node.type === 'directory' && node.expanded" :size="14" />
                <FolderIcon v-else-if="node.type === 'directory'" :size="14" />
                <FileIcon v-else :size="14" />
            </div>
            <span class="select-none">{{ node.name }}</span>
        </div>

        <Transition name="expand" @enter="onEnter" @leave="onLeave">
            <div v-if="node.type === 'directory' && node.expanded && node.children" class="overflow-hidden">
                <TransitionGroup name="file-item" tag="div">
                    <FileTreeNode v-for="child in node.children" :key="child.id" :node="child" :level="level + 1"
                        @expand="$emit('expand', $event)" @select="$emit('select', $event)" />
                </TransitionGroup>
            </div>
        </Transition>
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

// 展开/收起动画
const onEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = '0'
    element.offsetHeight // force reflow
    element.style.height = element.scrollHeight + 'px'
}

const onLeave = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = element.scrollHeight + 'px'
    element.offsetHeight // force reflow
    element.style.height = '0'
}
</script>

<style scoped>
/* 展开收起动画 */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    height: 0;
    opacity: 0;
}

/* 文件项动画 */
.file-item-enter-active {
    transition: all 0.2s ease;
}

.file-item-leave-active {
    transition: all 0.2s ease;
}

.file-item-enter-from {
    opacity: 0;
    transform: translateX(-10px);
}

.file-item-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

.file-item-move {
    transition: transform 0.2s ease;
}
</style>
