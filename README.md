# Open Code Chat

一个基于 Vue 3 + TypeScript 构建的多项目、多会话聊天界面，用于与 OpenCode AI 进行交互。

## 功能特性

- 🎯 **多项目支持** - 在不同的代码项目间切换
- 💬 **多会话管理** - 为每个项目创建和管理多个聊天会话
- ⚡ **实时消息** - 基于事件流的实时消息更新
- 🔧 **权限管理** - 集成 OpenCode 权限请求处理
- 🎨 **现代UI** - 使用 shadcn-vue 组件库构建的优雅界面
- 📱 **响应式设计** - 适配不同屏幕尺寸的侧边栏布局

## 技术栈

- **前端框架**: Vue 3 + Composition API + TypeScript
- **构建工具**: Vite 6.x
- **样式方案**: Tailwind CSS 4.x
- **UI组件**: shadcn-vue (Reka UI)
- **API集成**: @opencode-ai/sdk
- **包管理器**: pnpm

## OPENCODE

1. OPENCODE构建后的结果是一个二进制的包，但是其仍然依赖node.js的环境，在使用一些模型/Tool时，仍然需要install对应的package。
2. OPENCODE是带有部分联网操作的（share）.
3. OPENCODE可以指定配置文件 `export OPENCODE_CONFIG=/path/to/my/custom-config.json`
4. SDK提供了create server 和 create client. createServer也可以传入配置文件，不过实际上执行的还是 spawn('opencode','serve',...args)
5. 自定义工具：pwd .opencode/tool目录下，使用ts来定义工具

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9.15.9

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

**重要**: 需要同时启动前端和 OpenCode 服务器

```bash
# 启动 OpenCode 服务器 (必需，端口 4096)
pnpm opencode

# 新终端窗口启动前端开发服务器
pnpm dev
```

### 生产构建

```bash
# 构建项目 (包含类型检查)
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
src/
├── components/
│   ├── messages/          # 消息显示和输入组件
│   │   ├── MessageList.vue
│   │   ├── MessageInput.vue
│   │   └── parts/         # 消息部分渲染器
│   ├── project-selector/  # 项目管理组件
│   ├── session-selector/  # 会话管理组件
│   └── ui/               # 可复用UI组件 (shadcn-vue)
├── services/
│   └── opencode.ts       # OpenCode API客户端
├── types/
│   └── index.ts          # TypeScript类型定义
└── lib/
    └── utils.ts          # 工具函数
```

## 配置说明

### OpenCode 服务配置

应用通过环境变量 `VITE_OPENCODE_URL` 连接到 OpenCode 服务器，默认为 `http://127.0.0.1:4096`。

### 权限配置

OpenCode 权限配置位于 `opencode.json` 文件中。

## 核心功能

### 项目管理

- 自动加载 OpenCode 项目列表
- 支持项目切换，显示项目工作目录

### 会话管理

- 创建、删除、重命名聊天会话
- 会话持久化存储
- 自动加载历史消息

### 消息处理

- 支持文本、文件、补丁等多种消息类型
- 实时消息流处理
- 消息合并和分组显示

### 实时更新

基于 OpenCode SDK 的事件订阅系统：

- `message.updated` - 消息更新
- `message.part.updated` - 消息部分更新
- `permission.updated` - 权限请求更新

## 开发指南

### 组件开发规范

1. 使用 Vue 3 Composition API
2. 功能组件放置在对应特性目录下
3. 通用组件放置在 `ui/` 目录
4. 遵循现有的 TypeScript 类型定义

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 Vue 3 最佳实践
- 组件采用 SFC (Single File Component) 格式

## 环境变量

| 变量名              | 默认值                  | 说明                |
| ------------------- | ----------------------- | ------------------- |
| `VITE_OPENCODE_URL` | `http://127.0.0.1:4096` | OpenCode 服务器地址 |

## 故障排除

### 常见问题

1. **前端无法连接到 OpenCode**
   - 确保 `pnpm opencode` 已启动
   - 检查端口 4096 是否被占用
   - 验证 `VITE_OPENCODE_URL` 配置

2. **依赖安装失败**
   - 确保使用 pnpm 而非 npm
   - 清理缓存: `pnpm store prune`

3. **TypeScript 错误**
   - 运行 `pnpm build` 检查类型错误
   - 确保所有依赖版本兼容

## 许可证

Private Project

## 贡献

本项目为私有项目，请按照团队开发规范进行贡献。
