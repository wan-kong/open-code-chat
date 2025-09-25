<template>
    <SidebarMenuItem>
        <SidebarMenuButton :is-active="isActive" @click="$emit('select', session)"
            :class="['group relative', isActive && 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-none']">
            <MessageSquare class="mr-2 h-4 w-4" />
            <span class="truncate flex-1">{{ sessionTitle }}</span>

            <!-- Action buttons -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                <!-- Edit Dialog -->
                <Dialog v-model:open="isEditing">
                    <DialogTrigger as-child>
                        <ActionButton @click.stop variant="default" size="md" tooltip="编辑会话">
                            <Edit class="h-3 w-3" />
                        </ActionButton>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>编辑会话</DialogTitle>
                            <DialogDescription>
                                修改会话的标题
                            </DialogDescription>
                        </DialogHeader>
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <Input v-model="editTitle" placeholder="输入会话标题" @keyup.enter="handleSaveEdit"
                                    ref="editInput" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" @click="handleCancelEdit">
                                取消
                            </Button>
                            <Button type="button" @click="handleSaveEdit">
                                保存
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <!-- Delete Popover -->
                <Popover>
                    <PopoverTrigger as-child>
                        <ActionButton @click.stop variant="danger" size="md" tooltip="删除会话">
                            <Trash2 class="h-3 w-3" />
                        </ActionButton>
                    </PopoverTrigger>
                    <PopoverContent class="w-80 p-4" side="right" align="start">
                        <div class="space-y-3">
                            <div>
                                <h4 class="font-medium text-sm">确认删除</h4>
                                <p class="text-sm text-muted-foreground mt-1">
                                    确定要删除会话 "{{ sessionTitle }}" 吗？此操作无法撤销。
                                </p>
                            </div>
                            <div class="flex gap-2 justify-end">
                                <PopoverClose as-child>
                                    <Button variant="outline" size="sm">取消</Button>
                                </PopoverClose>
                                <PopoverClose as-child>
                                    <Button variant="destructive" size="sm" @click="handleConfirmDelete">
                                        删除
                                    </Button>
                                </PopoverClose>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </SidebarMenuButton>
    </SidebarMenuItem>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { MessageSquare, Edit, Trash2 } from 'lucide-vue-next'
import type { Session } from '@opencode-ai/sdk'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ActionButton } from '@/components/ui/action-button'

interface Props {
    session: Session
    isActive?: boolean
}

interface Emits {
    select: [session: Session]
    delete: [session: Session]
    update: [session: Session, newTitle: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const editTitle = ref('')
const editInput = ref<InstanceType<typeof Input>>()

const sessionTitle = computed(() => {
    return props.session.title || `会话 ${props.session.id.slice(0, 8)}`
})

// Watch for dialog opening to set initial values and focus
watch(isEditing, (newValue) => {
    if (newValue) {
        editTitle.value = props.session.title || ''
        nextTick(() => {
            editInput.value?.$el?.focus()
        })
    }
})

const handleSaveEdit = () => {
    if (editTitle.value.trim() && editTitle.value !== props.session.title) {
        emit('update', props.session, editTitle.value.trim())
    }
    isEditing.value = false
}

const handleCancelEdit = () => {
    isEditing.value = false
    editTitle.value = ''
}

const handleConfirmDelete = () => {
    emit('delete', props.session)
}
</script>
