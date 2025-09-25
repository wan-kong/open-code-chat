<template>
    <div class="mx-auto mb-4 relative max-w-2xl shadow-md backdrop-blur-sm rounded-md">
        <!-- 主输入区域 -->
        <Textarea v-model="newMessage" ref="textareaRef" placeholder="work with opencode... " @input="handleInput"
            @keydown="handleKeydown" class="min-h-20"></Textarea>
        <div class="absolute right-2 bottom-2">
            <Button :disabled="isLoading" variant="default" @click="handleSendMessage">
                <SendIcon :size="16"></SendIcon>
                <span>Enter</span>
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { SendIcon } from 'lucide-vue-next'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Props {
    isLoading?: boolean
    placeholder?: string
}

interface Emits {
    sendMessage: [content: string]
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    placeholder: '输入您的消息...'
})

const emit = defineEmits<Emits>()

// 状态管理
const newMessage = ref('')
const textareaRef = ref<InstanceType<typeof Textarea>>()

// 自适应高度功能
const adjustHeight = () => {
    const textarea = textareaRef.value?.$el
    if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px' // max-h-32 = 8rem = 128px
    }
}

// 计算属性
const canSend = computed(() => {
    const trimmed = newMessage.value.trim()
    return trimmed.length > 0 && !props.isLoading
})

// 方法
const handleSendMessage = async () => {
    if (!canSend.value) return

    const message = newMessage.value.trim()
    newMessage.value = ''
    emit('sendMessage', message)

    // 发送后重新聚焦到输入框
    await nextTick()
    textareaRef.value?.$el?.focus()
}

const handleInput = () => {
    // 自适应高度
    nextTick(() => {
        adjustHeight()
    })
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift+Enter: 换行，使用默认行为
            return
        } else {
            // Enter: 发送消息
            event.preventDefault()
            handleSendMessage()
        }
    }
}
</script>
