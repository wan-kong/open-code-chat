<template>
    <Select :modelValue="currentProject?.id" @update:modelValue="handleProjectChange">
        <SelectTrigger class="w-full">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :class="getProjectStatusColor(currentProject)" />
                <SelectValue :placeholder="'Select Project'" class="text-left">
                    {{ getProjectDisplayName(currentProject) }}
                </SelectValue>
            </div>
        </SelectTrigger>
        <SelectContent>
            <!-- 新建项目 -->
            <CreateProject />
            <SelectSeparator />
            <!-- 项目列表 -->
            <SelectGroup>
                <SelectItem v-for="project in projects" :key="project.id" :value="project.id">
                    <ProjectItem :project="project" />
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import CreateProject from './CreateProject.vue'
import ProjectItem from './ProjectItem.vue'
import type { Project } from '@/types'
import { getProjectDisplayName, getProjectStatusColor } from './utils'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { AcceptableValue } from 'reka-ui'

interface Props {
    projects: Project[]
    currentProject: Project | null
}

interface Emits {
    (e: 'select', project: Project): void
    (e: 'create'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleProjectChange(projectId: AcceptableValue) {
    const project = props.projects.find(p => p.id === projectId)
    if (project) {
        emit('select', project)
    }
}

</script>
