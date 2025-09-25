<script setup lang="ts">
import type { PopoverCloseProps } from "reka-ui"
import { PopoverClose } from "reka-ui"

const props = defineProps<PopoverCloseProps>()
</script>

<template>
    <PopoverClose v-bind="props">
        <slot />
    </PopoverClose>
</template>
