<template>
  <SidebarProvider>
    <Transition name="app-fade" appear>
      <div class="min-h-screen flex w-full">
        <!-- Sidebar -->
        <Sidebar>
          <SidebarHeader class="p-2.5">
            <ProjectSelector :projects="projects" :current-project="activeProject" @select="handleProjectSelect"
              @create="handleCreateProject" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>会话列表</SidebarGroupLabel>
              <SidebarGroupContent>
                <SessionSelector :sessions="sessionList" :active-session="activeSession" @select="handleSessionSelect"
                  @create="handleSessionCreate" @delete="handleSessionDelete" @update="handleSessionUpdate" />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <!-- Main Content -->
        <SidebarInset class="flex-1 h-svh overflow-hidden flex flex-col">
          <!-- Header -->
          <header class="shrink-0 flex h-14 items-center justify-between border-b px-4 bg-background">
            <div class="flex gap-1 items-center">
              <SidebarTrigger class="-ml-1" />
              <Separator orientation="vertical" class="mr-2 h-4" />
              <h1 class="text-lg font-semibold">OPENCODE Chat</h1>
            </div>
            <div class="flex items-center gap-2">
              <ModelConfig />
              <ToolList />
              <Button size="icon" variant="ghost"
                class="h-8 w-8 transition-all duration-200 hover:scale-110 hover:bg-primary/10"
                :disabled="!activeProject" @click="showFileSidebar = !showFileSidebar">
                <FolderTreeIcon class="h-4 w-4 transition-transform duration-200"
                  :class="showFileSidebar ? 'rotate-90' : ''" />
                <span class="sr-only">文件列表</span>
              </Button>
              <Avatar class="shrink-0 transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer">
                <AvatarFallback>
                  {{ config?.username?.slice(0, 1) }}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <!-- Main Content Area -->
          <ResizablePanelGroup direction="horizontal" class="flex-1 flex overflow-hidden">
            <ResizablePanel class="flex-1 overflow-hidden">
              <div class="h-full overflow-y-auto flex flex-col">
                <MessageList :messages="mergedMessages" class="flex-1 " />
                <div class="w-full sticky bottom-4">
                  <div class=" shrink-0 px-4 mb-4 max-w-2xl mx-auto">
                    <MessageInput :is-loading="isLoadingMessages || isStreaming" @send-message="handleSendMessage"
                      placeholder="Work With OPENCODE..." />
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle v-if="showFileSidebar"></ResizableHandle>
            <ResizablePanel v-if="showFileSidebar">
              <FileList :project="activeProject!" :session="activeSession!" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarInset>
      </div>
    </Transition>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ProjectSelector from '@/components/project-selector/ProjectSelector.vue'
import { SessionSelector } from '@/components/session-selector'
import { MessageList, MessageInput } from '@/components/messages'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { openCodeClient, type MessageData, type PermissionData, type ChatItemData } from './services/opencode'
import type { Config, Session, Event, Permission, Project } from '@opencode-ai/sdk'
import { mergeMessage } from './lib/utils'
import { ModelConfig } from './components/model-config'
import { ToolList } from './components/tool-list'
import { FileList } from './components/file-list'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { FolderTreeIcon } from 'lucide-vue-next'
import { Button } from './components/ui/button'

// 项目数据
const projects = ref<Project[]>([])

const activeProject = ref<Project | null>(projects.value[0] || null)

const showFileSidebar = ref(false)


function handleProjectSelect(project: Project) {
  activeProject.value = project
  // const displayName = project.worktree.split('/').pop() || project.worktree
  // console.log('Selected project:', displayName)
}

function handleCreateProject() {
  // console.log('Create new project')
  // TODO: 实现新建项目逻辑
}

const initProjectList = () => {
  openCodeClient.project.list().then(({ data }) => {
    projects.value = data || []
  })
  openCodeClient.project.current().then(({ data }) => {
    activeProject.value = data || null
  })
}
initProjectList()

const config = ref<Config | null>()

const loadConfig = () => {
  openCodeClient.config.get().then(({ data }) => {
    config.value = data
  })
}
loadConfig()



const sessionList = ref<Session[]>([])
const activeSession = ref<Session | null>(null)

const currentMessages = ref<ChatItemData[]>([])
const mergedMessages = computed(() => {
  return mergeMessage(currentMessages.value)
})
const isLoadingMessages = ref(false)
const isStreaming = ref(false)

// Event subscription controller
let eventController: AbortController | null = null

// Load messages when session changes
const loadMessages = async () => {
  if (!activeSession.value) {
    currentMessages.value = []
    return
  }

  isLoadingMessages.value = true
  try {
    const { data } = await openCodeClient.session.messages({
      path: { id: activeSession.value.id }
    })
    // Convert MessageData array to ChatItemData array
    const messageData: ChatItemData[] = (data || []).map(msg => ({
      ...msg,
      type: undefined // MessageData没有type字段，通过缺失来区分
    })) as ChatItemData[]
    currentMessages.value = messageData
  } catch (error) {
    currentMessages.value = []
  } finally {
    isLoadingMessages.value = false
  }
}

const initSessionList = () => {
  openCodeClient.session.list().then(({ data }) => {
    sessionList.value = data || []
    if (sessionList.value.length) {
      handleSessionSelect(sessionList.value[0]!)
    }
  })
}
initSessionList()

// Session 事件处理函数
function handleSessionSelect(session: Session) {
  activeSession.value = session
  loadMessages()
}

function handleSessionCreate(title: string) {
  openCodeClient.session.create({
    body: { title }
  }).then(({ data }) => {
    if (data) {
      sessionList.value.unshift(data)
      activeSession.value = data
      handleSessionSelect(data)
    }
  })
}

function handleSessionDelete(session: Session) {
  openCodeClient.session.delete({
    path: { id: session.id }
  }).then(() => {
    sessionList.value = sessionList.value.filter(s => s.id !== session.id)
    if (activeSession.value?.id === session.id) {
      handleSessionSelect(sessionList.value[0]!)
    }
  })
}

function handleSessionUpdate(session: Session, newTitle: string) {
  openCodeClient.session.update({
    path: { id: session.id },
    body: { title: newTitle }
  }).then(({ data }) => {
    if (data) {
      const index = sessionList.value.findIndex(s => s.id === session.id)
      if (index !== -1) {
        sessionList.value[index] = data
      }
      if (activeSession.value?.id === session.id) {
        activeSession.value = data
      }
    }
  })
}

// Message 事件处理函数
function handleSendMessage(content: string) {
  if (!activeSession.value) {
    console.warn('No active session to send message')
    return
  }
  isStreaming.value = true
  openCodeClient.session.prompt({
    path: {
      id: activeSession.value.id
    },
    body: {
      parts: [{
        type: "text",
        text: content
      }]
    }
  })

}

// Event handling functions
const handleEventMessageUpdated = (event: Event) => {
  if (event.type !== 'message.updated') return
  const message = event.properties.info
  // if (!activeSession.value || message.sessionID !== activeSession.value.id) return
  // Find and update existing message or add new one
  const existingIndex = currentMessages.value.findIndex(item =>
    'info' in item && item.info.id === message.id
  )
  if (existingIndex >= 0) {
    (currentMessages.value[existingIndex] as MessageData).info = message
  } else {
    currentMessages.value.push({
      info: message,
      parts: []
    })
  }
}

const handleEventMessagePartUpdated = (event: Event) => {
  if (event.type !== 'message.part.updated') return

  const part = event.properties.part
  if (!activeSession.value || part.sessionID !== activeSession.value.id) return

  // Find the message this part belongs to
  const messageIndex = currentMessages.value.findIndex(item =>
    'info' in item && item.info.id === part.messageID
  )
  if (messageIndex >= 0) {
    const message = currentMessages.value[messageIndex] as MessageData
    const partIndex = message.parts.findIndex(p => p.id === part.id)
    if (partIndex >= 0) {
      // Update existing part
      message.parts[partIndex] = part
    } else {
      // Add new part
      message.parts.push(part)
    }
  }
}

const handleEventMessageRemoved = (event: Event) => {
  if (event.type !== 'message.removed') return

  const { sessionID, messageID } = event.properties
  if (!activeSession.value || sessionID !== activeSession.value.id) return

  currentMessages.value = currentMessages.value.filter(item =>
    !('info' in item) || item.info.id !== messageID
  )
}

const handleEventMessagePartRemoved = (event: Event) => {
  if (event.type !== 'message.part.removed') return

  const { sessionID, messageID, partID } = event.properties
  if (!activeSession.value || sessionID !== activeSession.value.id) return

  const messageIndex = currentMessages.value.findIndex(item =>
    'info' in item && item.info.id === messageID
  )
  if (messageIndex >= 0) {
    const message = currentMessages.value[messageIndex] as MessageData
    message.parts = message.parts.filter(p => p.id !== partID)

    // Remove message if no parts left and it's not a user message
    if (message.parts.length === 0 && message.info.role !== 'user') {
      currentMessages.value.splice(messageIndex, 1)
    }
  }
}

const handleEventPermissionUpdated = (event: Event) => {
  if (event.type !== 'permission.updated') return

  const permission = event.properties as Permission
  if (!activeSession.value || permission.sessionID !== activeSession.value.id) return

  // Find existing permission in the list or create new one
  const existingIndex = currentMessages.value.findIndex(item =>
    'permission' in item && (item as PermissionData).permission.id === permission.id
  )

  if (existingIndex >= 0) {
    // Update existing permission
    (currentMessages.value[existingIndex] as PermissionData).permission = permission
  } else {
    // Add new permission as a separate chat item
    const permissionData: PermissionData = {
      permission
    }
    currentMessages.value.push(permissionData)
  }
}


const handleEventPermissionReplied = (event: Event) => {
  if (event.type !== 'permission.replied') return
  const reply = event.properties
  if (!activeSession.value || reply.sessionID !== activeSession.value.id) return

  // Find and remove the permission by permissionID
  const index = currentMessages.value.findIndex(message => {
    return 'permission' in message && message.permission.id === reply.permissionID
  })

  if (index !== -1) {
    currentMessages.value.splice(index, 1)
  }
}

const handleEventSessionUpdated = (event: Event) => {
  if (event.type !== 'session.updated') return
  const session = event.properties
  const sessionIndex = sessionList.value.findIndex(s => s.id === session.info.id)
  if (sessionIndex !== -1) {
    sessionList.value[sessionIndex] = session.info
  }
}

const handleEventSessionIdle = (event: Event) => {
  if (event.type !== 'session.idle') return
  isStreaming.value = false
  // const session = event.properties
  // const sessionIndex = sessionList.value.findIndex(s => s.id === session.sessionID)

}

// Event subscription management
const subscribeToEvents = async () => {
  try {
    // Clean up existing subscription
    if (eventController) {
      eventController.abort()
    }

    eventController = new AbortController()

    const events = await openCodeClient.event.subscribe()

    // Process events in a separate async function to avoid blocking
    const processEvents = async () => {
      try {
        for await (const event of events.stream) {
          if (eventController?.signal.aborted) break
          // console.log("Event:", event.type, event.properties)

          // Handle different event types
          switch (event.type) {
            case 'session.updated':
              handleEventSessionUpdated(event)
              break
            case 'session.idle':
              handleEventSessionIdle(event)
              break
            case 'message.updated':
              handleEventMessageUpdated(event)
              break
            case 'message.part.updated':
              handleEventMessagePartUpdated(event)
              break
            case 'message.removed':
              handleEventMessageRemoved(event)
              break
            case 'message.part.removed':
              handleEventMessagePartRemoved(event)
              break
            case 'permission.updated':
              handleEventPermissionUpdated(event)
              break
            case 'permission.replied':
              handleEventPermissionReplied(event)
              break
            case 'server.connected':
              // Server connection established, no action needed
              break
            default:
              // Log unhandled events for debugging
              console.log('Unhandled event type:', event.type)
          }
        }
      } catch (error) {
        if (!eventController?.signal.aborted) {
          console.error('Event stream error:', error)
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (!eventController?.signal.aborted) {
              subscribeToEvents()
            }
          }, 3000)
        }
      }
    }

    processEvents()
  } catch (error) {
    console.error('Failed to subscribe to events:', error)
    // Retry connection after delay
    setTimeout(() => {
      if (!eventController?.signal.aborted) {
        subscribeToEvents()
      }
    }, 5000)
  }
}

// Lifecycle management
onMounted(() => {
  subscribeToEvents()
})

onUnmounted(() => {
  if (eventController) {
    eventController.abort()
  }
})


</script>

<style scoped>
/* 文件侧边栏滑动动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

/* 应用整体加载动画 */
.app-fade-enter-active {
  transition: all 0.6s ease-out;
}

.app-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* 头部按钮hover效果 */
.header-button {
  transition: all 0.2s ease;
}

.header-button:hover {
  transform: scale(1.1);
  background-color: rgba(var(--primary), 0.1);
}
</style>