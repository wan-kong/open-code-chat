import { createOpencodeClient, type Message, type Part, type Permission } from '@opencode-ai/sdk'


const openCodeClient = createOpencodeClient({
  baseUrl: import.meta.env.VITE_OPENCODE_URL || "http://127.0.0.1:4096",

})

export {
  openCodeClient
}


// Messages state
export interface MessageData {
  info: Message
  parts: Part[]
}

// Permission message data
export interface PermissionData {
  permission: Permission
}

// Union type for all message types
export type ChatItemData = MessageData | PermissionData