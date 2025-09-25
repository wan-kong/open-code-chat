<template>
    <div class="border-t bg-background p-4">
        <div class="flex gap-2">
            <Textarea v-model="newMessage" placeholder="输入您的消息..." class="flex-1 min-h-[44px] max-h-32 resize-none"
                @keydown.enter.exact.prevent="handleSendMessage" @keydown.enter.shift.exact.prevent="newMessage += '\n'"
                :disabled="isLoading" />
            <Button @click="handleSendMessage" :disabled="!newMessage.trim() || isLoading">
                <Send class="h-4 w-4" />
            </Button>
        </div>
        <div class="text-xs text-muted-foreground mt-2">
            按 Enter 发送，Shift + Enter 换行
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Props {
    isLoading?: boolean
}

interface Emits {
    sendMessage: [content: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const newMessage = ref('')

const handleSendMessage = () => {
    if (newMessage.value.trim()) {
        emit('sendMessage', newMessage.value.trim())
        newMessage.value = ''
    }
}
</script>
