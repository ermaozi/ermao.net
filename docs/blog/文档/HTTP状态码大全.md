---
title: HTTP 状态码大全
createTime: 2024/10/06 09:34:56
permalink: /article/u5a30qtd/
tags:
    - web
    - http
    - 状态码
    - 开发
    - 前端
---

HTTP 状态码是服务器响应请求时返回的状态码，用于表示服务器的响应状态。常见的状态码有 5 类，分别以不同的数字开头，每个状态码都有特定的含义。

<!-- more -->

## 1xx 信息响应

- **100 Continue**：继续。客户端应继续其请求。
- **101 Switching Protocols**：切换协议。服务器根据客户端的请求切换协议。
- **102 Processing**：处理将继续执行。

## 2xx 成功响应

- **200 OK**：请求成功。常用于GET和POST请求。
- **201 Created**：已创建。请求成功并创建了新的资源。
- **202 Accepted**：已接受。请求已接受，但尚未处理。
- **203 Non-Authoritative Information**：非权威信息。请求成功，但返回的元信息不是来自原始服务器。
- **204 No Content**：无内容。服务器成功处理了请求，但没有返回任何内容。
- **205 Reset Content**：重置内容。服务器成功处理了请求，要求客户端重置文档视图。
- **206 Partial Content**：部分内容。服务器成功处理了部分GET请求。

## 3xx 重定向消息

- **300 Multiple Choices**：多种选择。请求的资源有多种表示。
- **301 Moved Permanently**：永久移动。请求的资源已被永久的移动到新URI。
- **302 Found**：临时移动。资源只是暂时被移动。
- **303 See Other**：查看其他。请求的资源存在另一个URI，应使用GET方法获取资源。
- **304 Not Modified**：未修改。资源未修改，客户端可以使用缓存的版本。
- **305 Use Proxy**：使用代理。请求的资源必须通过代理访问。
- **307 Temporary Redirect**：临时重定向。请求的资源临时从不同的URI响应请求。
- **308 Permanent Redirect**：永久重定向。请求的资源已永久移动到新URI。

## 4xx 客户端错误响应

- **400 Bad Request**：客户端请求的语法错误，服务器无法理解。
- **401 Unauthorized**：请求要求用户的身份认证。
- **402 Payment Required**：保留将来使用。
- **403 Forbidden**：服务器理解请求，但拒绝执行。
- **404 Not Found**：请求的资源未找到。
- **405 Method Not Allowed**：请求方法不允许。
- **406 Not Acceptable**：请求的资源的内容特性无法满足请求头中的条件。
- **407 Proxy Authentication Required**：要求代理身份认证。
- **408 Request Timeout**：请求超时。
- **409 Conflict**：请求与资源的当前状态发生冲突。
- **410 Gone**：请求的资源已被永久删除。
- **411 Length Required**：请求未定义Content-Length头。
- **412 Precondition Failed**：请求头中的前提条件错误。
- **413 Payload Too Large**：请求体积过大。
- **414 URI Too Long**：请求的URI过长。
- **415 Unsupported Media Type**：不支持的媒体类型。
- **416 Range Not Satisfiable**：请求的范围无法满足。
- **417 Expectation Failed**：服务器无法满足Expect请求头中的要求。
- **418 I’m a teapot**：我是一个茶壶（愚人节笑话）。
- **421 Misdirected Request**：请求被定向到无法生成响应的服务器。
- **422 Unprocessable Entity**：请求格式正确，但由于语义错误无法响应。
- **423 Locked**：资源被锁定。
- **424 Failed Dependency**：由于之前的请求失败，当前请求失败。
- **425 Too Early**：服务器不愿意冒险处理可能重播的请求。
- **426 Upgrade Required**：客户端应切换到TLS/1.0。
- **428 Precondition Required**：请求需要先决条件。
- **429 Too Many Requests**：客户端发送的请求次数过多。
- **431 Request Header Fields Too Large**：请求头字段过大。
- **451 Unavailable For Legal Reasons**：因法律原因不可用。

## 5xx 服务端错误响应

- **500 Internal Server Error**：服务器内部错误，无法完成请求。
- **501 Not Implemented**：服务器不支持请求的功能。
- **502 Bad Gateway**：作为网关或代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应。
- **503 Service Unavailable**：服务器目前无法使用（由于超载或停机维护）。
- **504 Gateway Timeout**：网关超时。
- **505 HTTP Version Not Supported**：服务器不支持请求中所用的HTTP协议版本。
- **506 Variant Also Negotiates**：服务器内部配置错误。
- **507 Insufficient Storage**：服务器无法存储完成请求所需的内容。
- **508 Loop Detected**：服务器检测到无限循环。
- **510 Not Extended**：获取资源所需的策略未满足。
- **511 Network Authentication Required**：需要网络认证。

## HTTP 状态码的作用

### 1. 指示请求结果

HTTP 状态码告诉客户端（如浏览器）请求的结果。例如：

**200 OK** 表示请求成功。

**404 Not Found** 表示请求的资源未找到。

### 2. 帮助调试和诊断

开发者可以通过状态码快速诊断问题。例如：

**500 Internal Server Error** 表示服务器内部错误，可能需要检查服务器日志。

**400 Bad Request** 表示客户端请求有语法错误。

### 3. 控制缓存行为

状态码如 **304 Not Modified** 可以告诉客户端使用缓存的资源，减少带宽消耗和提高加载速度。

### 4. 重定向请求

状态码如 **301 Moved Permanently** 和 **302 Found** 用于重定向客户端到新的资源位置。

### 5. 安全性和认证

状态码如 **401 Unauthorized** 和 **403 Forbidden** 用于控制访问权限和认证。

### 6. 优化用户体验

通过状态码，服务器可以更好地管理用户请求，提供更流畅的用户体验。例如，**429 Too Many Requests** 可以告知客户端请求过于频繁，需要稍后再试。