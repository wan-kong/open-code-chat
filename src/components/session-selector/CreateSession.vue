<template>
    <SidebarMenuItem>
        <SidebarMenuButton @click="handleCreate" class="group text-muted-foreground hover:text-foreground">
            <Plus class="mr-2 h-4 w-4" />
            <span>新建会话</span>
        </SidebarMenuButton>
    </SidebarMenuItem>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

interface Emits {
    create: [title: string]
}

const emit = defineEmits<Emits>()

const handleCreate = () => {
    emit('create', '新会话')
}
</script>