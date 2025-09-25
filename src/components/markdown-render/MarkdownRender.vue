<template>
    <div class="markdown-container">
        <VueMarkdown :markdown="markdown" :custom-attrs="customAttrs" :remark-plugins="remarkPlugins"
            :rehype-plugins="rehypePlugins" sanitize>
            <!-- Headings -->
            <template #h1="{ children }">
                <h1
                    class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 border-b border-border pb-2">
                    <component :is="children" />
                </h1>
            </template>

            <template #h2="{ children }">
                <h2
                    class="scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight mb-4 mt-8 first:mt-0">
                    <component :is="children" />
                </h2>
            </template>

            <template #h3="{ children }">
                <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">
                    <component :is="children" />
                </h3>
            </template>

            <template #h4="{ children }">
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-4">
                    <component :is="children" />
                </h4>
            </template>

            <template #h5="{ children }">
                <h5 class="scroll-m-20 text-lg font-semibold tracking-tight mb-2 mt-4">
                    <component :is="children" />
                </h5>
            </template>

            <template #h6="{ children }">
                <h6 class="scroll-m-20 text-base font-semibold tracking-tight mb-2 mt-4">
                    <component :is="children" />
                </h6>
            </template>

            <!-- Paragraph -->
            <template #p="{ children }">
                <p class="leading-7 [&:not(:first-child)]:mt-6 text-foreground">
                    <component :is="children" />
                </p>
            </template>

            <!-- Links -->
            <template #a="{ children, href }">
                <a :href="href"
                    class="font-medium text-primary underline underline-offset-4 hover:no-underline transition-all"
                    target="_blank" rel="noopener noreferrer">
                    <component :is="children" />
                </a>
            </template>

            <!-- Lists -->
            <template #ul="{ children }">
                <ul class="my-2 ml-6 list-disc [&>li]:mt-2">
                    <component :is="children" />
                </ul>
            </template>

            <template #ol="{ children }">
                <ol class="my-2 ml-6 list-decimal [&>li]:mt-2">
                    <component :is="children" />
                </ol>
            </template>

            <template #li="{ children }">
                <li class="leading-7">
                    <component :is="children" />
                </li>
            </template>

            <!-- Code blocks -->
            <template #block-code="{ language, content }">
                <div class="relative my-6">
                    <pre class="overflow-x-auto rounded-lg border border-border bg-muted p-4">
                        <code :class="`language-${language || 'text'}`" class="text-sm font-mono">{{ content }}</code>
                    </pre>
                    <div v-if="language"
                        class="absolute top-2 right-2 text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded border">
                        {{ language }}
                    </div>
                </div>
            </template>

            <!-- Inline code -->
            <template #inline-code="{ children }">
                <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    <component :is="children" />
                </code>
            </template>

            <!-- Blockquote -->
            <template #blockquote="{ children }">
                <blockquote class="mt-6 border-l-2 border-primary pl-6 italic">
                    <component :is="children" />
                </blockquote>
            </template>

            <!-- Tables -->
            <template #table="{ children }">
                <div class="my-6 w-full overflow-y-auto">
                    <table class="w-full border-collapse border border-border">
                        <component :is="children" />
                    </table>
                </div>
            </template>

            <template #thead="{ children }">
                <thead class="bg-muted/50">
                    <component :is="children" />
                </thead>
            </template>

            <template #tbody="{ children }">
                <tbody>
                    <component :is="children" />
                </tbody>
            </template>

            <template #tr="{ children }">
                <tr class="border-b border-border">
                    <component :is="children" />
                </tr>
            </template>

            <template #th="{ children }">
                <th
                    class="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    <component :is="children" />
                </th>
            </template>

            <template #td="{ children }">
                <td class="border border-border px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right">
                    <component :is="children" />
                </td>
            </template>

            <!-- Horizontal rule -->
            <template #hr>
                <hr class="my-8 border-border" />
            </template>

            <!-- Strong and emphasis -->
            <template #strong="{ children }">
                <strong class="font-semibold">
                    <component :is="children" />
                </strong>
            </template>

            <template #em="{ children }">
                <em class="italic">
                    <component :is="children" />
                </em>
            </template>

            <!-- Images -->
            <template #img="{ src, alt, title }">
                <img :src="src" :alt="alt" :title="title"
                    class="max-w-full h-auto rounded-lg border border-border my-4" />
            </template>
        </VueMarkdown>
    </div>
</template>

<script setup lang="ts" name="MarkdownRender">
import { VueMarkdown } from '@crazydos/vue-markdown';
import type { PluggableList } from 'unified';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Props {
    markdown: string;
}

defineProps<Props>();

// Remark plugins for extended markdown support
const remarkPlugins: PluggableList = [
    [remarkGfm, {
        // GitHub Flavored Markdown support
        singleTilde: false,
    }]
];

// Rehype plugins for HTML processing
const rehypePlugins: PluggableList = [
    [rehypeRaw, {
        // Allow raw HTML in markdown
        passThrough: ['element']
    }]
];

// Custom attributes for elements
const customAttrs = {
    // Add custom classes to elements if needed
    div: {
        class: 'markdown-content'
    }
};
</script>

<style scoped>
.markdown-container {
    color: hsl(var(--foreground));
    line-height: 1.6;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Code syntax highlighting placeholder */
.markdown-container :deep(code[class*="language-"]) {
    color: hsl(var(--foreground));
}

/* Smooth scrolling for anchor links */
.markdown-container :deep([id]) {
    scroll-margin-top: 2rem;
}

/* Focus styles for accessibility */
.markdown-container :deep(a:focus),
.markdown-container :deep(button:focus) {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
}
</style>
