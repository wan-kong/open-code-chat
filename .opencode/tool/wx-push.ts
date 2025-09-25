import { tool } from '@opencode-ai/plugin'

export default tool({
    description: "推送消息到企业微信中。",
    args: {
        content: tool.schema.string().describe("消息内容")
    },
    execute: async ({ content }, context) => {
        const wxPushKey = process.env.WX_PUSH_KEY
        fetch(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${wxPushKey}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                msgtype: "text",
                text: {
                    content
                }
            })
        })
        return "消息推送成功"
    }
})