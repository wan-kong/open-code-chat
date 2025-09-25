<template>
    <SidebarMenu>
        <CreateSession @create="handleCreateSession" />
        <SessionItem v-for="session in sessions" :key="session.id" :session="session"
            :is-active="activeSession?.id === session.id" @select="handleSelectSession" @delete="handleDeleteSession"
            @update="handleUpdateSession" />
    </SidebarMenu>
</template>

<script setup lang="ts">
import type { Session } from '@opencode-ai/sdk'
import { SidebarMenu } from '@/components/ui/sidebar'
import SessionItem from './SessionItem.vue'
import CreateSession from './CreateSession.vue'

interface Props {
    sessions: Session[]
    activeSession: Session | null
}

interface Emits {
    select: [session: Session]
    create: [title: string]
    delete: [session: Session]
    update: [session: Session, newTitle: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSelectSession = (session: Session) => {
    emit('select', session)
}

const handleCreateSession = (title: string) => {
    emit('create', title)
}

const handleDeleteSession = (session: Session) => {
    emit('delete', session)
}

const handleUpdateSession = (session: Session, newTitle: string) => {
    emit('update', session, newTitle)
}
</script>
