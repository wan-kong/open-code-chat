<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" class="h-8 w-8" :disabled="isLoading">
                <Settings class="h-4 w-4" />
                <span class="sr-only">模型配置</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80 p-0" align="start" :sideOffset="4">
            <div class="flex flex-col">
                <div class="px-4 py-3 border-b">
                    <h3 class="font-semibold text-sm">模型配置</h3>
                    <p class="text-xs text-muted-foreground">当前可用的模型提供商</p>
                </div>

                <div class="p-2 max-h-96 overflow-y-auto">
                    <div v-if="isLoading" class="flex items-center justify-center py-8">
                        <div class="text-sm text-muted-foreground">加载中...</div>
                    </div>

                    <div v-else-if="providers.length === 0" class="flex items-center justify-center py-8">
                        <div class="text-sm text-muted-foreground">暂无可用的模型提供商</div>
                    </div>

                    <div v-else class="space-y-2">
                        <div v-for="provider in providers" :key="provider.id"
                            class="rounded-lg border bg-card overflow-hidden">
                            <!-- Provider Header -->
                            <button @click="toggleProvider(provider.id)"
                                class="w-full p-3 text-left hover:bg-accent/50 transition-colors flex items-center gap-2">
                                <component :is="isExpanded(provider.id) ? ChevronDown : ChevronRight"
                                    class="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h4 class="font-medium text-sm truncate">{{ provider.name }}</h4>
                                        <Badge v-if="isDefaultProvider(provider)" variant="secondary" class="text-xs">
                                            默认
                                        </Badge>
                                        <Badge variant="outline" class="text-xs ml-auto">
                                            {{ getModelsList(provider.models).length }} 个模型
                                        </Badge>
                                    </div>
                                    <p class="text-xs text-muted-foreground">
                                        ID: {{ provider.id }}
                                    </p>
                                </div>
                            </button>

                            <!-- Models List (Collapsible) -->
                            <div v-if="isExpanded(provider.id) && getModelsList(provider.models).length > 0"
                                class="border-t bg-muted/30">
                                <div class="p-3 space-y-2">
                                    <div class="text-xs text-muted-foreground mb-2 font-medium">可用模型:</div>
                                    <div class="grid gap-2">
                                        <div v-for="model in getModelsList(provider.models)" :key="model.id"
                                            class="flex items-center justify-between p-2 rounded bg-background border border-border/50">
                                            <div class="flex-1 min-w-0">
                                                <div class="font-medium text-sm truncate">{{ model.name }}</div>
                                                <div class="text-xs text-muted-foreground">{{ model.id }}</div>
                                            </div>
                                            <div class="flex gap-1 ml-2">
                                                <Badge variant="outline" class="text-xs">模型</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State for Models -->
                            <div v-else-if="isExpanded(provider.id) && getModelsList(provider.models).length === 0"
                                class="border-t bg-muted/30 p-3">
                                <div class="text-xs text-muted-foreground text-center">该提供商暂无可用模型</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts" name="ModelConfig">
import { ref, onMounted } from 'vue'
import { Settings, ChevronDown, ChevronRight } from 'lucide-vue-next'
import { openCodeClient } from '@/services/opencode'
import type { Provider } from '@opencode-ai/sdk'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

// State
const providers = ref<Provider[]>([])
const defaultProviders = ref<Record<string, string>>({})
const isLoading = ref(true)
const expandedProviders = ref<Set<string>>(new Set())

// Computed
const isDefaultProvider = (provider: Provider) => {
    return Object.values(defaultProviders.value).includes(provider.id)
}

const getModelsList = (models: Provider['models']) => {
    if (!models) return []
    return Object.values(models)
}

const toggleProvider = (providerId: string) => {
    if (expandedProviders.value.has(providerId)) {
        expandedProviders.value.delete(providerId)
    } else {
        expandedProviders.value.add(providerId)
    }
}

const isExpanded = (providerId: string) => {
    return expandedProviders.value.has(providerId)
}

const loadProviders = async () => {
    try {
        isLoading.value = true
        const { data } = await openCodeClient.config.providers()

        providers.value = data?.providers ?? []
        defaultProviders.value = data?.default ?? {}
    } catch (error) {
        console.error('Failed to load providers:', error)
    } finally {
        isLoading.value = false
    }
}


onMounted(() => {
    loadProviders()
})
</script>