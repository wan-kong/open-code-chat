<template>
    <div class="px-4 py-2">
        <div class="space-y-0">
            <template v-for="item in messages" :key="getItemKey(item)">
                <MessageItem v-if="!('permission' in item)" :message="(item as MessageData).info"
                    :parts="(item as MessageData).parts" />
                <div v-else class="py-4 px-4">
                    <PermissionPart :permission="(item as PermissionData).permission" />
                </div>
            </template>
        </div>
        <!-- Empty State -->
        <div v-if="messages.length === 0" class="flex items-center justify-center min-h-[400px]">
            <div class="text-center space-y-3">
                <MessageSquare class="h-12 w-12 text-muted-foreground mx-auto" />
                <div class="space-y-1">
                    <h3 class="text-lg font-medium">开始对话</h3>
                    <p class="text-sm text-muted-foreground">
                        选择一个会话或创建新会话开始聊天
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatItemData, MessageData, PermissionData } from '@/services/opencode'
import { MessageSquare } from 'lucide-vue-next'
import MessageItem from './MessageItem.vue'
import { PermissionPart } from './parts'

const getItemKey = (item: ChatItemData) => {
    if ('permission' in item) {
        return `permission-${(item as PermissionData).permission.id}`
    } else {
        return `message-${(item as MessageData).info.id}`
    }
}

interface Props {
    messages: ChatItemData[]
}

defineProps<Props>()
</script>
