<template>
    <div class="permission-part">
        <div class="border rounded-lg p-3 bg-card shadow-sm">
            <!-- Header: Icon + Title + Type Badge -->
            <div class="flex items-start gap-3 mb-3">
                <div
                    class="flex items-center justify-center w-7 h-7 rounded-md bg-orange-100 border border-orange-200/60 dark:bg-orange-900/30 dark:border-orange-800/50 shrink-0 mt-0.5">
                    <ShieldCheckIcon class="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-sm font-medium text-foreground">权限请求</h4>
                        <Badge variant="secondary" class="text-xs px-1.5 py-0.5 h-auto">
                            {{ permission.type }}
                        </Badge>
                    </div>
                    <p class="text-xs text-muted-foreground leading-relaxed">{{ permission.title }}</p>
                </div>
            </div>

            <!-- Pattern (if exists) -->
            <div v-if="permission.pattern" class="mb-3 p-2 bg-muted/50 rounded-md border">
                <div class="text-xs text-muted-foreground mb-1">访问模式</div>
                <code class="text-xs font-mono text-foreground">{{ formatPattern(permission.pattern) }}</code>
            </div>

            <!-- Action Buttons with Clear Hierarchy -->
            <div class="flex flex-col sm:flex-row gap-2 mb-3">
                <!-- Primary Action: Allow Once (most common case) -->
                <Button @click="respondToPermission('once')" :disabled="isResponding" variant="default" size="sm"
                    class="flex-1 relative min-h-[36px] order-1">
                    <CheckIcon v-if="!isResponding" class="h-3.5 w-3.5 mr-1.5" />
                    <div v-if="isResponding" class="absolute inset-0 flex items-center justify-center">
                        <div
                            class="h-3.5 w-3.5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                    </div>
                    <span :class="{ 'opacity-0': isResponding }">
                        <span class="hidden sm:inline">仅此一次</span>
                        <span class="sm:hidden">允许一次</span>
                    </span>
                </Button>

                <!-- Secondary Actions -->
                <div class="flex gap-2 flex-1 sm:flex-none sm:order-2">
                    <Button @click="respondToPermission('always')" :disabled="isResponding" variant="secondary"
                        size="sm" class="flex-1 sm:w-auto min-h-[36px]">
                        <ShieldIcon class="h-3.5 w-3.5 mr-1.5" />
                        <span class="hidden sm:inline">总是允许</span>
                        <span class="sm:hidden">总是</span>
                    </Button>

                    <Button @click="respondToPermission('reject')" :disabled="isResponding" variant="outline" size="sm"
                        class="flex-1 sm:w-auto min-h-[36px] hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive dark:hover:bg-destructive/10">
                        <XIcon class="h-3.5 w-3.5 mr-1.5" />
                        拒绝
                    </Button>
                </div>
            </div>

            <!-- Metadata (Collapsible) -->
            <div v-if="Object.keys(permission.metadata).length > 0" class="mb-2 pt-2 border-t">
                <details class="group">
                    <summary
                        class="text-xs text-muted-foreground cursor-pointer hover:text-foreground font-medium flex items-center gap-1.5 transition-colors">
                        <ChevronRightIcon class="h-3 w-3 transition-transform group-open:rotate-90" />
                        详细信息
                    </summary>
                    <pre
                        class="text-xs text-muted-foreground mt-2 whitespace-pre-wrap font-mono bg-muted/30 p-2 rounded border overflow-x-auto">{{ JSON.stringify(permission.metadata, null, 2) }}</pre>
                </details>
            </div>

            <!-- Timestamp -->
            <div class="text-xs text-muted-foreground/70 font-mono">
                {{ formatTime(permission.time.created) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheckIcon, CheckIcon, ShieldIcon, XIcon, ChevronRightIcon } from 'lucide-vue-next'
import type { Permission } from '@opencode-ai/sdk'
import { openCodeClient } from '@/services/opencode'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
    permission: Permission
}

const props = defineProps<Props>()

const isResponding = ref(false)

const respondToPermission = async (response: 'once' | 'always' | 'reject') => {
    if (isResponding.value) return

    isResponding.value = true
    try {
        await openCodeClient.postSessionIdPermissionsPermissionId({
            path: {
                id: props.permission.sessionID,
                permissionID: props.permission.id
            },
            body: {
                response
            }
        })
        // Success feedback could be added here via emit or global state
    } catch (error) {
        console.error('Failed to respond to permission:', error)
        // TODO: Show error toast
        // For now, just log the error and keep UI responsive
        isResponding.value = false
        throw error // Re-throw to let parent handle if needed
    } finally {
        // Only reset if no error occurred
        if (isResponding.value) {
            isResponding.value = false
        }
    }
}

const formatPattern = (pattern: string | string[]) => {
    if (Array.isArray(pattern)) {
        return pattern.join(', ')
    }
    return pattern
}

const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}
</script>
