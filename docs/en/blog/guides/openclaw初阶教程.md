---
title: "OpenClaw Beginner Guide: Build a Private Telegram AI Assistant"
createTime: 2026/03/03 13:19:48
permalink: /en/blog/yecv6pn6/
description: Install OpenClaw, connect a private Telegram bot and an OpenRouter model, configure remote access safely, and diagnose gateway or network failures.
tags:
  - OpenClaw
  - Telegram Bot
  - AI gateway
  - Tutorial
lang: en-US
translationOf: /blog/yecv6pn6/
---

![OpenClaw beginner guide cover](https://image.ermao.net/images/blog/yecv6pn6/20260303_132046-c34687.png)

OpenClaw lets you use an AI assistant from Telegram and other chat applications while keeping the gateway and its configuration on a device you control. This guide takes you through installation, Telegram pairing, model setup, remote access, troubleshooting, and a secure starting policy.

The commands and settings below follow the current OpenClaw documentation. OpenClaw changes quickly, so check the linked official pages before making a production deployment.

<!-- more -->

## What OpenClaw is

An OpenClaw setup has three main parts:

1. **Gateway:** the local service that receives messages, manages sessions, and runs approved tools.
2. **Channel:** Telegram, Discord, WhatsApp, or another chat interface.
3. **Model provider:** OpenRouter or another service that supplies the language model.

The gateway can do much more than relay text. Depending on the tools you enable, an agent may read files, run programs, access web services, or operate other accounts. Treat it as an automation service with credentials, not as a harmless chat window.

OpenClaw is a reasonable fit if you:

- want to reach a private assistant from a chat application;
- are comfortable maintaining a small local service;
- need control over providers, models, and tool permissions; and
- are willing to inspect logs and apply security updates.

If this is your first self-hosted service, it may help to read [What Is Circumvention?](/en/article/fanqiang2/) and learn the basics of terminal commands before continuing.

## What you need

### A supported system and Node.js

OpenClaw runs on macOS, Linux, Windows PowerShell, and Windows Subsystem for Linux. You do not need to switch operating systems merely to follow this tutorial.

At the time of writing, the official installer requires a supported Node.js release: Node 22.22.3 or later in the Node 22 line, Node 24.15 or later, or Node 25.9 or later. The project currently recommends Node 26 as the default choice. Recheck the [official installation page](https://docs.openclaw.ai/install) because these minimum versions can change.

Check your current installation:

```bash
node --version
npm --version
```

### A model account and a strict budget

OpenClaw is not itself a model. You must connect it to a supported provider. This guide uses OpenRouter because OpenClaw has a dedicated onboarding flow for it.

Before adding a key:

- enable a daily or monthly spending limit where the provider supports one;
- start with a low-cost model and a small test balance;
- never paste the key into a public issue, screenshot, or chat; and
- rotate the key immediately if it is exposed.

### A Telegram account and reachable Telegram API

Telegram must be reachable from the machine running the gateway. A simple request can test basic HTTPS reachability:

```bash
curl -I https://api.telegram.org
```

A redirect or an HTTP error page can still prove that DNS and TLS reached Telegram, but this test does **not** prove that your bot token, long polling, or proxy configuration works. OpenClaw's channel probe and logs are the authoritative checks later in this guide.

For general client setup, see:

- [Clash Verge Rev installation and usage](/en/article/6vxkmmuh/)
- [Install Clash on Windows](/en/article/0gematwc/)
- [Shadowrocket beginner guide](/en/article/z747kgjd/)

## Install OpenClaw

### 1. Run the official installer

On macOS, Linux, or WSL:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

On Windows PowerShell:

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

Piping a remote script into a shell gives that script access to your account. On a sensitive machine, download and inspect the script first, or use another installation method documented by OpenClaw.

### 2. Verify the installation

```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

`doctor` checks common configuration and runtime problems. The gateway may not be running yet if you have not completed onboarding.

### 3. Complete onboarding and install the service

```bash
openclaw onboard --install-daemon
```

Follow the prompts to create the initial configuration and install the managed background service. Installing a daemon is preferable to keeping an interactive terminal open, but it also means shell-only environment settings may not be inherited by the service.

## Create and connect a Telegram bot

### 1. Create the bot through BotFather

Open a conversation with the exact verified Telegram account `@BotFather`, then:

1. send `/newbot`;
2. choose a display name;
3. choose an available username ending in `bot`; and
4. copy the bot token into the OpenClaw onboarding prompt.

The token is a password for the bot. Store it in OpenClaw's supported secret or configuration mechanism, keep it out of Git, and revoke it through BotFather if it leaks.

If you are new to Telegram, read the [Telegram registration and setup guide](/en/blog/telegram/).

### 2. Approve the first private conversation

OpenClaw's default Telegram direct-message policy is pairing. Send a message to your new bot, then inspect pending requests:

```bash
openclaw pairing list telegram
```

Approve only the code shown for your own account:

```bash
openclaw pairing approve telegram <PAIRING_CODE>
```

Do not substitute a Telegram user ID for `<PAIRING_CODE>`. If you need your numeric Telegram ID for an allowlist, send the bot a message and inspect:

```bash
openclaw logs --follow
```

This avoids disclosing your account to an unrelated ID-lookup bot.

### 3. Restrict the bot to its owner

Pairing is useful for initial approval. For a single-owner bot, an explicit direct-message allowlist is easier to audit over time:

```yaml
channels:
  telegram:
    dmPolicy: allowlist
    allowFrom:
      - 123456789
```

Replace the sample number with your own numeric Telegram user ID. Keep the policy at `pairing` if you intentionally want to approve additional users one at a time. Do not set it to `open` unless the bot is deliberately public and its tools, data, and spending limits have been designed for untrusted users.

See the current [Telegram channel documentation](https://docs.openclaw.ai/channels/telegram) before editing the configuration, because available fields can change between releases.

## Connect OpenRouter

Use an official onboarding path instead of copying a stale provider block or model name from a blog post.

For browser-based OAuth:

```bash
openclaw onboard --auth-choice openrouter-oauth
```

For an OpenRouter API key:

```bash
openclaw onboard --auth-choice openrouter-api-key
```

Then select a model that is currently available to your account:

```bash
openclaw models set openrouter/<provider>/<model>
```

Replace `<provider>/<model>` with a model identifier shown by the current provider and OpenClaw model listing. Availability, prices, context limits, and model IDs change, so this guide deliberately does not hard-code a supposedly permanent model.

After configuration, confirm that the gateway and channel can reach their dependencies:

```bash
openclaw gateway status --require-rpc
openclaw channels status --probe
```

The official [OpenRouter provider guide](https://docs.openclaw.ai/providers/openrouter) contains the latest authentication options.

## Open the local Control UI safely

The default gateway address is loopback-only:

```text
http://127.0.0.1:18789/
```

On the gateway machine, open that URL directly. If OpenClaw runs on a remote Linux host, keep it bound to loopback and create an SSH tunnel from your own computer:

```bash
ssh -N -L 18789:127.0.0.1:18789 user@example-host
```

Then open `http://127.0.0.1:18789/` locally. Use your actual SSH host and account in the command.

Do not expose port 18789 directly to the internet. OpenClaw blocks some unsafe non-loopback configurations without authentication, but that guard is not a substitute for a firewall, access control, and secure remote-access design.

## Configure a proxy for the managed service

If Telegram is blocked or unreliable on the gateway's network, configure a proxy in the channel or managed service environment supported by your OpenClaw version. An interactive shell setting such as `~/.zshrc` often does not reach a systemd, launchd, or Windows service.

Prefer the Telegram channel's current `proxy` setting where supported. If you must use service environment variables, add them to the service manager's override rather than assuming this is sufficient:

```bash
export HTTPS_PROXY=http://127.0.0.1:7890
```

Important details:

- confirm the actual proxy protocol and port;
- use a hostname-resolving SOCKS mode such as `socks5h` where the client supports it;
- remember that `127.0.0.1` refers to the machine or container running OpenClaw; and
- never publish a proxy listener without authentication.

After a configuration change, restart the managed gateway:

```bash
openclaw gateway restart
```

If active tasks must finish before a restart, current releases also support:

```bash
openclaw gateway restart --safe
```

## Diagnose failures methodically

Start with the official diagnostic ladder:

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

### The bot does not reply

Check the first clear error in the logs:

- **Telegram 401:** the bot token is invalid, revoked, or assigned to the wrong configuration.
- **Provider 401 or authentication failure:** the model credential is invalid or expired.
- **Rate limit or insufficient credit:** the provider rejected the request because of policy, quota, or balance.
- **Timeout, DNS, or network error:** test the route from the gateway process, including the service proxy.
- **Pairing or allowlist rejection:** approve the correct pairing code or add the correct numeric account ID.

A successful `curl -I` request alone does not eliminate Telegram polling, token, or service-environment problems.

### Port 18789 is already in use

First determine whether the expected managed gateway owns the port:

```bash
openclaw gateway status
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

Stop or restart the identified service through its service manager. Do not use `kill -9` as a routine fix: it bypasses cleanup and may kill an unrelated process.

### The gateway runs, but RPC is unavailable

Use:

```bash
openclaw gateway status --require-rpc
openclaw doctor
openclaw logs --follow
```

A healthy status should show a running runtime and successful connectivity. Follow the [official gateway troubleshooting guide](https://docs.openclaw.ai/gateway/troubleshooting) for release-specific diagnostics.

## Apply a safe starting policy

Security is not a final optional step. Establish boundaries before connecting private data or powerful tools.

### Keep the gateway private

- retain the loopback listener unless you have designed authenticated remote access;
- use an SSH tunnel or another access-controlled private network;
- keep the host firewall enabled; and
- do not place the unauthenticated Control UI behind a public domain.

### Deny tools by default

The exact configuration format varies by release, but the current execution-approval model supports a deny-by-default posture and approval on a missing rule:

```yaml
defaults:
  security: deny
  ask: on-miss
  askFallback: deny
```

Enable only the commands, directories, and integrations the assistant genuinely needs. An approval prompt is a useful control, but it does not make an unknown command safe. Read and understand the requested action before approving it.

For the current schema and per-agent allowlists, use the [execution approvals documentation](https://docs.openclaw.ai/tools/exec-approvals).

### Separate credentials and data

- run OpenClaw as an unprivileged account;
- do not give the agent unrestricted access to your home directory;
- use separate service credentials with the minimum permissions;
- protect the OpenClaw state database, tokens, and backups;
- verify that restored backups also preserve restrictive file permissions; and
- rotate credentials after a device loss or suspected compromise.

The state database under the OpenClaw data directory can contain sensitive session and authentication material. Treat a copy as a credential-bearing backup.

### Audit skills and plugins

Skills and plugins can execute code or expand the agent's access. Review their source and permissions, pin versions where practical, and test updates with non-sensitive accounts. A popular package can still be compromised or request more authority than your workflow needs.

### Contain cost and misuse

- set provider-side spending caps and alerts;
- limit the bot to known Telegram users;
- start with low tool privileges and expand them only for a documented need;
- review logs for unexpected sessions and actions; and
- keep the gateway, runtime, and dependencies updated.

OpenClaw's [security guide](https://docs.openclaw.ai/security) should be part of deployment review, not just incident response.

## Update and verify

Use the update method documented for your installation, then rerun:

```bash
openclaw --version
openclaw doctor
openclaw gateway status --require-rpc
openclaw channels status --probe
```

Review release notes before a major upgrade, especially if you depend on custom channel fields, model aliases, tools, or plugins. Back up the configuration and state first, but do not copy secrets into an unencrypted archive.

## Related guides

- [What Is Circumvention?](/en/article/fanqiang2/)
- [Clash Verge Rev installation and usage](/en/article/6vxkmmuh/)
- [Install Clash on Windows](/en/article/0gematwc/)
- [Shadowrocket beginner guide](/en/article/z747kgjd/)
- [Telegram registration and setup](/en/blog/telegram/)
- [Troubleshoot GitHub access](/en/article/jddtxrrw/)
- [Run DeepSeek locally with Ollama](/en/article/c3gj5lqy/)

## Final checklist

Before relying on the bot, confirm all of the following:

- the gateway listens only where you intend;
- your own Telegram account is paired or allowlisted;
- the bot and model credentials have not been exposed;
- provider budgets and alerts are active;
- dangerous tools are denied or require narrowly scoped approval;
- `gateway status --require-rpc` succeeds;
- `channels status --probe` succeeds; and
- you can identify failures from the logs without exposing secrets.

Once this minimal setup is stable, add one integration or permission at a time. That makes both security review and troubleshooting substantially easier.
