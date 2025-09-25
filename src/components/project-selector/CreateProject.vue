<template>
    <div class="p-1">
        <Button @click="handleCreate" variant="outline" size="sm"
            class="w-full justify-start gap-2 border-dashed hover:bg-primary/10">
            <PlusIcon class="w-4 h-4" />
            New Project
        </Button>
    </div>
</template>

<script setup lang="ts" name="CreateProject">

import { Plus as PlusIcon } from 'lucide-vue-next'
import { Button } from '../ui/button';
const handleCreate = () => {
    console.log('create project')
}
</script>
