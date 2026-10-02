---
url: /en/article/b06gglcq/index.md
description: >-
  Deploy Aria2 Pro in Docker, connect a browser controller over authenticated
  WebSocket RPC, and configure a TLS reverse proxy without exposing RPC openly.
---
This guide deploys aria2 in Docker and connects a browser controller over JSON-RPC. It also explains why WebSocket RPC is preferable to aggressive HTTP polling and how to put an intentionally remote endpoint behind TLS and access controls.

## Background: Why HTTP Polling Caused High CPU Use

My home connection did not include a public IP address, so I used a tunneling service to reach services on the home network. The tunnel server later showed about 90% CPU usage:

![High CPU usage on the tunnel server =1012x90](https://image.ermao.net/images/article/b06gglcq/image.png)

The browser extension [Aria2 Explorer](https://microsoftedge.microsoft.com/addons/detail/aria2-explorer/jjfgljkjddpcpfapejfkelkbjbehagbh) had been configured with HTTP RPC:

![Aria2 Explorer using HTTP RPC =618x301](https://image.ermao.net/images/article/b06gglcq/image-1.png)

In this setup, repeated status polling generated substantial work for the tunnel. Switching the client to `ws://` reduced the observed load because a WebSocket connection could carry ongoing RPC traffic without repeatedly establishing the same request pattern.

That result is specific to this deployment. High CPU can also come from encryption, logging, reconnection loops, too many tasks, or the tunnel itself. Measure request rate and process usage before assuming WebSocket is the only fix.

## 1. Install Docker from Official Instructions

Use Docker's current [Debian installation guide](https://docs.docker.com/engine/install/debian/) or the matching page for your operating system. The original one-line `get.docker.com` command is convenient, but an administrator should review the script and package source before running it on a server.

Confirm the installation:

```bash
docker version
```

## 2. Prepare Directories and a Secret

Create persistent directories owned by the user who will manage downloads:

```bash
mkdir -p "$HOME/aria2/config" "$HOME/aria2/downloads"
```

Generate a long random RPC secret and store it in a file readable only by your account:

```bash
umask 077
openssl rand -hex 32 > "$HOME/aria2/rpc-secret"
```

Do not use `passwd`, the image's default token, or a secret copied from this page.

## 3. Start Aria2 Pro

The following command follows the current [Aria2 Pro Docker image documentation](https://github.com/P3TERX/Aria2-Pro-Docker), with an important security change: the RPC port is bound to loopback instead of every network interface.

```bash
docker run -d \
  --name aria2-pro \
  --restart unless-stopped \
  --log-opt max-size=1m \
  -e PUID="$(id -u)" \
  -e PGID="$(id -g)" \
  -e UMASK_SET=022 \
  -e RPC_SECRET="$(cat "$HOME/aria2/rpc-secret")" \
  -e RPC_PORT=6800 \
  -p 127.0.0.1:6800:6800 \
  -e LISTEN_PORT=6888 \
  -p 6888:6888/tcp \
  -p 6888:6888/udp \
  -v "$HOME/aria2/config:/config" \
  -v "$HOME/aria2/downloads:/downloads" \
  p3terx/aria2-pro
```

The variables mean:

* `PUID` and `PGID` map downloaded-file ownership to the current account.
* `RPC_SECRET` authenticates JSON-RPC calls.
* `127.0.0.1:6800:6800` prevents direct remote access to RPC.
* TCP and UDP port `6888` are used for BitTorrent and DHT listening.
* `/config` and `/downloads` persist configuration and downloaded files.

Inspect startup:

```bash
docker ps --filter name=aria2-pro
docker logs --tail 100 aria2-pro
```

Pin an image digest or tested version for production instead of accepting an unreviewed future `latest` image automatically.

::: danger Do not expose port 6800 directly
An aria2 RPC client can add downloads and influence files written by the service. A secret is necessary but is not a complete public-internet security layer. Prefer a private VPN. If remote web access is required, use TLS, authentication, source restrictions, and rate limits in front of the loopback-bound RPC service.
:::

## 4. Configure Aria2 Explorer

Install the extension from its official browser-store listing:

![Installing Aria2 Explorer =1251x643](https://image.ermao.net/images/article/b06gglcq/image-2.png)

![Confirming the extension =448x209](https://image.ermao.net/images/article/b06gglcq/image-3.png)

In its connection settings:

* **Secret Key** is the value stored in `~/aria2/rpc-secret`.
* **RPC URL** ends in `/jsonrpc`.
* Use `ws://` only on a trusted private network.
* Use `wss://` for a TLS-protected remote endpoint.

![Aria2 Explorer connection settings =1223x962](https://image.ermao.net/images/article/b06gglcq/image-4.png)

Private-network example:

```text
ws://192.168.1.20:6800/jsonrpc
```

Remote TLS example:

```text
wss://aria2.example.com/jsonrpc
```

The loopback binding in the Docker command means a LAN client cannot use the first example unless you deliberately change the binding and firewall rules. Keeping RPC private is the safer default.

## 5. Reverse Proxy WebSocket RPC with Nginx

The original configuration included obsolete TLS 1.1 and legacy 3DES/RSA cipher choices. Modern Nginx should use a current TLS baseline managed for your distribution. The essential WebSocket proxy configuration is:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream aria2_rpc {
    server 127.0.0.1:6800;
    keepalive 16;
}

server {
    listen 80;
    server_name aria2.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name aria2.example.com;

    ssl_certificate     /etc/letsencrypt/live/aria2.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aria2.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Add an authentication layer appropriate for your environment.
    # Restrict source addresses here as well when possible.

    location = /jsonrpc {
        proxy_pass http://aria2_rpc;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_buffering off;
    }
}
```

Replace the hostname and certificate paths. If a tunnel exposes aria2 on a different loopback port, use that port in the `upstream` block.

Validate before reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Use a private tunnel or VPN when possible. If the service must be internet-facing, add an authenticated gateway; the aria2 RPC secret travels within JSON-RPC calls and should not be the only boundary.

## 6. Troubleshoot CPU and Connection Problems

Check each layer:

```bash
docker stats aria2-pro
docker logs --tail 200 aria2-pro
sudo ss -lntp | grep -E ':(6800|6888)\\b'
```

On the proxy, inspect:

* request and WebSocket upgrade counts;
* repeated `101`, `400`, `401`, `499`, or `502` responses;
* reconnect loops;
* TLS CPU usage;
* tunnel process CPU and bandwidth; and
* whether the browser controller is open in many tabs.

Confirm that a successful WebSocket handshake returns HTTP `101 Switching Protocols`. If it does not, verify the `/jsonrpc` path and the `Upgrade` and `Connection` headers.

## Security and Legal Notes

Download only material you are authorized to obtain and share. Keep the container and host patched, limit write permissions on the download directory, scan untrusted files before opening them, and do not expose the Docker socket or aria2 configuration directory to unrelated services.
