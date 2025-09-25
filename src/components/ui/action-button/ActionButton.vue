<template>
    <button :class="buttonClasses" :title="tooltip" v-bind="$attrs">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
    variant?: 'default' | 'primary' | 'danger' | 'info'
    size?: 'sm' | 'md' | 'lg'
    tooltip?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
    disabled: false
})

// Size variants
const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
}

// Style variants
const variantClasses = {
    default: 'hover:bg-accent focus:bg-accent text-muted-foreground hover:text-foreground focus:text-foreground',
    primary: 'hover:bg-primary focus:bg-primary hover:text-primary-foreground focus:text-primary-foreground text-muted-foreground',
    danger: 'hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 text-muted-foreground',
    info: 'hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-600 focus:text-blue-600 text-muted-foreground'
}

const buttonClasses = computed(() => {
    return cn(
        // Base classes
        'rounded flex items-center justify-center transition-colors focus:outline-none cursor-pointer',
        // Size classes
        sizeClasses[props.size],
        // Variant classes
        variantClasses[props.variant],
        // Disabled state
        props.disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
    )
})

// Disable attribute inheritance to avoid duplicate class application
defineOptions({
    inheritAttrs: false
})
</script>
