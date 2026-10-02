---
url: /en/article/jddtxrrw/index.md
description: >-
  A focused workflow for determining whether GitHub failures come from DNS,
  HTTPS routing, SSH port blocking, a proxy, or a local network configuration.
---
When GitHub cannot be reached, DNS interference is one possible cause, but it is not the only one. Firewalls, proxies, network policy, routing failures, TLS inspection, blocked SSH, and GitHub incidents can produce similar symptoms.

This page focuses on diagnosis. For a broader set of remedies, see [GitHub Unreachable or Slow: Six Troubleshooting Methods](/en/article/github/).

## Symptoms

A browser may report that the page cannot be reached or that `github.com` took too long to respond:

![Example GitHub timeout =1325x594](https://image.ermao.net/images/article/jddtxrrw/image.png)

The message alone does not identify the failing layer. Use the checks below in order.

## 1. Compare DNS Answers

Query both the system resolver and an alternate resolver:

```bash
nslookup github.com
nslookup github.com 1.1.1.1
```

If available, `dig` provides more detail:

```bash
dig github.com
dig @1.1.1.1 github.com
```

Check for:

* timeouts or `SERVFAIL`;
* an address unrelated to the intended service;
* repeatable differences accompanied by connection failures; and
* a local hosts-file entry overriding DNS.

Different valid addresses can be normal because large services use distributed infrastructure. Do not label a mismatch as DNS poisoning without corroborating evidence.

## 2. Test HTTPS Separately

```bash
curl -Iv --connect-timeout 10 https://github.com/
```

This distinguishes several cases:

* **Could not resolve host:** name resolution failed.
* **Connection timed out:** DNS returned an address, but the network path did not complete.
* **Certificate error:** inspect system time, trusted certificate authorities, and any managed TLS-inspection proxy.
* **HTTP response received:** DNS, TCP, and TLS are working for that request.

Do not use `curl -k` or disable Git's TLS verification as a “fix.” That hides certificate validation failures and exposes credentials and code transfers to interception.

## 3. Remove Stale Hosts Overrides

The source article included fixed GitHub IP addresses. GitHub's official documentation now emphasizes that addresses change and that the Meta API list is not exhaustive. A copied address can become stale or route to an unsuitable edge.

Inspect:

* Windows: `C:\Windows\System32\drivers\etc\hosts`
* macOS and Linux: `/etc/hosts`

Comment out old GitHub mappings, flush the DNS cache, and test again. Network administrators who genuinely require IP allowlists should follow [GitHub's current IP guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses) and monitor the [Meta API](https://api.github.com/meta).

## 4. Use Encrypted DNS Where Appropriate

DNS over HTTPS or DNS over TLS encrypts queries between the client and resolver, reducing the opportunity for in-path alteration. Cloudflare documents this DoH endpoint:

```text
https://cloudflare-dns.com/dns-query
```

Other reputable resolvers may also be appropriate. Choose based on local availability, privacy policy, and organizational rules. Encrypted DNS cannot fix an IP block, a failed route, or an application-layer restriction.

## 5. Test Git Over HTTPS

The website and Git operations can fail independently. Test a public repository without downloading it:

```bash
git ls-remote https://github.com/git/git.git HEAD
```

Inspect proxy configuration:

```bash
git config --show-origin --get-regexp '^(http\\..*proxy|remote\\..*\\.proxy)$'
```

If an obsolete global proxy is present:

```bash
git config --global --unset http.proxy
```

For an approved local proxy on port `7890`:

```bash
git config --global http.proxy http://127.0.0.1:7890
```

Do not place passwords or tokens in the proxy URL. Follow the rules of the network you are using.

## 6. Handle Blocked SSH

Test the standard SSH endpoint:

```bash
ssh -vT git@github.com
```

If port 22 is blocked but HTTPS works, either change the repository remote to HTTPS or test GitHub's official SSH-over-HTTPS endpoint:

```bash
ssh -T -p 443 git@ssh.github.com
```

The hostname is `ssh.github.com`, not `github.com`. Follow [GitHub's SSH-over-443 instructions](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port) before making the change permanent.

## 7. Clear Only the Relevant Cache

Windows:

```cmd
ipconfig /flushdns
```

macOS:

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

Linux with systemd-resolved:

```bash
sudo resolvectl flush-caches
```

The original Linux command `systemctl restart nscd` applies only when `nscd` is actually installed and responsible for caching.

## 8. Avoid Untrusted Mirrors

The FastGit mirror cited in the older source is no longer a dependable recommendation. Mirror and download-proxy operators can see requested paths, may serve stale content, and must never receive GitHub credentials or private-repository URLs.

If a public release must be downloaded through a third party, verify its signature or checksum against an independent canonical source. Keep the repository's push remote on GitHub.

## Conclusion

Use results, not assumptions:

1. confirm GitHub's service status;
2. test DNS;
3. test HTTPS;
4. test Git over HTTPS;
5. test SSH separately; and
6. compare another authorized network.

If the failure occurs only on a managed or corporate network, contact its administrator. GitHub's own connectivity documentation identifies firewalls, proxies, and network configuration as common causes and recommends working with the network owner.
