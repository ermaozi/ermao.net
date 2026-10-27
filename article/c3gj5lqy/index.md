---
url: /article/c3gj5lqy/index.md
description: >-
  Ollama 本地部署 DeepSeek Coder 教程：区分各系统安装方式，检查模型与内存，通过 Continue config.yaml 连接 VS
  Code，并验证本地接口和 GPU 占用。
---
本文按操作系统安装 Ollama，选择实际存在的 DeepSeek Coder 模型标签，核对内存与 GPU 占用，再通过 Continue 的本地配置连接 VS Code。示例用于本地代码问答与重构；响应时间、补全效果和数据流向仍需按自己的硬件与扩展配置验证。

![本地部署DeepSeek =1350x900](https://image.ermao.net/images/article/c3gj5lqy/image.png)

## 一、为什么选择本地部署代码大模型？

本地模型可在下载完成后用于离线推理，便于控制代码和提示词的处理位置，但不等于“零延迟”或整个工具链绝对私密。速度取决于模型、量化、上下文和硬件；编辑器扩展、云模型、联网工具及遥测仍应单独检查。运行模型也不等于完成微调。相关边界见 [Ollama FAQ](https://docs.ollama.com/faq)。

## 二、环境准备：Ollama安装指南

### 2.1 按操作系统安装

从 [Ollama 官方下载页](https://ollama.com/download)选择对应平台的当前安装方式；下面列出各系统官方指南和安装前检查事项。

| 系统 | 安装入口与检查事项 |
| --- | --- |
| Linux | 按[官方 Linux 指南](https://docs.ollama.com/linux)选择安装脚本或手动安装；运行脚本前先查看内容和权限要求。 |
| macOS | 按[官方 macOS 指南](https://docs.ollama.com/macos)安装 DMG 应用；当前要求 macOS 14 或更新版本，Apple M 系列支持 CPU/GPU，x86 Mac 为 CPU 执行。 |
| Windows | 按[官方 Windows 指南](https://docs.ollama.com/windows)运行 OllamaSetup.exe；当前要求 Windows 10 22H2 或更新版本，通常不需要管理员安装。GPU 支持另核驱动条件。 |

安装并启动应用或服务后检查版本、本地接口：

```bash
ollama -v
curl http://127.0.0.1:11434/api/version
```

手动安装且尚未运行服务时，可在一个终端执行 `ollama serve`，保持该终端运行，在另一个终端继续操作。已经由应用或系统服务启动时，不要重复启动占用同一端口的进程。默认接口绑定本机回环地址，同机编辑器无需将它改成公网监听。

### 2.2 模型下载与网络问题

优先使用 [Ollama 官方模型库](https://ollama.com/library/deepseek-coder)。原文列出的第三方镜像身份及 `~/.ollama/config.json` 中的 `registry.mirrors` 写法没有当前官方配置依据，不再作为可直接执行的方案。

下载失败时先检查模型标签、磁盘空间和具体网络错误。如所在网络确需代理，按 [Ollama FAQ 的代理说明](https://docs.ollama.com/faq#how-do-i-use-ollama-behind-a-proxy)为实际运行的服务配置支持的 `HTTPS_PROXY`；不要把任意镜像域名当作官方来源，也不要关闭 TLS 验证。

## 三、DeepSeek模型部署：硬件适配方案

本文沿用 DeepSeek Coder 作为教学示例，不把它称为最新模型。[官方库中的具体标签](https://ollama.com/library/deepseek-coder:6.7b-instruct-q4_K_M)为 6.74B 参数、Q4\_K\_M 量化，文件约 4.1GB。文件大小不等于运行时所需显存或内存。

```bash
ollama pull deepseek-coder:6.7b-instruct-q4_K_M
ollama list
ollama run deepseek-coder:6.7b-instruct-q4_K_M
```

先在命令行输入一个不含私密代码的问题，确认模型能够回复；退出交互后再连接编辑器。不要仅凭 FP32、FP16、INT8 或 INT4 判断硬件门槛：还要考虑参数量、上下文缓存、并发和运行时开销。模型越大、上下文越长，通常需要更多内存；CPU/GPU 混合执行也会影响速度。

推理时在另一个终端运行：

```bash
ollama ps
```

按 [Ollama 上下文说明](https://docs.ollama.com/context-length)查看 `PROCESSOR` 和 `CONTEXT`，确认实际 GPU/CPU 分配与上下文，不用固定显存表保证某型号电脑可以运行所有 DeepSeek 模型。

## 四、VSCode深度集成指南

### 4.1 客户端现状与 Continue 既有配置

[Continue 官方仓库](https://github.com/continuedev/continue#readme)已说明项目不再积极维护。下面保留已有 Continue 用户的本地配置核对方法，不把它作为持续维护的客户端推荐。

新配置可先查 [Ollama 官方 VS Code 集成指南](https://docs.ollama.com/integrations/vscode)：当前要求 VS Code 1.127 或更新版本，通过该指南进入 Ollama 扩展的 Marketplace 页面；安装后打开 VS Code Chat，在模型选择器的 Ollama 分组选择已经下载的本地模型。默认连接 `http://127.0.0.1:11434`，本地模型无需登录。若模型未显示，先核对 `ollama list`，再使用扩展的 Refresh Models 或 Diagnose Models 命令；聊天、自动补全和工具调用仍需分别验证。

**已有 Continue 用户：**

1. 先核对 [Continue 官方仓库](https://github.com/continuedev/continue#readme)和已安装版本，保留原有配置；不要从来源不明的位置补装 VSIX。
2. 打开 Continue 侧栏，在配置选择器中选本地配置并点击齿轮。按[官方配置指南](https://docs.continue.dev/customize/deep-dives/configuration)，macOS/Linux 文件为 `~/.continue/config.yaml`，Windows 为 `%USERPROFILE%\.continue\config.yaml`。先保留已有配置，再合并所需模型项；不是修改 VS Code 的 `settings.json`。
3. 使用和 `ollama list` 一致的标签，先配置代码问答：

```yaml
name: Local DeepSeek
version: 1.0.0
schema: v1
models:
  - name: DeepSeek Coder Local
    provider: ollama
    model: deepseek-coder:6.7b-instruct-q4_K_M
    apiBase: http://127.0.0.1:11434
    roles:
      - chat
    defaultCompletionOptions:
      contextLength: 4096
```

4. 保存后选择这个模型，用非敏感的短代码验证问答。若配置无法加载，先检查 YAML 缩进；若无法连接，检查本地 API 和模型标签；若内存不足，按 [Continue 的 Ollama 指南](https://docs.continue.dev/customize/model-providers/top-level/ollama)降低上下文或选择较小模型。

以上配置只验证聊天角色。行内自动补全、编辑和 Agent 工具调用的要求不同，需按 [Continue 模型角色配置](https://docs.continue.dev/reference)分别选择适合的模型；不能因聊天成功就保证自动补全或实时错误检测可用。

### 4.2 实战开发场景示例

**场景1：代码生成问答示例**

```python
# 输入注释：
# 使用pandas读取CSV文件，计算各列平均值

# 可能的回答示例，需自行检查和测试：
import pandas as pd

def calculate_averages(file_path):
    df = pd.read_csv(file_path)
    return df.mean(numeric_only=True)
```

**场景2：代码重构建议**

```javascript
// 原始代码
function sum(arr) {
    let total = 0;
    for (let i=0; i<arr.length; i++) {
        total += arr[i];
    }
    return total;
}

// 重构建议示例（应用前核对输入类型和测试）：
const sum = arr => arr.reduce((acc, val) => acc + val, 0);
```

### 4.3 高级调试技巧

可在聊天输入框直接提交解释请求，不把 `/comment` 当作默认可用的内置命令：

```text
请解释这段 TypeScript 泛型的使用场景：
interface Response<T> {
    data: T;
    status: number;
}
```

## 五、性能优化锦囊

先用 `ollama ps` 检查是否意外加载多个模型、是否落到 CPU，再结合官方平台指南核对 GPU 驱动。比较相同模型、上下文和任务时的实际耗时；不要使用没有当前官方依据的 `OLLAMA_GPU_SPLIT` 或 `--numa` 作为通用调优方案。

需要提前加载模型时，可使用官方 FAQ 说明的空提示词方法：

```bash
ollama run deepseek-coder:6.7b-instruct-q4_K_M ""
```

`ollama create` 用于创建自定义模型，不是通用缓存预热命令。预加载会占用内存，不能消除后续推理延迟。

## 六、常见问题排雷

**Q：模型响应慢或内存不足怎么办？**

先减少上下文或选择更小的模型，检查 `ollama ps` 的分配结果和服务日志；不要只升级到某个历史版本号就假定问题已解决。生成的代码仍需人工审查及测试。

**Q：如何设置上下文？**

上下文不能超过模型与硬件能够承受的范围。若使用 Modelfile 自定义模型，按[官方 Modelfile 文档](https://docs.ollama.com/modelfile)同时指定基础模型和参数，例如保存以下内容为 `Modelfile`：

```text
FROM deepseek-coder:6.7b-instruct-q4_K_M
PARAMETER num_ctx 4096
```

```bash
ollama create deepseek-local -f ./Modelfile
ollama run deepseek-local
```

若在 Continue 中使用这个自定义模型，同步将 `model` 改成 `deepseek-local`，并核对客户端的 `contextLength`，不要假定服务端配置一定覆盖客户端请求。
