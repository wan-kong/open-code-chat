<template>
    <div :class="messageClasses">
        <!-- Avatar and Header -->
        <div class="flex gap-3">
            <div class="flex-shrink-0">
                <Avatar :class="avatarClasses">
                    <AvatarFallback>
                        {{ isUser ? 'U' : 'AI' }}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div class="flex-1 space-y-2">
                <!-- Message Header -->
                <div class="flex items-center gap-2">
                    <span :class="roleClasses">
                        {{ isUser ? 'User' : 'Assistant' }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                        {{ formatTime(message.time.created) }}
                    </span>
                </div>
                <!-- Message Parts -->
                <div class="space-y-2">
                    <div v-for="part in parts" :key="part.id">
                        <MessagePart :part="part" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message, Part } from '@opencode-ai/sdk'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import MessagePart from './MessagePart.vue'

interface Props {
    message: Message
    parts: Part[]
}

const props = defineProps<Props>()

const isUser = computed(() => props.message.role === 'user')

const messageClasses = computed(() => [
    'group relative py-4 px-4',
    isUser.value
        ? 'bg-muted/30'
        : 'bg-background'
])

const avatarClasses = computed(() => [
    'h-8 w-8',
    isUser.value
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-secondary-foreground'
])

const roleClasses = computed(() => [
    'text-sm font-medium',
    isUser.value
        ? 'text-primary'
        : 'text-foreground'
])

const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>
