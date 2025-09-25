import type { MessageData, ChatItemData } from "@/services/opencode"
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

  for (const item of chatItems) {
    if ('permission' in item) {
      // Permission独立显示，不合并
      result.push(item)
    } else {
      // 处理MessageData的合并逻辑
      const messageData = item as MessageData
      const { info, parts } = messageData

      if (result.length > 0) {
        const lastItem = result[result.length - 1]!
        // 只有当最后一项也是message且role相同时才合并
        if ('info' in lastItem && info.role === 'assistant' && lastItem.info.role === info.role) {
          lastItem.parts.push(...parts)
        } else {
          result.push(messageData)
        }
      } else {
        result.push(messageData)
      }
    }
  }

  return result
}