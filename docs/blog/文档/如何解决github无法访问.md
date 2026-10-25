---
title: 全网最全！6种方法解决 GitHub 国内由于 DNS 污染导致无法访问的问题
createTime: '2025/02/27 10:07:16'
permalink: /article/jddtxrrw/
tags:
  - GitHub
  - DNS
  - VPN
description: >-
  排查 GitHub 无法访问时的 DNS、Hosts、代理与网络问题，区分公共 DNS 与加密 DNS，避免仅凭超时或解析结果不同误判 DNS 污染。
---

GitHub 是一个面向开源及私有软件项目的托管平台。无法访问时，DNS 异常只是可能原因之一；[GitHub 官方排障说明](https://docs.github.com/en/get-started/using-github/troubleshooting-connectivity-problems)也列出了防火墙、代理和网络配置等因素。

本文整理 6 类检查与处理方法，应根据故障原因选择，不保证每种网络都适用。若仍有问题，欢迎在下方评论补充报错现象。

<!-- more -->

DNS 污染可能使域名解析到错误地址，但浏览器超时或“无法访问”本身不能确定故障发生在 DNS 层。

浏览器报错如下：

**嗯… 无法访问此页面**

**github.com 响应时间太长**

![github.com 响应时间太长 =1325x594](https://image.ermao.net/images/article/jddtxrrw/image.png)

---

下面提供几个可行的方案共大家参考

## **1. 手动修改 Hosts 文件**
Hosts 会覆盖正常域名解析，旧映射也可能导致访问失败。先检查是否已有过期条目；只有确认当前地址适用于目标域名时，才考虑临时测试，并保留恢复原配置的方法。[GitHub 官方说明](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses)指出 IP 会变化，Meta API 也不是全部服务地址的完整列表。
**步骤**：
1. **获取最新的 GitHub 域名 IP**：
   - 访问 [IPAddress.com](https://www.ipaddress.com/) 查询以下域名的当前 IP：
     - `github.com`
     - `assets-cdn.github.com`
     - `github.global.ssl.fastly.net`
     - `api.github.com`
     - `raw.githubusercontent.com`
   - 或使用命令查询（需安装 `nslookup` 或 `dig`）：
     ```bash
     nslookup github.com 8.8.8.8  # 使用 Google DNS 查询
     ```

2. **修改 Hosts 文件**：
   - **Windows**：
     - 文件路径：`C:\Windows\System32\drivers\etc\hosts`
     - 右键用管理员权限编辑。下方是原文的历史映射示例，**不能直接复制为当前配置**；如已有这些旧条目，应先核实或移除后重新测试：
       ```
       # GitHub
       140.82.113.3    github.com
       185.199.108.153 assets-cdn.github.com
       199.232.69.194  github.global.ssl.fastly.net
       ```
   - **macOS/Linux**：
     - 文件路径：`/etc/hosts`
     - 检查 `/etc/hosts` 中是否有旧 GitHub 映射；如需编辑，可用 `sudo nano /etc/hosts`，不要直接添加上面的历史地址。

3. **刷新 DNS 缓存**：
   - Windows：`ipconfig /flushdns`
   - macOS/Linux：`sudo dscacheutil -flushcache` 或 `sudo systemd-resolve --flush-caches`

---

## **2. 使用加密 DNS 服务**
DNS-over-HTTPS（DoH）或 DNS-over-TLS（DoT）加密客户端与解析器之间的查询。**只把 DNS 地址改为 `1.1.1.1` 或 `8.8.8.8`，不等于启用了加密 DNS**：普通 UDP/TCP 查询仍不加密，可对照 [Google 安全传输说明](https://developers.google.com/speed/public-dns/docs/secure-transports)。
**推荐方案**：
- **Cloudflare DNS**（`1.1.1.1`）或 **Google DNS**（`8.8.8.8`）：
  - 如需加密，在支持的系统或浏览器中明确启用 DoH/DoT，并按服务商文档配置；参考 [Cloudflare 加密 DNS 说明](https://developers.cloudflare.com/1.1.1.1/encryption/)。
- **DNSCrypt 或 DoH/DoT 工具**：
  - 使用 [AdGuard DNS](https://adguard-dns.io/)、[NextDNS](https://nextdns.io/) 等支持加密的 DNS 服务。

---

## **3. 使用代理或 VPN(终极大杀器)**
代理或 VPN 可能改变连接路径，但 DNS 是否也经过代理取决于客户端配置，不能保证解决所有解析或网络问题。
**推荐工具**：
- **Clash**（支持规则分流，开源免费）
- **Shadowsocks/V2Ray**（需自建或购买节点）
- 商业 VPN（如 ExpressVPN、NordVPN）

相关内容：
- 📱 [clash for Android](https://www.ermao.net/article/eh8f4n86/)
- 🖥 [clash for Windows](https://www.ermao.net/article/0gematwc/)
- 🍎 [clash for iOS](https://www.ermao.net/article/z747kgjd/)

---

## **4. 使用 GitHub 镜像站点**
访问 GitHub 的镜像服务，避开主域名污染。  
**常用镜像**：
- [GitHub 加速下载](https://ghproxy.com/)
- [FastGit](https://hub.fastgit.org/)（已停用，可寻找替代）

---

## **5. 验证 DNS 污染**
确认是否真的是 DNS 污染导致的问题：
1. 使用 `nslookup` 或 `dig` 查询域名：
   ```bash
   nslookup github.com 8.8.8.8  # 使用另一公共解析器作对照（普通 DNS，非加密查询）
   nslookup github.com          # 使用本地默认 DNS 查询
   ```
   - 结果不同只是线索，不能单凭这一点认定 DNS 污染；GitHub 使用多个 IP 地址范围，缓存、解析位置或记录变化都可能影响结果。结合是否解析超时、返回地址是否异常以及 HTTPS 连接结果继续排查。
   - 若返回相同地址但仍无法连接，也要检查网络路径、代理或防火墙；加密 DNS 不能修复这些非 DNS 故障。

---

## **6. 清除本地 DNS 缓存**
- **Windows**：
  ```cmd
  ipconfig /flushdns
  ```
- **macOS**：
  ```bash
  sudo killall -HUP mDNSResponder
  ```
- **Linux**：
  ```bash
  sudo systemctl restart nscd
  ```

---

## **注意事项**
1. **IP 地址可能变化**，需定期更新 Hosts 文件。
2. **优先使用 HTTPS**，避免中间人攻击。
3. 如果使用代理/VPN，确保节点未被 GitHub 封禁（如某些机场 IP 可能被限制）。

---

若问题持续，请按具体报错区分解析、连接和 TLS 问题，并参考上方 GitHub 官方排障说明；企业网络限制应联系管理员确认，不要将代理或 VPN 当作保证有效的解决方案。
