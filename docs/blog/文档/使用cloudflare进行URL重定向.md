---
title: 使用cloudflare进行URL重定向
createTime: '2024/08/31 21:12:45'
permalink: /article/jqtuqouj/
tags:
  - cloudflare
  - URL重定向
  - wordpress
  - github pages
  - 博客
description: >-
  使用 Cloudflare 重定向规则将旧域名 301 跳转到新域名，配置代理 DNS、保留路径与查询参数，并核验跳转结果。
---

之前我的博客一直使用 wordpress，但是由于 wordpress 太过笨重、维护难度大、国内访问速度慢、还需要花钱租用后端服务器。所以我决定迁移到 github pages 重搞一个博客。

但是之前放在公网上的文章链接都是 wordpress 的，我又舍不得放弃这部分流量，所以用 cloudflare 进行URL重定向，原来的访问直接 301 跳转到了现在的地址。

需要迁移网站的同学不如试试这个方法，无痛迁移，还能保留原有的流量。

<!-- more -->

## 1. 在 cloudflare 解析你的域名

![使用cloudflare进行URL重定向 示例图片 =2015x1187](https://image.ermao.net/images/article/jqtuqouj/image.png)

我要把 [blog.ermao.net](https://blog.ermao.net) 跟 [ermao.net](https://ermao.net) 的所有请求都重定向到 [www.ermao.net](https://www.ermao.net)。

所以要将 [blog.ermao.net](https://blog.ermao.net) 跟 [ermao.net](https://ermao.net) 都在 Cloudflare 上解析，并开启代理。对于仅用于重定向、没有源站的主机名，可按[官方域名重定向说明](https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/)添加指向 `192.0.2.1` 的 A 记录，代理状态设为“已代理”。不要随意填写其他 IP，也不要覆盖仍承载现有业务的 DNS 记录。

目标地址 [www.ermao.net](https://www.ermao.net) 则正常使用`CNAME`解析到 github pages 即可。

## 2. 在 cloudflare 进行URL重定向

![使用cloudflare进行URL重定向 示例图片 =1898x991](https://image.ermao.net/images/article/jqtuqouj/image-1.png)

依次点击`规则` -> `重定向规则` -> `创建规则`。

![使用cloudflare进行URL重定向 示例图片 =1155x1123](https://image.ermao.net/images/article/jqtuqouj/image-2.png)

规则名字随便写，字段类型选`主机名`，运算符选“等于”，只匹配要迁出的主机名。本例匹配 `blog.ermao.net` 或 `ermao.net`，不要包含目标 `www.ermao.net`，以免循环重定向。

URl 重定向类型选`动态`，表达式填写你的目标地址，例如：

```javascript
concat("https://www.ermao.net", http.request.uri.path)
```

状态码选择 `301`（永久重定向）。如果需要保留 URL 中的查询参数，请勾选“保留查询字符串”；上面的表达式只拼接路径，不包含查询字符串。第三张旧截图中该选项未勾选，需要保留参数时请以此处正文为准。配置可对照[官方保留路径与查询参数示例](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-different-hostname/)。

检查来源主机名、目标表达式和上述选项后，点击`保存`并部署规则。

## 3. 等待生效

保存部署后，分别验证无参数和带参数的旧地址，并检查响应状态和 `Location`，不要只看浏览器最终打开了哪个页面。例如：

```bash
curl -I 'https://blog.ermao.net/posts/vpn/'
curl -I 'https://blog.ermao.net/posts/vpn/?audit_check=redirect'
```

两次响应都应为 `301`，目标主机名应为 `www.ermao.net`，路径应保留为 `/posts/vpn/`。启用“保留查询字符串”后，第二次的 `Location` 还应包含 `?audit_check=redirect`。再对 `ermao.net` 做同样检查，并确认最终页面正常打开、没有重定向循环或 404。如果新旧站点路径不同，需要另行配置路径映射。

## 4. 问题

有啥问题可以留言，我会尽量解答。
