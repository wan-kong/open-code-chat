import type { Project } from '@opencode-ai/sdk'

/**
 * 获取项目显示名称（从路径提取文件夹名）
 */
export function getProjectDisplayName(project: Project | null): string {
    if (!project) return ''
    const parts = project.worktree.split('/')
    return parts[parts.length - 1] || project.worktree || 'ROOT PROJECT'
}

/**
 * 获取项目路径（显示相对简短路径）
 */
export function getProjectPath(project: Project): string {
    const parts = project.worktree.split('/')
    if (parts.length > 3) {
        return `.../${parts.slice(-2).join('/')}`
    }
    return project.worktree
}

/**
 * 获取项目状态颜色
 */
export function getProjectStatusColor(project: Project | null): string {
    if (!project) return 'bg-muted'

    if (project.time.initialized) {
        return 'bg-green-500' // 已初始化 - 绿色
    } else if (project.vcs) {
        return 'bg-orange-500' // 有VCS但未初始化 - 橙色
    } else {
        return 'bg-gray-500' // 新建项目 - 灰色
    }
}
