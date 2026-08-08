---
url: /en/article/anytls-guide/index.md
description: >-
  An evidence-based AnyTLS guide covering protocol v2, padding and session
  reuse, current sing-box server and client configuration, TLS, security, and
  troubleshooting.
---
AnyTLS is a TLS-based proxy protocol designed to mitigate the recognizable **TLS-in-TLS** pattern created when applications send TLS traffic through another TLS tunnel. It combines configurable packet splitting and padding with multiplexed streams over reusable TLS sessions.

This English edition corrects several claims and obsolete fields in the Chinese source:

* the reference implementation is [`anytls/anytls-go`](https://github.com/anytls/anytls-go), not a protocol maintained solely by the sing-box team;
* sing-box supports AnyTLS inbound and outbound starting with version 1.12.0;
* authentication uses a password hash after the TLS handshake; a sing-box user `name` is a label, not a second credential;
* padding changes early TLS plaintext record sizes but does not guarantee indistinguishability or resistance to blocking;
* the old `inet4_address` TUN field is deprecated; current configurations use `address`;
* AnyTLS has a documented URI format, although client and subscription support still varies.

The examples use placeholders. Replace the domain and password, validate with the exact installed sing-box release, and follow the laws and network policies that apply to you.

## 1. Protocol overview

### 1.1 What AnyTLS is

AnyTLS places its authentication and multiplexed stream protocol inside a normal TLS connection:

```mermaid
flowchart LR
    App["Application"] --> Local["Local SOCKS/HTTP/TUN inbound"]
    Local --> Stream["AnyTLS logical stream"]
    Stream --> Session["Reusable AnyTLS session"]
    Session --> TLS["Authenticated TLS"]
    TLS --> Server["AnyTLS server"]
    Server --> Target["Destination"]
```

Its main pieces are:

* standard TLS for transport security and server authentication;
* a password-derived authentication request;
* logical streams multiplexed over reusable sessions;
* a configurable padding scheme for early writes;
* TCP proxying and UDP through sing-box's UDP-over-TCP protocol.

AnyTLS is not “any TLS protocol,” a VPN, or a guarantee that traffic looks exactly like a browser. The security of a deployment still depends on certificate validation, password secrecy, client integrity, server security, DNS and routing, and the threat model.

### 1.2 Development state

The reference protocol has evolved through two protocol versions. Protocol v2 was introduced in the reference implementation in April 2025 to improve stuck-tunnel detection and timeout behavior. It added:

* `cmdSYNACK` so a server can report stream-open success or failure;
* heartbeat request and response commands;
* server settings and version negotiation.

Version 0.0.10 later clarified `cmdFIN` behavior, and the reference command-line client added URI support by version 0.0.12. sing-box separately added AnyTLS inbound and outbound in its 1.12 line.

Do not infer implementation compatibility only from the word “AnyTLS.” Check protocol-v2 support, URI parsing, UDP behavior, and the exact client/core release.

### 1.3 Design properties

| Property | What it means | What it does not prove |
| --- | --- | --- |
| TLS transport | Standard certificate-based encrypted transport can be used | Browser-identical traffic or immunity to active probing |
| Padding scheme | Early writes can be split or padded to configured sizes | Undetectability or zero overhead |
| Session reuse | New logical streams can reuse a recent TLS session | Unlimited concurrency or better performance on every path |
| Password authentication | The server verifies a password-derived value | User anonymity, strong identity, or brute-force protection |
| Multi-user config | sing-box can associate several password entries with labels | Role-based access control or traffic quotas |
| UDP support | Implementations can carry UDP via UDP-over-TCP | Native-UDP latency or good performance under TCP loss |

### 1.4 Appropriate use

AnyTLS can be useful for:

* studying TLS-in-TLS fingerprint mitigation;
* testing a TLS-based proxy with adjustable early-packet shapes;
* a deployment already standardized on a compatible sing-box release;
* a network where session reuse provides a measurable benefit.

It may be a poor fit when:

* broad legacy-client support is required;
* native UDP behavior matters;
* the operator cannot maintain certificates and server security;
* an experimental or smaller ecosystem is unacceptable;
* the only justification is an unsupported “undetectable” claim.

### 1.5 Comparison boundaries

| Protocol family | Underlying transport | Important distinction |
| --- | --- | --- |
| AnyTLS | TCP + TLS | Early-write padding and mandatory session reuse in the reference protocol |
| Trojan | TCP + TLS | Different authentication and framing; broader older-client support |
| VLESS configurations | Varies | Security and behavior depend heavily on transport and TLS/REALITY choices |
| Hysteria 2 | QUIC/UDP | Different loss and congestion behavior; requires usable UDP |
| TUIC | QUIC/UDP | UDP-based multiplexing with a different protocol and ecosystem |

Labels such as “fastest,” “strongest camouflage,” or “lowest complexity” are not stable facts. Measure on the intended network and application.

## 2. How the protocol works

### 2.1 Authentication

After a successful TLS handshake, the client sends:

| Field | Size |
| --- | ---: |
| `sha256(password)` | 32 bytes |
| `padding0` length | big-endian `uint16` |
| `padding0` | variable |

If authentication succeeds, the peers enter the session loop. If it fails, the server closes the connection or an implementation may use a configured application-layer fallback.

The password is not sent as a username/password pair. In sing-box:

```json
{
  "name": "alice",
  "password": "replace-with-a-random-secret"
}
```

`name` identifies the entry in local configuration and logs; `password` supplies protocol authentication.

### 2.2 Session frames

After authentication, the frame layout is:

| Field | Type |
| --- | --- |
| command | `uint8` |
| stream ID | big-endian `uint32` |
| data length | big-endian `uint16` |
| data | variable |

The reference protocol defines:

```text
0  cmdWaste                 padding data to discard
1  cmdSYN                   open a logical stream
2  cmdPSH                   carry stream data
3  cmdFIN                   close a logical stream
4  cmdSettings              client settings
5  cmdAlert                 server warning and session close
6  cmdUpdatePaddingScheme   server-provided padding scheme
7  cmdSYNACK                stream-open result in protocol v2
8  cmdHeartRequest          heartbeat request in protocol v2
9  cmdHeartResponse         heartbeat response in protocol v2
10 cmdServerSettings        server settings in protocol v2
```

A client sends `cmdSettings` immediately after creating a session. For protocol v2, the server replies with server settings. `cmdSYNACK` can let a client detect a failed or stuck destination connection earlier than relying only on the operating system's TCP timeout.

### 2.3 Padding scheme

The default reference scheme is:

```text
stop=8
0=30-30
1=100-400
2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000
3=9-9,500-1000
4=500-1000
5=500-1000
6=500-1000
7=500-1000
```

Correct interpretation:

* `stop=8` applies padding processing to write indexes `0` through `7`; it does **not** mean eight connections.
* write `0` is the authentication write. It can add padding but cannot be split.
* later indexed writes can be split into the listed TLS-plaintext size ranges.
* if application data ends before a planned segment, `cmdWaste` can carry padding.
* `c` means stop the current `Write` after the preceding segment if no user data remains.
* sizes describe TLS plaintext before record encryption overhead.

The first session uses the implementation's default scheme. If the server reports a different scheme hash, it can send `cmdUpdatePaddingScheme`, and subsequent sessions for that server use the update.

Padding consumes bytes and changes record shape. A custom scheme should be tested for interoperability and overhead; novelty is not proof of better concealment.

### 2.4 Session reuse

The reference architecture is:

```text
TCP proxy request → Stream → Session → TLS → TCP
```

Before opening a new TLS session, a client checks its idle-session pool:

1. if an idle session exists, reuse the one with the highest sequence number;
2. otherwise create a new session with a monotonically increasing sequence;
3. after a stream finishes, return a healthy session to the idle pool;
4. periodically remove sessions idle beyond the configured timeout;
5. keep at least the configured number of idle sessions.

This favors recent sessions and removes older idle sessions first.

For sing-box AnyTLS outbound, current documented defaults are:

| Field | Default | Meaning |
| --- | ---: | --- |
| `idle_session_check_interval` | `30s` | how often to inspect idle sessions |
| `idle_session_timeout` | `30s` | close sessions idle longer than this |
| `min_idle_session` | `0` | minimum idle sessions retained during a check |

Keeping five or ten idle sessions is not a universal best practice. It increases open connections and server resources. Start with defaults and change one value only when measurements justify it.

### 2.5 TCP and UDP

For TCP, a stream sends the destination in the protocol's SOCKS-address form and then relays bidirectionally.

For UDP, the reference uses sing-box UDP-over-TCP v2, represented by a request to `sp.v2.udp-over-tcp.arpa`. TCP-based UDP transport can suffer head-of-line blocking under loss; test DNS, real-time media, and games separately.

## 3. Server deployment with sing-box

### 3.1 Requirements

There is no fixed minimum of one CPU, 256 MB RAM, or 10 Mbps that guarantees acceptable service. Capacity depends on:

* connection and stream count;
* TLS CPU cost;
* bandwidth and traffic mix;
* logging;
* operating-system and container overhead;
* certificate and monitoring services.

Use a supported 64-bit Linux release, current security updates, a domain you control, stable storage, and a recovery path. Confirm that TCP port 443 is not already used.

### 3.2 Install from the official repository

The current official APT instructions are:

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://sing-box.app/gpg.key \
  -o /etc/apt/keyrings/sagernet.asc
sudo chmod a+r /etc/apt/keyrings/sagernet.asc

cat <<'EOF' | sudo tee /etc/apt/sources.list.d/sagernet.sources
Types: deb
URIs: https://deb.sagernet.org/
Suites: *
Components: *
Enabled: yes
Signed-By: /etc/apt/keyrings/sagernet.asc
EOF

sudo apt-get update
sudo apt-get install sing-box
```

Review the downloaded key fingerprint and repository ownership through the [official package-manager documentation](https://sing-box.sagernet.org/installation/package-manager/) before trusting a new repository.

The official install script is:

```bash
curl -fsSL https://sing-box.app/install.sh | sh
```

Piping a network response into a shell is convenient but transfers code-execution trust to DNS, TLS, the domain, and the script publisher. For a production server, download, inspect, hash, and run a pinned version instead.

Check:

```bash
sing-box version
sing-box help
systemctl cat sing-box
```

Package installation normally supplies a systemd service; do not create a duplicate unit until the packaged unit has been inspected.

### 3.3 TLS certificate

Use a publicly trusted certificate when clients validate a public domain:

1. point the domain's A/AAAA records to the intended server;
2. choose ACME HTTP-01, TLS-ALPN-01, or DNS-01 based on port and DNS control;
3. obtain the certificate using Certbot, acme.sh, or another maintained ACME client;
4. configure automatic renewal;
5. use a deployment hook to validate and reload or restart sing-box;
6. test renewal before relying on it.

Example paths used below:

```text
/etc/sing-box/certs/fullchain.pem
/etc/sing-box/certs/privkey.pem
```

Do not copy certificate files manually after every renewal without a hook. Prefer stable paths managed by the ACME client, with read access granted only to the sing-box service account.

### 3.4 Generate a strong password

```bash
openssl rand -base64 32
```

Use a unique random value per user. Store it in a secret manager or a root-readable configuration, not shell history or a public URI.

### 3.5 Minimal server configuration

Create the configuration at the path used by the installed package, commonly `/etc/sing-box/config.json`:

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "anytls",
      "tag": "anytls-in",
      "listen": "0.0.0.0",
      "listen_port": 443,
      "users": [
        {
          "name": "alice",
          "password": "REPLACE_WITH_A_RANDOM_SECRET"
        }
      ],
      "tls": {
        "enabled": true,
        "certificate_path": "/etc/sing-box/certs/fullchain.pem",
        "key_path": "/etc/sing-box/certs/privkey.pem"
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "final": "direct"
  }
}
```

Use `listen: "::"` only after verifying the host's IPv6 and dual-stack socket behavior. Open the corresponding firewall family.

Validate before restart:

```bash
sudo sing-box check -c /etc/sing-box/config.json
sudo systemctl restart sing-box
sudo systemctl status sing-box --no-pager
sudo journalctl -u sing-box --output cat -e
```

### 3.6 Explicit padding and multiple users

The default scheme does not need to be copied into configuration. If an explicit server scheme is required:

```json
{
  "type": "anytls",
  "tag": "anytls-in",
  "listen": "0.0.0.0",
  "listen_port": 443,
  "users": [
    {
      "name": "alice",
      "password": "REPLACE_ALICE_SECRET"
    },
    {
      "name": "bob",
      "password": "REPLACE_BOB_SECRET"
    }
  ],
  "padding_scheme": [
    "stop=8",
    "0=30-30",
    "1=100-400",
    "2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000",
    "3=9-9,500-1000",
    "4=500-1000",
    "5=500-1000",
    "6=500-1000",
    "7=500-1000"
  ],
  "tls": {
    "enabled": true,
    "certificate_path": "/etc/sing-box/certs/fullchain.pem",
    "key_path": "/etc/sing-box/certs/privkey.pem"
  }
}
```

sing-box documents `padding_scheme` as a line array. Test every client implementation before changing it. Separate passwords allow revocation, but AnyTLS itself does not provide quotas or role-based authorization.

### 3.7 Firewall

Open only the selected TCP listener and a restricted administration path. For UFW:

```bash
sudo ufw allow 443/tcp comment 'AnyTLS'
sudo ufw status numbered
```

Do not enable a default-deny firewall over a remote SSH session until a verified SSH allow rule and recovery console exist. Avoid an unrestricted `allow ssh` if the administration source can be limited.

For firewalld:

```bash
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

Do not mix UFW, firewalld, direct iptables rules, and a cloud firewall without understanding rule order and persistence.

### 3.8 Service and port checks

```bash
sudo systemctl enable --now sing-box
sudo ss -tlnp | grep ':443'
sudo journalctl -u sing-box --output cat -f
```

Check the cloud-provider security group and any upstream NAT in addition to the host firewall.

### 3.9 Docker

The official image is `ghcr.io/sagernet/sing-box`. A minimal Compose example with an explicitly published TCP port is:

```yaml
services:
  sing-box:
    image: ghcr.io/sagernet/sing-box
    container_name: sing-box
    restart: unless-stopped
    ports:
      - "443:443/tcp"
    volumes:
      - ./config:/etc/sing-box:ro
      - ./data:/var/lib/sing-box
    command: -D /var/lib/sing-box -C /etc/sing-box run
```

Place `config.json` and a read-only `certs` directory under `./config`. Pin an immutable image digest or version for production rather than using an unreviewed moving tag.

Validate with the same image before starting:

```bash
docker compose run --rm sing-box \
  -D /var/lib/sing-box -C /etc/sing-box check
docker compose up -d
docker compose logs -f sing-box
```

Container isolation does not remove the need for certificate renewal, firewalling, secret protection, updates, and resource limits.

## 4. Client configuration

### 4.1 Compatibility

Use a maintained application or core that explicitly documents AnyTLS for the installed version:

| Platform | Practical route |
| --- | --- |
| Windows | sing-box command line or a maintained GUI bundling a compatible sing-box core |
| macOS | official sing-box graphical client or compatible command line |
| Linux | official package or release binary |
| Android | official sing-box graphical client or another verified compatible core |
| iOS/iPadOS | official sing-box graphical client or another verified compatible application |

The original article lists v2rayN, v2rayNG, and Shadowrocket as supporting options. Support can change by release and bundled core, so verify the application's own release notes instead of importing blindly.

### 4.2 AnyTLS outbound fields

```json
{
  "type": "anytls",
  "tag": "anytls-out",
  "server": "proxy.example.com",
  "server_port": 443,
  "password": "REPLACE_WITH_THE_SERVER_SECRET",
  "idle_session_check_interval": "30s",
  "idle_session_timeout": "30s",
  "min_idle_session": 0,
  "tls": {
    "enabled": true,
    "server_name": "proxy.example.com"
  }
}
```

Required fields are `server`, `server_port`, `password`, and `tls`. `server_name` verifies the hostname in the certificate and is normally sent as SNI when it is a domain.

Never set `"insecure": true` merely to hide a certificate error. It disables normal certificate verification and permits an active man-in-the-middle with any certificate.

### 4.3 Local SOCKS and HTTP proxy

A portable command-line client can expose a loopback-only mixed inbound:

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 2080
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "proxy.example.com",
      "server_port": 443,
      "password": "REPLACE_WITH_THE_SERVER_SECRET",
      "tls": {
        "enabled": true,
        "server_name": "proxy.example.com"
      }
    }
  ],
  "route": {
    "final": "anytls-out"
  }
}
```

Save it as `client.json`, validate it with the same binary, and run:

```bash
sing-box check -c client.json
sing-box run -c client.json
```

Configure the application to use `127.0.0.1:2080` as SOCKS or HTTP. Applications outside that proxy continue to connect directly.

Do not listen on `0.0.0.0` unless remote proxy access is intentional, authenticated, firewalled, and understood.

### 4.4 Windows

Current official package documentation lists:

```powershell
winget install sing-box
```

Scoop and Chocolatey are also listed, but package ownership and build flags must be checked. Official release archives are available from the [SagerNet/sing-box releases](https://github.com/SagerNet/sing-box/releases).

Run PowerShell:

```powershell
sing-box check -c .\client.json
sing-box run -c .\client.json
```

The Chinese source suggested:

```powershell
Start-Process -NoNewWindow sing-box -ArgumentList "run -c client.json"
```

That only starts a process; it does not create a robust service, secure the configuration, capture failures, or guarantee startup after reboot. Prefer the maintained graphical client or a properly scoped service manager.

### 4.5 macOS

The official documentation lists Homebrew:

```bash
brew install sing-box
```

It also warns that some third-party package builds can modify build tags. If a required feature is missing, compare with the official release and report packaging issues to the package maintainer.

For manual command-line testing:

```bash
sing-box check -c "$PWD/client.json"
sing-box run -c "$PWD/client.json"
```

The Chinese source included a hand-written LaunchAgent with `KeepAlive`. A permanent agent should instead use the actual installed binary path, restricted configuration permissions, controlled logging, and backoff to avoid rapid crash loops. The official graphical application is usually safer for a desktop user.

### 4.6 Linux

Install from the official repository as described in the server section, or use an official release for the correct architecture.

Package installation normally includes a systemd unit:

```bash
sudo sing-box check -c /etc/sing-box/config.json
sudo systemctl enable --now sing-box
sudo systemctl status sing-box --no-pager
```

Inspect `systemctl cat sing-box` and the service's expected config directory before replacing any unit. Run as a dedicated user where the selected inbound and routing features permit it.

### 4.7 Android and Apple platforms

Graphical sing-box clients integrate with the platform VPN API. Import only configuration from a trusted source and review permissions and routing behavior.

If a raw TUN example is used with a current compatible command-line build, the address field is:

```json
{
  "type": "tun",
  "tag": "tun-in",
  "address": [
    "172.19.0.1/30"
  ],
  "auto_route": true,
  "strict_route": true
}
```

The older `inet4_address` field shown in the Chinese source was merged into `address` and removed from newer configurations. Platform graphical clients may supply their own TUN settings; do not assume a desktop raw configuration imports unchanged on Android or iOS.

Verify:

* IPv4 and IPv6 public addresses;
* DNS behavior;
* application exclusions;
* local-network access;
* behavior when the tunnel stops;
* battery and background-operation limits.

### 4.8 AnyTLS URI

The reference URI format is:

```text
anytls://[password@]hostname[:port]/?[key=value]&[key=value]...#display-name
```

Supported reference fields include:

* password in the URI user-information component, percent-encoded when required;
* server host and optional port, defaulting to 443;
* `sni`;
* `insecure=0` or `insecure=1`;
* a percent-encoded fragment for the display name.

Example:

```text
anytls://REPLACE_SECRET@proxy.example.com:443/?sni=proxy.example.com#Home
```

Avoid `insecure=1` for a public deployment. A URI contains a credential: treat it like a password, do not place it in analytics, chats, screenshots, issue reports, or public repositories.

Third-party extensions may not interoperate. JSON remains the more explicit format for sing-box-specific session fields.

## 5. Advanced configuration

### 5.1 Multiple users

Use one random password per person or device group:

```json
"users": [
  {
    "name": "alice",
    "password": "REPLACE_ALICE_SECRET"
  },
  {
    "name": "bob",
    "password": "REPLACE_BOB_SECRET"
  }
]
```

This permits individual revocation and log attribution when logging is enabled. Do not publish user labels if they contain personal information.

### 5.2 Custom padding

The Chinese source offers:

```json
"padding_scheme": [
  "stop=10",
  "0=50-50",
  "1=200-500",
  "2=500-800,c,800-1500",
  "3=10-10,500-1000",
  "4=500-1500",
  "5=500-1500",
  "6=500-1500",
  "7=500-1500"
]
```

This is only an example, not a recommended or proven scheme. It leaves indexes 8 and 9 undefined before `stop=10`, so those writes are sent without a defined padding rule. Measure bandwidth overhead and confirm all clients receive and apply the update.

### 5.3 Session tuning

An experimental outbound:

```json
{
  "type": "anytls",
  "tag": "anytls-out",
  "server": "proxy.example.com",
  "server_port": 443,
  "password": "REPLACE_WITH_THE_SERVER_SECRET",
  "idle_session_check_interval": "60s",
  "idle_session_timeout": "120s",
  "min_idle_session": 3,
  "tls": {
    "enabled": true,
    "server_name": "proxy.example.com"
  }
}
```

Tradeoffs:

* a shorter check detects stale idle sessions sooner but wakes more often;
* a longer timeout retains sockets and server state;
* a larger minimum can reduce setup latency for bursts but creates idle connections.

Test cold-start latency, burst concurrency, open-file use, memory, and recovery after a path change. Do not copy the source's suggested ranges of 3–10 idle sessions without data.

### 5.4 Running other protocols

sing-box can listen for other protocols on different ports. Each inbound needs compatible clients, authentication, firewall rules, and a security review. Reusing one certificate is possible when names and permissions fit, but expands the consequences of a key compromise.

The Chinese source combines AnyTLS on 443 with VLESS on 8443. It also sets `xtls-rprx-vision`, whose support and semantics are version-specific. Build the second inbound from the current official documentation rather than copying that dated fragment.

## 6. Security

### 6.1 TLS

* use a certificate whose name matches the client's `server_name`;
* keep certificate renewal automatic and monitored;
* never expose the private key;
* rely on maintained safe defaults unless a specific interoperability need exists;
* do not enable `insecure`;
* synchronize system time;
* protect the account and API at the DNS provider and ACME client.

Example permissions must match the service user:

```bash
sudo chown -R root:sing-box /etc/sing-box/certs
sudo chmod 750 /etc/sing-box/certs
sudo chmod 640 /etc/sing-box/certs/privkey.pem
sudo chmod 644 /etc/sing-box/certs/fullchain.pem
```

Replace the group if the packaged service uses another identity. Test that the service can read the key without making it world-readable.

### 6.2 Passwords

* use at least 32 random bytes rather than a memorable dictionary password;
* use a unique secret per entry;
* revoke a leaked URI immediately;
* avoid secrets in command-line arguments, shell history, environment dumps, or logs;
* rotate when exposure or access changes justify it.

Generation:

```bash
openssl rand -base64 32
```

### 6.3 Firewall and administration

* expose only required listener ports;
* restrict SSH by source, key authentication, and rate controls where practical;
* keep a provider console before changing remote firewall rules;
* use host and cloud firewalls consistently;
* patch the kernel, TLS library, sing-box, container runtime, and ACME client.

Restricting AnyTLS itself to a fixed private source range is possible only when clients actually originate there; otherwise it will block mobile or changing access networks.

### 6.4 Logging

A lower-noise configuration:

```json
{
  "log": {
    "level": "warn",
    "timestamp": true
  }
}
```

Logs can contain destination, user-label, IP, error, and timing information. Collect only what is operationally required, restrict access, define retention, and rotate safely.

If logging to a file, create the directory with the service identity and use a logrotate policy tested against the application's reopen behavior. A `systemctl reload` in a post-rotate script is not useful unless the unit and application support the expected reload.

### 6.5 Operational checklist

1. Pin and test updates before deployment.
2. Validate configuration before every restart.
3. Monitor certificate expiry and renewal failures.
4. Monitor process health, file descriptors, memory, CPU, disk, and bandwidth.
5. Keep encrypted backups of configuration without reusing leaked secrets.
6. Use least privilege where listener ports and routing features allow it.
7. Revoke former users individually.
8. Test recovery from a server or DNS failure.

## 7. Troubleshooting

### 7.1 Cannot connect

Server checks:

```bash
sudo systemctl status sing-box --no-pager
sudo sing-box check -c /etc/sing-box/config.json
sudo ss -tlnp | grep ':443'
sudo journalctl -u sing-box --output cat -n 100
```

Network and certificate checks:

```bash
nc -vz proxy.example.com 443
openssl s_client \
  -connect proxy.example.com:443 \
  -servername proxy.example.com \
  -verify_return_error
```

Check:

* A and AAAA records point to the intended host;
* cloud and host firewalls allow TCP 443;
* no other process owns the port;
* server and client use the same password;
* the certificate chain is complete and not expired;
* client `server_name` matches a certificate SAN;
* both implementations support a compatible AnyTLS version.

### 7.2 TLS succeeds but proxying fails

Validate the client separately:

```bash
sing-box check -c client.json
```

Then:

* confirm the application uses the local SOCKS/HTTP port;
* check that the intended outbound is `route.final`;
* test DNS through and outside the configured path;
* test a destination by IP and by domain;
* check server outbound routing and provider egress firewall;
* check UDP separately from TCP;
* inspect both client and server logs at a temporary appropriate level.

Do not paste production configs containing passwords into public support channels.

### 7.3 TUN connects but traffic loops

* set `route.auto_detect_interface` where supported;
* use a current `address` field;
* verify DNS hijacking and resolver routes;
* check IPv6;
* exclude required LAN prefixes;
* confirm the AnyTLS server address itself is not sent back into the TUN;
* review other VPNs, containers, virtualization, and policy-routing tables.

TUN behavior differs across Linux, Windows, macOS, Android, and Apple graphical clients.

### 7.4 Low speed or high latency

Measure:

```bash
top
ss -s
mtr proxy.example.com
```

Use `iperf3` only against a server you control and have configured for the test; an AnyTLS listener is not automatically an iperf server.

Compare:

* direct path to the proxy server;
* AnyTLS application throughput;
* CPU and TLS load;
* packet loss and retransmissions;
* session counts and file descriptors;
* default versus custom padding;
* default session settings versus one controlled change.

TCP-based UDP can perform poorly under loss. Changing padding or keeping more idle sessions cannot repair a bad underlying path.

### 7.5 Certificate errors

```bash
openssl x509 \
  -in /etc/sing-box/certs/fullchain.pem \
  -noout -dates -subject -issuer

openssl x509 \
  -in /etc/sing-box/certs/fullchain.pem \
  -noout -ext subjectAltName

openssl s_client \
  -connect proxy.example.com:443 \
  -servername proxy.example.com \
  -showcerts -verify_return_error
```

Check renewal logs, deployed paths, file permissions, and the service reload. Do not “solve” verification by enabling `insecure`.

### 7.6 Common errors

| Symptom | Likely areas |
| --- | --- |
| certificate verification failed | name mismatch, incomplete chain, expiry, clock, untrusted CA |
| connection refused | service stopped, wrong address, port not published, process not listening |
| authentication failed | wrong password, wrong server, URI decoding error |
| timeout | routing, firewall, DNS, packet loss, stuck or incompatible session |
| TLS handshake failed | certificate, SNI, ALPN/TLS settings, middlebox, time |
| user not found | implementation-specific label/config issue; protocol auth still depends on password |
| TCP works but UDP fails | UDP-over-TCP support, DNS, application behavior, head-of-line blocking |

## 8. Conclusions

### Advantages

* standard TLS certificate validation is available;
* early-write padding is configurable;
* session reuse can reduce repeated connection setup;
* sing-box provides inbound and outbound support in one configuration model;
* multiple password entries are simple to revoke independently.

### Limitations

* a smaller ecosystem than older proxy protocols;
* implementation and URI compatibility still varies;
* TCP transport and UDP-over-TCP inherit TCP loss behavior;
* custom padding adds overhead without guaranteed censorship resistance;
* secure deployment still requires certificate, secret, host, and network operations.

### When to choose it

Use AnyTLS when its specific padding and session model matches a measured need and all required clients support it. Prefer a more mature or compatible option when fleet support, native UDP, or long-established operations matter more.

### Baseline configurations

For a baseline server, use the minimal server configuration in section 3.5, default padding, one unique random password per user, a validated public certificate, and a short operational test.

For a baseline client, use section 4.3 with:

* `min_idle_session: 0` or omitted;
* normal certificate verification;
* a loopback-only local inbound;
* no custom padding;
* current sing-box on both sides.

Tune only after gathering evidence.

## 9. Related guides

### Client configuration

* [Clash Meta setup for Android](/en/article/eh8f4n86/)
* [Clash Verge setup for Windows, Linux, and macOS](/en/article/0gematwc/)
* [Shadowrocket setup for iOS](/en/article/z747kgjd/)

### Background

* [Proxies, Clash, and VPNs](/en/article/fanqiang2/)
* [How to Identify a Route Type](/en/article/r50bpg9j/)
* [Router VPN and Proxy Setup](/en/article/fanqiang/)

### Provider selection

* [Proxy-service review index](/en/posts/vpn/)
* [How to Choose a Provider](/en/article/choose-good-airport/)
* [Provider shutdown and risk archive](/en/scamvpn/jichang-paolu-huizong/)

## Primary references

* [AnyTLS reference implementation and FAQ](https://github.com/anytls/anytls-go)
* [AnyTLS protocol specification](https://github.com/anytls/anytls-go/blob/main/docs/protocol.md)
* [AnyTLS URI specification](https://github.com/anytls/anytls-go/blob/main/docs/uri_scheme.md)
* [sing-box AnyTLS inbound](https://sing-box.sagernet.org/configuration/inbound/anytls/)
* [sing-box AnyTLS outbound](https://sing-box.sagernet.org/configuration/outbound/anytls/)
* [sing-box package installation](https://sing-box.sagernet.org/installation/package-manager/)
* [sing-box Docker installation](https://sing-box.sagernet.org/installation/docker/)

::: warning Version scope
AnyTLS and sing-box are evolving. This page was checked against the official sources available on July 31, 2026. Recheck the current documentation and migration notes before deploying a newer release.
:::
