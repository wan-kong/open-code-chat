<template>
    <div class="border-l flex-col flex h-full overflow-hidden">
        <div class="p-2 shrink-0 border-b font-bold">
            File Preview
        </div>
        <ResizablePanelGroup direction="horizontal">
            <resizable-panel :default-size="30">
                <div class="h-full overflow-y-auto p-2">
                    <div v-if="loading" class="text-sm text-gray-500">Loading...</div>
                    <div v-else class="space-y-1">
                        <FileTreeNode v-for="item in fileTree" :key="item.id" :node="item" :level="0"
                            @expand="handleExpandDirectory" @select="handleSelectFile" />
                    </div>
                </div>
            </resizable-panel>
            <resizable-handle></resizable-handle>
            <resizable-panel :default-size="70">
                <div v-if="selectedFile.loading" class="h-full flex items-center justify-center">Loading file...</div>
                <pre v-else-if="selectedFile.content"
                    class="text-xs  overflow-auto h-full p-2 bg-gray-50">{{ selectedFile.content }}</pre>
                <div v-else class="text-sm text-gray-500 text-center h-full flex items-center justify-center">
                    Select a file to preview
                </div>
            </resizable-panel>
        </ResizablePanelGroup>
    </div>
</template>

<script setup lang="ts" name="FileList">
import { openCodeClient } from '@/services/opencode';
import type { Project, Session, FileContent } from '@opencode-ai/sdk';
import { watch, ref } from 'vue';
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from '../ui/resizable';
import { FileTreeNode } from './index';

interface FileTreeItem {
    id: string;
    name: string;
    type: 'file' | 'directory';
    path: string;
    children?: FileTreeItem[];
    expanded?: boolean;
    loaded?: boolean;
}

const props = defineProps<{
    project: Project
    session: Session
}>()

const loading = ref(false)
const fileTree = ref<FileTreeItem[]>([])
const selectedFile = ref({
    name: '',
    content: '',
    loading: false
})

const loadFileList = (directory = '/'): Promise<FileTreeItem[]> => {
    if (!props.project || !props.session) {
        console.log("NOT FOUND Project or Session")
        return Promise.resolve([])
    }

    loading.value = !directory // Only show main loading for root

    return openCodeClient.file.list({
        query: {
            directory: props.session.directory,
            path: directory
        }
    }).then(({ data }) => {
        const items = data?.map((item) => ({
            id: item.absolute,
            name: item.name,
            type: item.type as 'file' | 'directory',
            children: item.type === 'directory' ? [] : undefined,
            expanded: false,
            loaded: false,
            path: item.path
        })) ?? []

        if (directory === '/') {
            fileTree.value = items
        }

        return items
    }).finally(() => {
        loading.value = false
    })
}

const handleExpandDirectory = async (node: FileTreeItem) => {
    if (node.type !== 'directory') return

    if (node.expanded) {
        node.expanded = false
        return
    }

    if (!node.loaded) {
        try {
            // 计算相对路径
            const children = await loadFileList(node.path)
            node.children = children
            node.loaded = true
        } catch (error) {
            console.error('Failed to load directory:', error)
            return
        }
    }

    node.expanded = true
}

const handleSelectFile = async (node: FileTreeItem) => {
    if (node.type !== 'file') return
    selectedFile.value.loading = true
    selectedFile.value.name = node.name

    try {
        const response = await openCodeClient.file.read({
            query: {
                directory: props.session.directory,
                path: node.path
            }
        })
        selectedFile.value.content = (response.data as FileContent)?.content || ''
    } catch (error) {
        console.error('Failed to read file:', error)
        selectedFile.value.content = 'Failed to load file content'
    } finally {
        selectedFile.value.loading = false
    }
}

watch(() => [
    props.project,
    props.session
], () => {
    loadFileList()
}, {
    immediate: true
})

</script>
