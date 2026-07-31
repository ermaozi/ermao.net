---
title: "Run DeepSeek Locally with Ollama: Hardware, Models, and VS Code"
createTime: '2025/01/31 19:22:10'
permalink: /en/article/c3gj5lqy/
tags:
  - Artificial intelligence
  - Local models
  - Ollama
  - DeepSeek
  - VS Code
description: Install Ollama, choose a real DeepSeek model tag, estimate memory from model size and context, verify GPU offload, and connect an authorized local VS Code client.
lang: en-US
translationOf: /article/c3gj5lqy/
---

This guide runs a DeepSeek-family model locally with Ollama, verifies where it is loaded, and connects it to VS Code through Continue. It corrects several outdated items in the Chinese source, including unsupported registry-mirror configuration, model tags, fixed hardware estimates, and Continue's deprecated JSON format.

<!-- more -->

![Running DeepSeek locally](https://image.ermao.net/images/article/c3gj5lqy/image.png)

## 1. What Local Deployment Does—and Does Not—Provide

Local inference can offer:

- control over where prompts and source code are processed;
- continued operation without a model-provider connection after the model is downloaded;
- predictable use of your own CPU, GPU, memory, and storage; and
- the ability to choose a model, quantization, and context limit that fit your machine.

It does **not** guarantee zero latency, complete privacy, or safe code:

- prompts may still leave the machine if an editor extension, telemetry service, web search, or cloud model is enabled;
- larger local models can be slower than hosted inference, particularly with CPU offload;
- model output can be insecure or incorrect and requires review and testing; and
- running a model is not the same as fine-tuning it.

Ollama states that it does not receive prompts or answers when models run locally. Its cloud-hosted features have different behavior, so use local-only mode if that boundary matters. See the [Ollama FAQ](https://docs.ollama.com/faq).

## 2. Install Ollama

Use the [official download page](https://ollama.com/download) and the platform-specific documentation.

### Linux

Ollama's official Linux guide currently publishes:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Executing a remote script grants it local privileges. On a controlled machine, download and inspect the script before running it, or follow the [manual Linux installation](https://docs.ollama.com/linux).

The package normally installs a system service. Verify:

```bash
ollama -v
systemctl status ollama --no-pager
```

If you are performing a manual user-level test instead:

```bash
ollama serve
```

Keep that terminal open and use another terminal for model commands.

### Windows

The official documentation recommends `OllamaSetup.exe`. It installs for the current user without requiring Administrator privileges and serves the API at `http://localhost:11434`.

After installation:

```powershell
ollama -v
```

The Windows documentation currently requires Windows 10 22H2 or newer and lists driver requirements for NVIDIA and AMD acceleration. Recheck the [current Windows requirements](https://docs.ollama.com/windows) for your hardware.

### macOS

Ollama's [macOS guide](https://docs.ollama.com/macos) recommends installing the application from its DMG. Its current baseline is macOS Sonoma 14 or newer; Apple silicon supports CPU and GPU execution, while x86 Macs use CPU execution.

### API check

Confirm the local server responds:

```bash
curl http://127.0.0.1:11434/api/version
```

Ollama binds to loopback by default. Do not change `OLLAMA_HOST` to `0.0.0.0` merely to make an editor work on the same machine.

## 3. Do Not Use the Unverified “Mirror” Configuration from the Source

The Chinese source listed several registry URLs and a `~/.ollama/config.json` `registry.mirrors` structure. Those entries are not documented by current Ollama configuration references, and some hostnames should not be treated as official DeepSeek or university mirrors without verification.

Use the official Ollama library and supported proxy variables documented in the [Ollama FAQ](https://docs.ollama.com/faq). If a network requires an outbound proxy, configure the service with `HTTPS_PROXY` according to the platform documentation. Do not replace model sources with an untrusted registry: model files can execute through a complex native runtime and should be treated as a software-supply-chain input.

## 4. Choose a Model That Exists and Fits

The original article used tags such as `deepseek-coder:6.7b-instruct-q4_K_M` and `deepseek-coder:33b-instruct-fp16`. Current Ollama library pages expose simpler supported tags:

| Model | Ollama command | Published model size | Library context limit |
| --- | --- | ---: | ---: |
| DeepSeek Coder 1.3B | `ollama run deepseek-coder` | about 776 MB | 16K |
| DeepSeek Coder 6.7B | `ollama run deepseek-coder:6.7b` | about 3.8 GB | 16K |
| DeepSeek Coder 33B | `ollama run deepseek-coder:33b` | about 19 GB | 16K |
| DeepSeek R1 distilled 8B | `ollama run deepseek-r1:8b` | about 5.2 GB | 128K |
| DeepSeek R1 distilled 14B | `ollama run deepseek-r1:14b` | about 9.0 GB | 128K |
| DeepSeek R1 distilled 32B | `ollama run deepseek-r1:32b` | about 20 GB | 128K |

The values above are the current file sizes and advertised context limits on Ollama's [DeepSeek Coder](https://ollama.com/library/deepseek-coder) and [DeepSeek R1](https://ollama.com/library/deepseek-r1) library pages. They are not promises about VRAM use or speed.

Start conservatively:

```bash
ollama run deepseek-coder:6.7b
```

or:

```bash
ollama run deepseek-r1:8b
```

List local models:

```bash
ollama list
```

### Why a fixed “FP32 needs 24 GB” table is misleading

Memory depends on:

- parameter count and quantization;
- runtime overhead;
- context length and key/value cache;
- number of parallel requests;
- GPU architecture and backend;
- whether layers are split between GPU and system memory; and
- other processes using RAM or VRAM.

A 33B FP16 model alone requires roughly 66 GB just for two bytes per parameter before cache and runtime overhead, so the source's 12 GB or 24 GB class estimates cannot be generalized across its listed models.

Use the published model file size as a lower-bound planning signal, leave headroom, and measure the actual load:

```bash
ollama ps
```

The `PROCESSOR` column shows whether the model is fully on GPU, fully on CPU, or split. CPU offload can make a model usable but substantially slower.

## 5. Set Context Length Deliberately

Ollama's current context defaults depend on detected VRAM:

- below 24 GiB: 4K;
- 24–48 GiB: 32K; and
- 48 GiB or more: 256K.

Those defaults may change, so check the [current context-length documentation](https://docs.ollama.com/context-length). A model's advertised maximum does not mean your machine can run that maximum efficiently.

To set a service-wide value for a manual session:

```bash
OLLAMA_CONTEXT_LENGTH=16384 ollama serve
```

Larger context consumes more memory. Increase it only when the task requires it, then confirm the allocated value with:

```bash
ollama ps
```

## 6. Connect Continue in VS Code

Install Continue from the official VS Code Marketplace listing and review the extension's permissions and telemetry settings. Current Continue documentation uses YAML; the `settings.json` structure in the Chinese source is obsolete.

Create or edit the Continue configuration:

```yaml
name: Local DeepSeek
version: 0.0.1
schema: v1

models:
  - name: DeepSeek Coder Local
    provider: ollama
    model: deepseek-coder:6.7b
    apiBase: http://127.0.0.1:11434
    defaultCompletionOptions:
      contextLength: 8192
```

Use the exact model tag shown by `ollama list`. Continue notes that it may request a larger context than other clients; if you see “model requires more system memory,” reduce `contextLength` or choose a smaller model. See [Continue's Ollama configuration guide](https://docs.continue.dev/customize/model-providers/top-level/ollama).

Autocomplete, chat, edit, and agent roles can have different model requirements. Do not assume one chat-oriented reasoning model will provide low-latency inline completion.

## 7. Test with Non-Sensitive Code First

Example prompt:

```text
Write a Python function that loads a CSV file with pandas and returns
the mean of numeric columns. Include type hints and error handling.
```

Review generated code before running it:

```python
from pathlib import Path

import pandas as pd


def numeric_column_means(path: Path) -> pd.Series:
    if not path.is_file():
        raise FileNotFoundError(path)
    frame = pd.read_csv(path)
    return frame.mean(numeric_only=True)
```

For refactoring, use tests to preserve behavior. A shorter expression is not automatically clearer or equivalent:

```javascript
const sum = (values) => values.reduce((total, value) => total + value, 0);
```

This example behaves differently from some loosely typed inputs and needs validation for the application's data contract.

## 8. Performance and Troubleshooting

### Confirm acceleration

NVIDIA:

```bash
nvidia-smi
ollama ps
```

Ollama logs on Linux:

```bash
journalctl -e -u ollama
```

Windows logs are documented under `%LOCALAPPDATA%\Ollama`; macOS logs are under `~/.ollama/logs`.

### Avoid unsupported tuning variables

The source suggested `OLLAMA_GPU_SPLIT=0.8`, a generic `OMP_NUM_THREADS=8`, and an Ollama `--numa` flag. These are not current portable Ollama tuning instructions. Unsupported environment variables may do nothing, and generic thread overrides can make performance worse.

Use documented settings, observe `ollama ps`, update GPU drivers within the supported matrix, close competing GPU workloads, reduce model size or context, and benchmark the actual task.

### Preload a model correctly

Ollama documents an empty API request or CLI prompt for preloading:

```bash
ollama run deepseek-coder:6.7b ""
```

Creating a new model with `ollama create` does not itself function as a general cache warm-up.

## 9. Privacy Checklist

- Keep the API on `127.0.0.1` unless remote access is intentionally secured.
- Disable Ollama cloud features if the requirement is strictly local processing.
- Review editor-extension telemetry and cloud fallbacks.
- Exclude secrets and private keys from prompts and workspace indexing.
- Keep models, Ollama, the editor, and extensions updated.
- Treat generated commands as untrusted until reviewed.

Local execution improves control over data flow, but privacy is a property of the whole toolchain—not just the model process.

## Related Page

- [Audit publicly exposed Ollama endpoints safely](/en/article/tj38tso3/)
