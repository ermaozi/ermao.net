---
createTime: '2024/05/09 12:00:00'
tags:
  - nas
  - aria2
  - docker
  - websocket
title: docker 部署 aria2
permalink: /article/b06gglcq/
description: Docker 部署 Aria2 下载器教程，包含 Aria2 服务配置、Aria2 Explorer 浏览器插件连接、WebSocket 访问和内网穿透场景下的性能排查。
---

docker 部署 Aria2 下载器，并在浏览器端配置 Aria2 Explorer

<!-- more -->

## 一小段废话

我家所在的小区运营商不提供公网ip，所以只好使用内网穿透的方式从公网访问家中服务。

某日想起来查看了一下 nps 服务端的设备监控，90% 的 CPU 使用率吓了我一跳。  经排查，原来是 nps 服务资源占用过高。

![docker部署aria2 示例图片 =1012x90](https://image.ermao.net/images/article/b06gglcq/image.png)

那么为什么一个小小的 nps 服务会有这么高的资源沿用呢？

原来是我使用了 [Aria2 Explorer](https://microsoftedge.microsoft.com/addons/detail/aria2-explorer/jjfgljkjddpcpfapejfkelkbjbehagbh?hl=zh-CN) 这个浏览器插件查看下载进度。但是配置时偷懒选择了 http 协议！

![docker部署aria2 示例图片 =618x301](https://image.ermao.net/images/article/b06gglcq/image-1.png)

这样在使用 Aria2 Explorer 查看下载进度时，会无限轮询后端 Aria2 服务，导致 CPU 占用率飙升。

我赶紧修改了配置，改为 ws 协议，果然 CPU 使用率下降了。

考虑到会有人和我一样使用 Aria2 Explorer，所以写了这篇文章，希望能帮到大家。

## 部署 Aria2

### 安装 docker

按 Docker 官方的[系统安装指南](https://docs.docker.com/engine/install/)选择发行版；Debian 可按[软件仓库安装步骤](https://docs.docker.com/engine/install/debian/#install-using-the-repository)操作。官方[便捷脚本说明](https://docs.docker.com/engine/install/debian/#install-using-the-convenience-script)不建议在生产环境使用脚本，应先阅读脚本和确认软件来源，不要把网络下载直接管道交给 shell 执行。

### 拉取镜像并运行

为每个实例生成独立随机 RPC 密钥，并保存在仅当前账户可读的文件中（已有实例不要直接覆盖原密钥）：

```bash
mkdir -p "$HOME/aria2"
umask 077
openssl rand -hex 32 > "$HOME/aria2/rpc-secret"
```

下面两段是二选一的启动示例，均读取同一个密钥文件；不要使用 `passwd`、默认口令或复用其他服务密码。[aria2 的 rpc-secret](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-secret)用于 RPC 鉴权，不提供传输加密。不要分享密钥文件或包含密钥的容器检查输出。


```bash

sudo docker run -d\
    --name aria2 \
    --restart unless-stopped \
    --log-opt max-size=1m \
    -e PUID=$UID \
    -e PGID=$GID \
    -e UMASK_SET=022 \
    -e RPC_SECRET="$(cat "$HOME/aria2/rpc-secret")" \
    -e RPC_PORT=6800 \
    -p 127.0.0.1:6800:6800 \
    -e LISTEN_PORT=6888 \
    -p 6888:6888 \
    -p 6888:6888/udp \
    -v /etc/aria2-config:/config \
    -v 下载存放的绝对路径:/downloads \
    p3terx/aria2-pro

```

将以上命令中中文的部分替换为你的实际情况。

例子：

```bash

sudo docker run -d\
    --name aria2 \
    --restart unless-stopped \
    --log-opt max-size=1m \
    -e PUID=$UID \
    -e PGID=$GID \
    -e UMASK_SET=022 \
    -e RPC_SECRET="$(cat "$HOME/aria2/rpc-secret")" \
    -e RPC_PORT=6800 \
    -p 127.0.0.1:6800:6800 \
    -e LISTEN_PORT=6888 \
    -p 6888:6888 \
    -p 6888:6888/udp \
    -v /etc/aria2-config:/config \
    -v ~/downloads:/downloads \
    p3terx/aria2-pro

```

RPC 主机端口默认绑定 `127.0.0.1`，仅供宿主机或终止于宿主机的私有通道访问；容器内部的监听地址与主机发布地址是两回事。根据 [Docker 端口发布说明](https://docs.docker.com/engine/network/port-publishing/)，省略主机 IP 会默认发布到所有接口。Docker 28.0.0 之前存在同二层网络访问回环发布端口的例外，应使用受支持的更新版本并核实网络隔离。`6888` 的 TCP/UDP 映射用于 BT/DHT，不是 RPC。

远程控制请使用 SSH 隧道、私有 VPN 通道，或具备访问限制的 TLS 反向代理。RPC 密钥不能替代网络访问控制，不要把 `6800` 直接暴露到公网。

## 安装与配置 Aria2 Explorer

### 安装

这里以 Edge 为例

打开网址：[aria2-explorer](https://microsoftedge.microsoft.com/addons/detail/aria2-explorer/jjfgljkjddpcpfapejfkelkbjbehagbh?hl=zh-CN)

点击获取

![docker部署aria2 示例图片 =1251x643](https://image.ermao.net/images/article/b06gglcq/image-2.png)

点击添加扩展

![docker部署aria2 示例图片 =448x209](https://image.ermao.net/images/article/b06gglcq/image-3.png)

### 配置

![docker部署aria2 示例图片 =1223x962](https://image.ermao.net/images/article/b06gglcq/image-4.png)

`Secret Key` 是你在 docker run 时设置的 `RPC_SECRET`

`RPC URL` 结尾需要加上 `/jsonrpc`。浏览器运行在宿主机，或已通过 SSH 隧道将本地端口转发到宿主机回环 RPC 时，可使用 `ws://127.0.0.1:6800/jsonrpc`。浏览器中的 `127.0.0.1` 指浏览器所在设备；其他局域网设备不能直接访问上述回环绑定。

`ws` 只适合本机或受保护的私有通道；公网入口必须使用 `wss://aria2.example.com/jsonrpc`，并设置访问限制。`wss` 只加密传输，并不会自动限制谁可以连接。

域名本身可以使用 WebSocket。经过 nginx 反向代理时，需要正确转发 `Upgrade` 和 `Connection` 请求头并完成 HTTP 101 升级；这不是“域名不能使用 ws”的限制，详见 [Nginx WebSocket 官方说明](https://nginx.org/en/docs/http/websocket.html)。

## 使用内网穿透的情况

### 配置 nginx

在反向代理服务器（内网穿透中转服务器）配置 nginx。隧道中转端口 `26800` 也必须只监听中转服务器回环地址或受访问控制的私网，不能裸露到公网。仅把 nginx 上游写成 `127.0.0.1:26800` 并不会改变隧道服务自身的监听地址。

下例默认只允许代理本机访问；部署者需按实际私有网段或可信客户端出口设置允许规则，并保留 `deny all`。不要为了连通而删除访问限制；有公网远程需求时可使用与客户端兼容的认证网关。

在`http`区块下加入如下配置，注意修改域名和端口，需要修改的地方加了备注：【按实际情况来写】

```nginx
# aria2
upstream aria2 {
    least_conn;
    server 127.0.0.1:26800 weight=10 max_fails=5 fail_timeout=5s;
    # 26800 是仅在中转服务器回环地址监听的隧道端口【按实际情况来写】
}
server {
    listen 80;
    listen 443 ssl;
    server_name aria2.example.com;
    # aria2.example.com 是给 aria2 配置的域名【按实际情况来写】
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    ssl_certificate  /etc/nginx/ssl/aria2.example.com.cer;
    ssl_certificate_key  /etc/nginx/ssl/aria2.example.com.key;
    # 上面两条是你域名的证书存放的绝对路径【按实际情况来写】
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    location / {
        allow 127.0.0.1;
        allow ::1;
        deny all;
        proxy_pass http://aria2;
        proxy_http_version 1.1;
        proxy_redirect     off;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_set_header   Connection       "Upgrade";
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size   0;
        proxy_connect_timeout      1800;     #nginx与upstream server的连接超时时间(单位：s)
        proxy_send_timeout         1800;     #nginx发送数据至 upstream server超时, 默认60s, 如果连续的60s内没有发送1个字节, 连接关闭
        proxy_read_timeout         1800;    #nginx接收 upstream server数据超时, 默认60s, 如果连续的60s内没有收到1个 字节, 连接关闭
        proxy_buffer_size          4k;       #代理请求缓存区_这个缓存区间会保存用户的头信息以供Nginx进行规则处理_一 般只要能保存下头信息即可
        proxy_buffers              4 32k;    #同上 告诉Nginx保存单个用的几个Buffer最大用多大空间      
        proxy_busy_buffers_size    64k;      #如果系统很忙的时候可以申请更大的proxy_buffers 官方推荐*2            proxy_temp_file_write_size 64k;   #proxy缓存临时文件的大小
    }
}
```

按 [Nginx TLS 文档](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_protocols)使用 TLS 1.2/1.3，并确认构建所用 OpenSSL 支持 TLS 1.3。WebSocket 代理不要求启用 HTTP/2；可选的 [`http2 on;`](https://nginx.org/en/docs/http/ngx_http_v2_module.html#http2) 指令要求 Nginx 1.25.1 或更新版本且包含 HTTP/2 模块，不要直接加到不支持的旧版本中。

检查配置成功后再重载（检查失败时不要重载）：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

连接后确认 WebSocket 握手返回 HTTP `101 Switching Protocols`；失败时检查路径、证书、访问限制及升级请求头。
