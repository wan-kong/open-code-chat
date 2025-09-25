import { createOpencodeServer } from '@opencode-ai/sdk'
import { configDotenv } from 'dotenv'

configDotenv({
    override: false
})

// console.log('process.env', process.env)
createOpencodeServer({
    hostname: "127.0.0.1",
    port: process.env.OPENCODE_PORT || 4096,
    config: {
        permission: {
            edit: "ask",
            'webfetch': "ask",
            bash: "ask",
            'wx-push': "ask"
        },
        share: "disabled",
        autoshare: false,
        model: "deepseek/deepseek-chat",
        provider: {
            'deepseek': {
                options: {
                    baseURL: "https://api.deepseek.com",
                    "apiKey": process.env.DEEPSEEK_API_KEY,
                }
            }
        },
    }
}).then((server) => {
    console.log(`Server running at ${server.url}`)
})

// spawn('opencode',['serve'])