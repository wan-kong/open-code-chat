import type { ChatItemData } from "@/services/opencode"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const randomUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}


/**
 * 根据role(assistant)来合并Message，保持Permission等其他类型不变
 * @param chatItems 
 * @returns 
 */
export const mergeMessage = (chatItems: ChatItemData[]): ChatItemData[] => {
  const result: ChatItemData[] = []
  const data = JSON.parse(JSON.stringify(chatItems))
  for (const item of data) {
    if ('permission' in item || item.info.role === 'user') {
      // Permission和user消息独立显示，不合并
      result.push(item)
    } else {
      // assistant消息：检查上一条是否也是assistant，如果是则合并parts
      const lastItem = result[result.length - 1]
      if (lastItem &&
        'info' in lastItem &&
        lastItem.info.role === 'assistant') {
        // 合并到上一条assistant消息
        lastItem.parts.push(...item.parts)
      } else {
        // 新的assistant消息
        result.push(item)
      }
    }
  }

  return result
}