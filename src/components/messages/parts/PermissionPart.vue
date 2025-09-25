<template>
    <div class="max-w-xl bg-background border rounded-lg p-3 shadow-sm mx-auto ">
        <div class="flex items-center gap-2 mb-2">
            <ShieldIcon class="w-4 h-4 text-orange-500" />
            <span class="text-sm font-medium">权限请求
            </span>
            <Badge>
                {{ permission.type }}
            </Badge>
        </div>
        <div class="text-xs text-muted-foreground mb-3">
            <span class="font-medium text-foreground">{{ permission.title }}</span> → {{ permission.pattern }}
        </div>

        <div class="flex gap-1">
            <Button @click="respondToPermission('reject')" :disabled="isResponding" size="sm" variant="outline"
                class="flex-1 h-7 text-xs">
                <XIcon class="w-3 h-3 mr-1" />
                拒绝
            </Button>
            <Button @click="respondToPermission('always')" :disabled="isResponding" size="sm" variant="outline"
                class="flex-1 h-7 text-xs">
                <CheckIcon class="w-3 h-3 mr-1" />
                总是允许
            </Button>
            <Button @click="respondToPermission('once')" :disabled="isResponding" size="sm" variant="default"
                class="flex-1 h-7 text-xs">
                <ClockIcon class="w-3 h-3 mr-1" />
                允许一次
            </Button>
        </div>

        <div v-if="isResponding" class="flex items-center justify-center mt-2 text-xs text-muted-foreground">
            <div class="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                <div class="animate-spin rounded-full h-3 w-3 border-b border-primary mr-1"></div>
                处理中...
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon, ShieldIcon, XIcon, ClockIcon } from 'lucide-vue-next'
import type { Permission } from '@opencode-ai/sdk'
import { openCodeClient } from '@/services/opencode'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
    permission: Permission
}

const props = defineProps<Props>()

const isResponding = ref(false)

const respondToPermission = async (response: 'once' | 'always' | 'reject') => {
    if (isResponding.value) return
    isResponding.value = true
    openCodeClient.postSessionIdPermissionsPermissionId({
        path: {
            id: props.permission.sessionID,
            permissionID: props.permission.id
        },
        body: {
            response
        }
    }).finally(() => {
        isResponding.value = false
    })
}

</script>
