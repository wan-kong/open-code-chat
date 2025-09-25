<template>
    <div class="relative w-full shadow-md backdrop-blur-sm rounded-md">
        <!-- 主输入区域 -->
        <Textarea v-model="newMessage" ref="textareaRef" :placeholder="placeholder" @input="handleInput"
            @keydown="handleKeydown"
            class="min-h-20 transition-all duration-200 resize-none focus:ring-2 focus:ring-primary/20"></Textarea>
        <div class="absolute right-2 bottom-2">
            <Button :disabled="!canSend || isLoading" size="sm" variant="default" @click="handleSendMessage"
                class="transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100">
                <Transition name="icon" mode="out-in">
                    <div v-if="isLoading" class="animate-spin">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                    <SendIcon v-else :size="16" />
                </Transition>
                <span class="ml-1">{{ isLoading ? 'Sending...' : 'Enter' }}</span>
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

<style scoped>
/* 图标过渡动画 */
.icon-enter-active,
.icon-leave-active {
    transition: all 0.2s ease;
}

.icon-enter-from,
.icon-leave-to {
    opacity: 0;
    transform: scale(0.8) rotate(180deg);
}

.icon-enter-to,
.icon-leave-from {
    opacity: 1;
    transform: scale(1) rotate(0deg);
}

/* 自定义loading spinner */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
