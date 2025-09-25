<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" class="h-8 w-8 relative" :disabled="isLoading">
                <Wrench class="h-4 w-4" />
                <span class="sr-only">工具列表</span>
                <Badge v-if="tools?.length"
                    class="absolute -top-1 -right-1 h-4 w-4 text-[10px] p-0 flex items-center justify-center min-w-[16px]"
                    variant="secondary">
                    {{ tools.length > 99 ? '99+' : tools.length }}
                </Badge>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[280px] p-0" align="start" :sideOffset="4">
            <div class="flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between p-3 pb-2 border-b border-border/40">
                    <div class="flex items-center gap-2">
                        <Wrench class="h-3.5 w-3.5 text-muted-foreground" />
                        <h4 class="font-medium text-sm">可用工具</h4>
                    </div>
                    <Badge variant="outline" class="text-xs h-4 px-1.5">
                        {{ tools?.length || 0 }}
                    </Badge>
                </div>

                <!-- Content -->
                <div class="flex-1">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="p-3 space-y-2">
                        <div v-for="i in 3" :key="i" class="flex items-start gap-2">
                            <div class="flex-1 space-y-1.5">
                                <Skeleton class="h-3.5 w-[60%]" />
                                <Skeleton class="h-3 w-[80%]" />
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="p-3 text-center">
                        <div class="mb-2">
                            <div class="h-8 w-8 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                                <AlertCircle class="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p class="text-xs text-muted-foreground mb-1">加载失败</p>
                        </div>
                        <Button variant="outline" size="sm" @click="loadTools">
                            <RotateCcw class="h-3 w-3 mr-1" />
                            重试
                        </Button>
                    </div>

                    <!-- Tools List -->
                    <div v-else-if="tools?.length" class="max-h-[240px] overflow-y-auto">
                        <div class="p-1">
                            <div v-for="tool in tools" :key="tool.id"
                                class="flex items-start gap-2 p-2.5 rounded-md hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-border/40">
                                <div class="flex-1 min-w-0">
                                    <p class="font-medium text-sm text-foreground mb-0.5 truncate">
                                        {{ tool.id }}
                                    </p>
                                    <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {{ tool.description || '暂无描述信息' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="p-4 text-center">
                        <div class="mb-3">
                            <div class="h-12 w-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                                <Wrench class="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 class="font-medium text-sm text-foreground mb-1">暂无工具</h3>
                            <p class="text-xs text-muted-foreground">当前配置下没有可用的工具</p>
                        </div>
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts" name="ToolList">
import { ref, onMounted } from 'vue'
import { Wrench, AlertCircle, RotateCcw } from 'lucide-vue-next'
import { openCodeClient } from '@/services/opencode'
import type { ToolListItem } from '@opencode-ai/sdk'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

const tools = ref<ToolListItem[]>([])
const isLoading = ref(false)
const error = ref(false)

const loadTools = async () => {
    isLoading.value = true
    error.value = false

    try {
        // 获取配置信息以获取provider和model
        const config = await openCodeClient.config.get()

        // 使用默认的provider和model，或者从配置中获取
        const defaultProvider = Object.keys(config.data?.provider || {})[0] || 'anthropic'
        const defaultModel = config.data?.model?.split('/')[1] || 'claude-3-5-sonnet-20241022'

        const result = await openCodeClient.tool.list({
            query: {
                provider: defaultProvider,
                model: defaultModel
            }
        })

        tools.value = result.data || []
    } catch (err) {
        console.error('Failed to load tools:', err)
        error.value = true
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadTools()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>