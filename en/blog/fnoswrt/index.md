---
url: /en/blog/fnoswrt/index.md
description: >-
  Create an OpenWrt x86-64 VM on FNOS, attach it safely to the LAN, assign a
  non-conflicting static address, disable competing DHCP, and test client
  routing.
---
After my R5S router failed, I used the virtual-machine feature in FNOS to run OpenWrt as a side router on the home LAN. This article records that setup and adds the network-safety checks that were implicit in the original walkthrough.

## Background

My R5S had been running for two years and nine months before it failed on November 19, 2025:

![Failed R5S router =1480x876](https://image.ermao.net/images/blog/fnoswrt/image.png)

Repeated hard power-offs, limited cooling, or experimental firmware may have contributed, but there is not enough evidence to assign a cause. The replacement was an OpenWrt virtual machine on a small FNOS server:

![FNOS server used for the replacement =1571x1032](https://image.ermao.net/images/blog/fnoswrt/image-1.png)

::: danger Plan a recovery path first
A mistake in the VM bridge, gateway, DHCP, or firewall can disconnect the NAS or the whole LAN. Keep local console access to FNOS, record the main router's address and the NAS network settings, and make changes during a maintenance window. Do not make the OpenWrt VM the only path to the FNOS recovery interface.
:::

## 1. Choose an OpenWrt Image

The original build used `openwrt.ai`, a third-party custom builder:

![Third-party OpenWrt image builder =1605x1275](https://image.ermao.net/images/blog/fnoswrt/image-2.png)

For a smaller supply-chain risk, start with the official [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/) and select:

* target: `x86/64`;
* a stable release rather than a snapshot unless a snapshot is required;
* `generic-ext4-combined-efi.img.gz` or `generic-squashfs-combined-efi.img.gz` for a UEFI VM; or
* the non-`efi` combined image if the VM is configured for legacy BIOS.

The exact filenames change by release. OpenWrt's [x86 installation guide](https://openwrt.org/docs/guide-user/installation/openwrt_x86) explains the image variants. Ext4 is easier to resize and edit directly; squashfs offers OpenWrt's read-only base plus writable overlay and supports reset behavior.

![Downloading the compiled image =1514x705](https://image.ermao.net/images/blog/fnoswrt/image-3.png)

Verify the image checksum against the official release directory. If FNOS does not accept `.img.gz`, decompress a copy:

```bash
gzip -dk openwrt-*-combined-efi.img.gz
```

Do not add packages or scripts from an unknown custom build merely for convenience. Every preinstalled plugin becomes part of the router's trust boundary.

## 2. Upload the Disk Image

Upload the image through FNOS File Manager, SMB, or another authenticated local transfer method:

![Uploading the OpenWrt image to FNOS =1418x840](https://image.ermao.net/images/blog/fnoswrt/image-4.png)

Keep it in a directory accessible to the VM manager but not writable by untrusted network users.

## 3. Create the VM

Open the FNOS **Virtual Machine** application and choose **New VM**. Install the VM application from App Center first if it is absent:

![Opening the FNOS VM application =1429x865](https://image.ermao.net/images/blog/fnoswrt/image-5.png)

![Creating a new VM =874x724](https://image.ermao.net/images/blog/fnoswrt/image-6.png)

Name the VM and select Linux:

![Selecting the guest OS =877x719](https://image.ermao.net/images/blog/fnoswrt/image-7.png)

Use the uploaded OpenWrt image as the system disk:

![Selecting the OpenWrt disk image =876x729](https://image.ermao.net/images/blog/fnoswrt/image-8.png)

Reasonable starting resources for basic routing are one virtual CPU, 512 MB RAM, and a small expandable virtual disk. Traffic inspection, large rule sets, VPN encryption, or extra packages may need substantially more. Measure rather than copying a fixed allocation.

![Selecting virtual storage =896x725](https://image.ermao.net/images/blog/fnoswrt/image-9.png)

Enable automatic startup only after networking and clean shutdown have been tested. Otherwise a broken VM may interfere with the LAN after every NAS reboot.

### Attach a virtual network interface

Add one virtual NIC connected to the LAN bridge:

![Adding the VM network interface =880x714](https://image.ermao.net/images/blog/fnoswrt/image-10.png)

The source FNOS version required OVS to make a physical interface available to VMs. If the interface is missing, check **Settings → Network Settings** for the OVS option on that port.

Enabling OVS changes the host's network topology and may briefly interrupt FNOS connectivity. Confirm current FNOS documentation for your installed version, preserve the host IP configuration, and make the change with local console access. UI labels can differ after updates.

Hardware passthrough is not required for the one-NIC side-router design.

## 4. Boot and Open the Console

Start the VM:

![Starting the OpenWrt VM =1136x453](https://image.ermao.net/images/blog/fnoswrt/image-11.png)

Open the VNC console:

![Opening the VNC console =1139x272](https://image.ermao.net/images/blog/fnoswrt/image-12.png)

Wait for the OpenWrt login prompt. If it does not boot, verify that the VM firmware mode matches the image (`efi` versus legacy), that the decompressed disk was attached as a writable system disk, and that its architecture is x86-64.

## 5. Assign a Safe Static LAN Address

Choose an unused address in the main LAN, preferably outside the DHCP pool or reserved for the VM.

Example network:

| Role | Address |
| --- | --- |
| Main router | `192.168.1.1` |
| OpenWrt VM | `192.168.1.32` |
| Subnet | `192.168.1.0/24` |

Before committing, test from another host:

```bash
ping 192.168.1.32
```

No response does not prove the address is free, so also inspect the main router's leases and ARP table.

The original article edited `/etc/config/network` directly:

![Opening the OpenWrt network configuration =776x345](https://image.ermao.net/images/blog/fnoswrt/image-13.png)

![Editing the LAN settings =641x502](https://image.ermao.net/images/blog/fnoswrt/image-14.png)

Using UCI reduces syntax mistakes. Adjust the example addresses:

```sh
uci set network.lan.proto='static'
uci set network.lan.ipaddr='192.168.1.32'
uci set network.lan.netmask='255.255.255.0'
uci set network.lan.gateway='192.168.1.1'
uci -q delete network.lan.dns
uci add_list network.lan.dns='192.168.1.1'
uci commit network
/etc/init.d/network restart
```

Do not change `network.lan.device` without checking `ip link` and the existing configuration; interface names vary by image and VM type.

Verify:

```sh
ip -br address
ip route
ping -c 3 192.168.1.1
```

![Verifying the assigned address =954x468](https://image.ermao.net/images/blog/fnoswrt/image-15.png)

If connectivity is lost, return through VNC and restore the previous values.

## 6. Secure the OpenWrt Interface

Open:

```text
http://192.168.1.32/
```

![OpenWrt first-login screen =820x702](https://image.ermao.net/images/blog/fnoswrt/image-16.png)

Set a unique administrator password immediately. Prefer HTTPS for administration once configured, restrict the management interface to the trusted LAN, disable password-based SSH if key-only access is practical, and install only packages you can maintain.

### Disable competing DHCP

In a one-LAN side-router design, the main router normally remains the DHCP server. Disable OpenWrt's LAN DHCP server unless you have explicitly planned a migration:

```sh
uci set dhcp.lan.ignore='1'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

Two uncoordinated DHCP servers can assign conflicting gateways and DNS settings.

## 7. Enable Side-Router Behavior

The custom firmware in the source exposed **System → Setup Wizard → Network Settings → Side-router mode**:

![Side-router mode in the custom firmware =1636x1205](https://image.ermao.net/images/blog/fnoswrt/image-17.png)

That wizard is not part of every stock OpenWrt image. Its behavior depends on the custom package: it may change forwarding, firewall, DNS, masquerading, and redirect rules. Review the generated configuration before trusting it.

For stock OpenWrt, there is no universal single checkbox. The correct design depends on what the VM provides:

* ordinary IP forwarding;
* DNS filtering;
* policy-based routing;
* a VPN or proxy gateway; or
* transparent interception.

Configure only the required function from maintained OpenWrt package documentation. Confirm:

```sh
sysctl net.ipv4.ip_forward
uci show firewall
ip rule
ip route show table all
```

Do not expose LuCI, SSH, DNS recursion, or proxy listeners to the public internet.

## 8. Test One Client Before Changing the LAN

The side router does not need to assign client addresses. On one test device, retain an address in the normal LAN but set:

* default gateway: `192.168.1.32`;
* DNS server: the OpenWrt address only if OpenWrt is intentionally providing DNS; otherwise use the planned resolver; and
* subnet mask: the existing LAN mask.

![Setting the side router as a client gateway =680x599](https://image.ermao.net/images/blog/fnoswrt/image-18.png)

Windows example:

![Opening Windows network properties =487x498](https://image.ermao.net/images/blog/fnoswrt/image-19.png)

![Editing IPv4 settings =1398x1039](https://image.ermao.net/images/blog/fnoswrt/image-20.png)

Test:

```powershell
ipconfig /all
tracert 1.1.1.1
nslookup example.com
```

Also test local services, IPv6, large downloads, DNS failure behavior, and recovery after restarting the VM. If the OpenWrt VM fails, restore the client's gateway and DNS to the main router.

Only after one client works reliably should you consider DHCP options or policy rules that direct more devices through the VM. Keep a bypass path for the FNOS host itself.

## Conclusion

An FNOS-hosted OpenWrt VM can replace some functions of a small physical router, but the VM, NAS bridge, storage, and host now share a failure domain. Back up `/etc/config`, record the FNOS VM and OVS settings, retain a direct route to the main router, and test restoration—not just normal forwarding.

## Related Guides

* [Back up FNOS files to OneDrive with Docker](/en/article/aofygutj/)
* [Proxy-service reviews and risk notes](/en/posts/vpn/)
