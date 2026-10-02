---
url: /en/blog/softrouter/index.md
description: >-
  Plan an OpenWrt main-router or side-router setup, secure the device, configure
  IPv4 and IPv6 deliberately, add a proxy client, and test failover and DNS.
---
A dedicated OpenWrt device can route selected phones, televisions, computers, and game consoles through a proxy without installing a client on every endpoint. It also becomes a critical part of the home network, so configuration, updates, DNS, IPv6, and recovery deserve more attention than the “plug it in and everything works” description often suggests.

This guide compares a main-router design with a same-subnet side router, then walks through the safer staged setup.

| Requirement | Suggested design | Trade-off |
| --- | --- | --- |
| Only selected devices use OpenWrt | Side router with a manually assigned gateway | Small blast radius; per-device configuration |
| Most devices use OpenWrt automatically | Main router distributes the side router as gateway and DNS | Central control; requires a tested failover procedure |
| OpenWrt owns the Internet connection | OpenWrt as the main router, with Wi-Fi access points behind it | Clean routing model and full control; greater migration and outage risk |

## What is a software router?

![Reader question about routing an Apple TV =870x889](https://image.ermao.net/images/blog/softrouter/image.png)

A software router runs routing software such as OpenWrt, RouterOS, or iKuai on general-purpose or embedded hardware. In this article, “soft router” means a separate OpenWrt device used as a router or gateway.

It can run DNS, firewall, routing, traffic-control, and proxy packages. Performance is determined by the CPU, network interfaces, drivers, encryption workload, ruleset, cooling, and firmware—not by the “software router” label. No model should be assumed to route gigabit encrypted traffic without measurement.

![NanoPi R4S-style OpenWrt device =855x645](https://image.ermao.net/images/blog/softrouter/image-1.png)

## Choose hardware and firmware

Common options include:

* compact ARM devices such as an R2S or R4S;
* x86 mini PCs based on J4125, N5105, N100, or later processors;
* an officially supported consumer router with sufficient storage and memory.

Before purchase, check:

1. exact OpenWrt support for the model and hardware revision;
2. the number and negotiated speed of Ethernet interfaces;
3. whether VLAN, PPPoE, Wi-Fi, and hardware offload needed by the design are supported;
4. expected encrypted throughput from reproducible tests;
5. thermal behavior and power reliability;
6. a documented recovery method.

Use a stable official OpenWrt image when possible. If a third-party image includes OpenClash or PassWall, verify its publisher, update policy, package sources, and image checksum. A seller's remote-assistance image may contain unknown credentials or services.

OpenWrt's [installation guide](https://openwrt.org/docs/guide-quick-start/factory_installation) stresses matching the exact hardware model and verifying the firmware checksum. For this site's illustrated steps, see [Install OpenWrt on a Software Router](/en/article/9zktdhyx/).

::: danger Secure the router first
Official OpenWrt does not ship with a universal `root` or `password` password. A fresh image can initially have no root password, while a vendor image may behave differently. Set a unique administrator password immediately, update the supported release, disable unwanted WAN administration, and review SSH keys and installed packages.
:::

## Choose the topology

### OpenWrt as the main router

```text
ISP modem/ONT → OpenWrt → Ethernet switch or Wi-Fi access point → clients
```

OpenWrt performs PPPoE or receives the WAN lease, then owns DHCP, DNS, IPv4/IPv6 routing, and firewall policy. This avoids the ambiguity of two routers on one subnet but makes the device essential to all connectivity.

### OpenWrt as a same-subnet side router

```text
ISP modem/ONT → existing main router ─┬→ ordinary clients
                                      └→ OpenWrt side router
```

Selected clients use OpenWrt as their IPv4 default gateway and usually as DNS. OpenWrt forwards traffic to the existing main router.

This design can reduce migration risk, but it is not automatically fail-safe. A client configured to use the side router loses its route when that device fails. Also, a correct implementation depends on forwarding, firewall zones, the proxy package's transparent-routing method, and IPv6 handling.

## Stage 1: reserve addresses and connect one test device

Write down the existing network before changing it:

* main-router address, such as `192.168.1.1`;
* DHCP pool, such as `192.168.1.100–192.168.1.200`;
* current DNS and IPv6 behavior;
* Wi-Fi and router recovery credentials.

Choose an unused OpenWrt address outside the DHCP pool, for example `192.168.1.254`. Prefer creating a reservation on the main router as well.

Connect an OpenWrt LAN port to a LAN port on the main router. Exact port names vary; do not assume `eth0` has the same role on every image.

Initially attach one computer directly to OpenWrt so that a wrong address does not disrupt the rest of the home.

## Stage 2: configure the OpenWrt LAN

In LuCI, open **Network → Interfaces → LAN → Edit** and set:

* **IPv4 address:** the reserved address, for example `192.168.1.254`;
* **IPv4 netmask:** `255.255.255.0` for this example;
* **IPv4 gateway:** the existing main router, `192.168.1.1`;
* **upstream DNS:** a resolver appropriate for the routing design.

Disable the OpenWrt IPv4 DHCP server on this shared LAN while the main router remains authoritative. Two uncoordinated DHCP servers can distribute conflicting gateways and DNS settings.

Save and apply, then reconnect to the new address. Confirm from OpenWrt:

```sh
ip route
ping -c 3 192.168.1.1
ping -c 3 1.1.1.1
nslookup openwrt.org
```

### Decide IPv6 explicitly

IPv6 clients normally learn a default router through Router Advertisements, not the IPv4 DHCP gateway field. A device may therefore send IPv6 traffic directly through the main router while IPv4 uses OpenWrt.

Choose and test one design:

* route and proxy IPv6 correctly through OpenWrt;
* deliberately keep IPv6 direct and accept the split behavior;
* disable IPv6 for the test network until it can be configured correctly.

Do not disable IPv6 across a production network merely to hide a configuration bug. OpenWrt's current [IPv6 documentation](https://openwrt.org/docs/guide-user/network/ipv6/configuration) covers DHCPv6, router advertisements, prefix delegation, and default routes.

## Stage 3: install and configure the proxy package

OpenClash and PassWall are third-party OpenWrt packages, not part of the base OpenWrt project. Package menus and supported cores change by build.

Before importing a subscription:

1. back up the current configuration;
2. confirm adequate storage;
3. obtain packages only from the project's documented release source;
4. verify architecture and OpenWrt-version compatibility;
5. understand whether the package uses firewall redirects, TProxy, policy routing, or another mode.

For a provider subscription, use the [2026 proxy-service review guide](/en/posts/vpn/) and begin with the smallest monthly plan. A subscription URL is a credential; do not paste it into an unknown converter or screenshot it.

### PassWall example

In the tested source build:

1. Open **Services → PassWall → Node Subscription**.
2. Add a descriptive name and the provider's compatible subscription URL.
3. Save, apply, and run a manual update.
4. Review the imported nodes and update log.
5. In **Basic Settings**, enable the service.
6. Select a TCP node and, only when supported and needed, an appropriate UDP node.
7. Use the documented DNS mode for that PassWall release.

A nearby Hong Kong or Japan node is not automatically the fastest; measure several nodes from the actual ISP at peak time.

After activation, test from OpenWrt itself and from one client. Confirm ordinary local sites, intended external sites, DNS resolution, and the egress address.

## Stage 4: route selected devices

For the lowest-risk rollout, change one client first.

Example IPv4 settings:

* address: an unused address such as `192.168.1.123`;
* netmask: `255.255.255.0`;
* gateway: OpenWrt at `192.168.1.254`;
* DNS: OpenWrt at `192.168.1.254` when its DNS/proxy design requires interception.

On iOS, open the connected Wi-Fi network, choose **Configure IP → Manual**, and enter the values. On Windows, edit the adapter's IPv4 settings or create a main-router DHCP reservation with the required gateway where the router supports it.

Avoid entering an external resolver such as `8.8.8.8` without understanding the policy. It can bypass the OpenWrt DNS path, fail on the local network, or reveal queries outside the intended route.

Verify:

```text
client → OpenWrt → main router → Internet
```

Use `traceroute` or `tracert`, a DNS-leak test appropriate to the threat model, and both IPv4 and IPv6 egress checks. Also verify access to printers, casting devices, and other LAN services.

## Stage 5: distribute the gateway automatically

Only after the single-client test is stable should the main router distribute OpenWrt as the IPv4 default gateway and DNS to a wider group.

In the main router's DHCP configuration, set:

* router/default-gateway option to `192.168.1.254`;
* DNS-server option to `192.168.1.254`.

Not every consumer router exposes these options. Do not confuse “DNS server” with “default gateway,” and do not run a second DHCP server as a workaround without a complete design.

Renew a test client's DHCP lease and confirm the values before rolling out. Keep documented recovery steps for restoring the main router's original gateway and DNS when OpenWrt is unavailable.

## Troubleshooting

### Local sites or all sites stop loading

* Confirm the client's gateway and DNS.
* Confirm OpenWrt has a default route through the main router.
* Check firewall forwarding and the proxy package log.
* Test IP connectivity separately from DNS.
* Check for an IPv6 route that bypasses or conflicts with the IPv4 design.

### Throughput is lower than expected

* Compare a direct main-router baseline.
* Test more than one node at the same time of day.
* Watch CPU load, temperature, interface negotiation, packet loss, and software-offload settings.
* Avoid assuming that an R2S, R4S, or N100 reaches a fixed speed in every protocol and ruleset.

### PS5 or Switch cannot join a game

Console connectivity depends on the game, platform service, NAT behavior, upstream carrier-grade NAT, UDP support, and the selected proxy node. Enabling UDP forwarding or a full-cone NAT option can change exposure and does not guarantee a favorable NAT type. Apply the smallest necessary rule and keep inbound firewall access closed unless explicitly required.

### The side router fails

Clients that use it as their gateway need another valid route. Restore the DHCP gateway on the main router, renew leases, or return manually configured clients to automatic addressing. Test this failure procedure before relying on the setup.

## Maintenance checklist

* Keep OpenWrt and proxy packages on supported releases.
* Export a configuration backup before upgrades; OpenWrt documents the [backup and restore workflow](https://openwrt.org/docs/guide-user/troubleshooting/backup_restore).
* Review enabled services and WAN firewall exposure.
* Protect the subscription URL and router backup as credentials.
* Monitor storage, temperature, clock synchronization, DNS, and certificate errors.
* Retest IPv4 and IPv6 after every topology or firmware change.

The original Chinese article ended with the first step of a separate R5S main-router example and did not include the remaining steps. This English version does not present that incomplete fragment as a working procedure; use the main-router topology above and the model-specific OpenWrt installation documentation instead.
