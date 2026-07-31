---
title: "GitHub Unreachable or Slow: Six Troubleshooting Methods for 2026"
createTime: '2026/02/15 10:07:16'
permalink: /en/article/github/
tags:
  - GitHub
  - Connectivity
  - DNS
  - Proxy
  - Git
keywords:
  - GitHub connection timeout
  - GitHub unreachable
  - GitHub DNS
  - Git proxy
  - GitHub slow download
description: Diagnose GitHub timeouts, DNS failures, blocked SSH, and slow clones with current checks for service status, DNS, HTTPS, SSH over port 443, and proxies.
lang: en-US
translationOf: /article/github/
---

GitHub may fail to load, time out, omit images, or clone very slowly because of a GitHub incident, DNS resolution, a firewall, a proxy, a corporate policy, route congestion, or local network configuration. The right fix depends on which layer is failing.

<!-- more -->

::: tip Start with evidence
GitHub's [official troubleshooting guide](https://docs.github.com/en/get-started/using-github/troubleshooting-connectivity-problems) says firewalls, proxy servers, company networks, and other network configurations are common causes. Do not assume every failure is DNS poisoning, and do not paste an arbitrary IP address into your hosts file before testing.
:::

## 1. Check GitHub and Identify the Failing Layer

First check [GitHub Status](https://www.githubstatus.com/). Then test the website, DNS, HTTPS, Git over HTTPS, and SSH separately:

```bash
# DNS resolution
nslookup github.com

# HTTPS reachability and certificate negotiation
curl -I --connect-timeout 10 https://github.com/

# Git over HTTPS, without cloning a full repository
git ls-remote https://github.com/git/git.git HEAD

# SSH authentication path
ssh -vT git@github.com
```

Interpret the result:

- If DNS returns no address, focus on the resolver.
- If DNS succeeds but HTTPS times out, investigate routing, a firewall, or a proxy.
- If the website works but `git clone` fails, inspect Git's remote URL and proxy configuration.
- If HTTPS works but SSH on port 22 times out, use HTTPS cloning or GitHub's SSH-over-443 endpoint.
- If only one network fails, contact that network's administrator or provider.

Avoid using `ping` alone as the verdict. ICMP may be filtered even when HTTPS works.

## 2. Fix DNS Resolution

Compare the configured resolver with a trusted resolver:

```bash
nslookup github.com
nslookup github.com 1.1.1.1
```

Different answers are not automatically evidence of tampering: GitHub and its content-delivery infrastructure can return different addresses by location and time. A failure, obviously unrelated address, or repeatable mismatch accompanied by connection errors deserves further investigation.

Encrypted DNS can protect DNS queries from alteration in transit. Cloudflare documents its DNS-over-HTTPS endpoint as:

```text
https://cloudflare-dns.com/dns-query
```

In Chrome or Edge, search the privacy and security settings for “Use secure DNS,” then choose a provider you trust. System and browser behavior varies, and encrypted DNS fixes only the name-resolution layer; it cannot repair an IP-level block, a broken route, or a corporate firewall.

After changing DNS, clear stale cache entries where appropriate:

```powershell
# Windows
ipconfig /flushdns
```

```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

On Linux, the command depends on the active resolver. For systemd-resolved:

```bash
sudo resolvectl flush-caches
```

## 3. Avoid Hard-Coded GitHub Hosts Entries

The original Chinese article supplied fixed IP addresses for `github.com` and related hosts. That advice is fragile in 2026. GitHub states that its IP addresses change over time, does not recommend allowlisting by IP, and says the Meta API list is not exhaustive.

If an administrator must maintain an allowlist, monitor the [GitHub Meta API](https://api.github.com/meta) and follow [GitHub's IP-address guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses). Do not copy old addresses from a blog or IP-lookup site.

If you previously added GitHub entries to the hosts file, temporarily comment them out and test normal DNS again:

- Windows: `C:\Windows\System32\drivers\etc\hosts`
- macOS and Linux: `/etc/hosts`

Static mappings may send traffic to an obsolete or inappropriate edge address. Never disable TLS verification to compensate for certificate errors.

## 4. Switch the Git Transport

If SSH port 22 is blocked, HTTPS is often the simplest option:

```bash
git remote -v
git remote set-url origin https://github.com/OWNER/REPOSITORY.git
git ls-remote origin HEAD
```

If you need SSH, GitHub officially supports SSH over port 443:

```bash
ssh -T -p 443 git@ssh.github.com
```

If that succeeds, add the following to `~/.ssh/config`:

```ssh-config
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
```

Verify any first-use host-key prompt against [GitHub's published SSH fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints).

## 5. Configure an Authorized Proxy Carefully

Where local law and network policy permit it, an authorized proxy or VPN can provide a working route when direct traffic is blocked. For a local HTTP proxy listening on port `7890`, Git can be configured with:

```bash
git config --global http.proxy http://127.0.0.1:7890
```

Inspect and remove the setting when it is no longer needed:

```bash
git config --global --get http.proxy
git config --global --unset http.proxy
```

The Git option is named `http.proxy` and applies to HTTP and HTTPS remotes handled by libcurl; a separate `https.proxy` key is usually unnecessary. Do not embed a reusable password in a command or configuration file. On managed networks, ask the administrator for the approved proxy and certificate configuration.

For client setup, see:

- [Clash Meta on Android](/en/article/eh8f4n86/)
- [Clash Verge on Windows, Linux, and macOS](/en/article/0gematwc/)
- [Shadowrocket on iOS](/en/article/z747kgjd/)

## 6. Treat Mirrors and “Accelerators” as Third Parties

The FastGit and CNPMJS examples in the original article are stale, and third-party mirror availability changes frequently. More importantly, a mirror or download proxy can observe requested repository paths and may serve modified or outdated content.

If you use a third-party mirror for a public archive:

- do not sign in with your GitHub credentials;
- do not send personal access tokens or private-repository URLs;
- verify release signatures or checksums from an independent official source; and
- return to the canonical `github.com` remote before pushing.

Tools such as Watt Toolkit may alter local proxy, certificate, or hosts settings. Use only the project's official distribution, review what it changes, and know how to restore the original configuration.

## 7. Reset Local Networking Only When Indicated

On Windows, clearing the DNS cache is low impact:

```cmd
ipconfig /flushdns
```

Resetting Winsock is broader and can remove custom Layered Service Provider configuration. Use it only when local socket configuration appears damaged, run the terminal as administrator, and restart afterward:

```cmd
netsh winsock reset
```

Before a broad reset, test another browser, disable only the suspect extension, check system time, inspect proxy settings, and try another network. Those checks preserve useful evidence and often isolate the cause faster.

## Recommended Order

1. Check GitHub Status and reproduce the failure.
2. Separate DNS, HTTPS, Git-over-HTTPS, and SSH tests.
3. Remove stale hosts entries and flush only the relevant cache.
4. Switch between HTTPS and SSH over port 443.
5. Use an approved proxy only if the direct network path is the problem.
6. Escalate managed-network blocks to the administrator rather than bypassing policy.

This order avoids the most common mistake in GitHub troubleshooting: changing several network layers at once and no longer knowing which change fixed—or worsened—the problem.
