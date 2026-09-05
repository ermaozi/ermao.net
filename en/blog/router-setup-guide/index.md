---
url: /en/blog/router-setup-guide/index.md
description: >-
  A model-specific guide to backing up a Netcore N60 Pro, installing U-Boot and
  ImmortalWRT, configuring network access, and adding OpenClash for whole-home
  routing.
---
Opening a proxy client, waiting for it to connect, and checking that it works is repetitive on every device. Moving policy routing to the router can let phones, computers, tablets, televisions, and consoles use one managed network path. Router-level tools can also centralize DNS policy and filtering.

This guide translates the original hands-on procedure for a **Netcore N60 Pro**. It installs **ImmortalWRT** and then **OpenClash**. Other models, hardware revisions, bootloaders, flash layouts, and firmware images can require completely different steps.

::: danger Before writing flash
The `dd` and `mtd write` commands below are destructive and model-specific. Do not copy them to another router. First verify the exact model and hardware revision, the current `/proc/mtd` mapping, image checksums, partition names, serial or programmer recovery method, and a complete off-device backup. A wrong image or partition can permanently brick the router.
:::

## What a configurable router changes

The central idea is to run policy-routing software at the network exit so downstream devices do not each need a separate configuration.

* **Typical consumer router:** often uses a restricted stock system and cannot install arbitrary routing packages.
* **OpenWrt-capable router:** runs an extensible Linux-based system and may install packages, containers, or custom network services when hardware resources allow.

The original walkthrough uses a Netcore N60 Pro because a compatible ImmortalWRT build and community procedure were available for that unit. ImmortalWRT is an OpenWrt-derived distribution with its own packages, defaults, localization, and hardware support. Use another distribution if it has better official support for the exact device.

## Preparation

The original installation took about 30 minutes in a successful run. Recovery can take much longer.

Prepare:

* a router whose exact model and hardware revision have a documented installation and recovery path;
* an Ethernet cable—do not flash firmware over an unreliable Wi-Fi link;
* a terminal with `ssh` and `scp`;
* the subscription or configuration that will be imported after the router works;
* independent storage for backups;
* stable power, ideally with protection against interruption.

If you still need to evaluate a provider, begin with the [proxy-service review list](/en/posts/vpn/).

### 1. Obtain the U-Boot image

U-Boot is the bootloader used to initialize the device and load firmware. Writing the wrong bootloader can prevent normal recovery.

The Chinese source used this community thread:
[right.com.cn forum thread 8328967](https://www.right.com.cn/forum/thread-8328967-1-1.html)

For its Netcore N60 Pro, the downloaded filename was:

```text
mt7986-netcore_n60-pro-fip.bin
```

That filename is not sufficient proof that the image matches a particular unit. Check the thread's current instructions, hardware revision, file hash, trusted source, and recovery reports.

![U-Boot download example =678x137](https://image.ermao.net/images/blog/router-setup-guide/20260524_150832-fb8fdc.png)

### 2. Obtain the ImmortalWRT firmware

The source used the [ImmortalWRT Firmware Selector](https://firmware-selector.immortalwrt.org/). Search for the exact router model and select the image type required by the model-specific installation procedure.

![ImmortalWRT firmware selection =680x345](https://image.ermao.net/images/blog/router-setup-guide/20260524_150844-f81af9.png)

Before continuing, record a cryptographic checksum for every downloaded file and compare it with a trusted published value where one exists.

## Step 1: connect by Ethernet and enable SSH

1. Connect the computer directly to the router by Ethernet and power on the router.
2. For the source's stock Netcore firmware, open `192.168.0.1`.
3. Skip the Internet-setup wizard if that is appropriate for the isolated flashing network.
4. Set a strong, unique administrator password.
5. In the stock interface, open `Applications → Remote Access` and enable SSH.

![Open the stock administration interface =680x604](https://image.ermao.net/images/blog/router-setup-guide/20260524_150932-98cf90.png)

![Skip the stock Internet setup =680x433](https://image.ermao.net/images/blog/router-setup-guide/20260524_150945-af7962.png)

![Set the administrator password =680x410](https://image.ermao.net/images/blog/router-setup-guide/20260524_150955-7ff524.png)

![Enable SSH =679x492](https://image.ermao.net/images/blog/router-setup-guide/20260524_151033-aefa3c.png)

Keep this isolated from an untrusted network while SSH is enabled.

## Step 2: inspect and back up the stock flash

The source logs in with:

```bash
ssh useradmin@192.168.0.1
```

On first connection, verify the displayed host-key fingerprint through a trusted local channel before accepting it. Enter the administrator password when prompted; terminals normally do not display password characters.

![SSH login =680x452](https://image.ermao.net/images/blog/router-setup-guide/20260524_151050-b91856.png)

Inspect the actual flash layout:

```bash
cat /proc/mtd
```

![Inspect MTD partitions =680x434](https://image.ermao.net/images/blog/router-setup-guide/20260524_151118-3a27df.png)

The original unit mapped BL2, U-Boot environment, Factory calibration, and UBI to `mtd1`, `mtd2`, `mtd3`, and `mtd5`. **Your output must be checked independently.** Do not assume the same numbers on another revision.

Only when the mapping exactly matches the model-specific procedure, the source creates:

```bash
# BL2 boot partition on the source unit
dd if=/dev/mtd1 of=/tmp/mtd1_BL2.bin

# U-Boot environment on the source unit
dd if=/dev/mtd2 of=/tmp/mtd2_ubootenv.bin

# Factory calibration data on the source unit
dd if=/dev/mtd3 of=/tmp/mtd3_Factory.bin

# Stock UBI firmware on the source unit
dd if=/dev/mtd5 of=/tmp/mtd5_ubi.bin
```

The Factory partition can contain device-specific radio calibration data and may not be reconstructible. Back it up. Let large reads finish; do not interrupt power.

![Check backup files =680x191](https://image.ermao.net/images/blog/router-setup-guide/20260524_151137-ec99fb.png)

Open a **new terminal on the computer**, not the interactive router shell, and copy the backups off the router:

```bash
scp -O useradmin@192.168.0.1:'/tmp/mtd*' ~/Downloads/
```

![Export the backups =679x166](https://image.ermao.net/images/blog/router-setup-guide/20260524_151148-007f97.png)

Then:

1. list the copied file sizes;
2. calculate hashes locally;
3. compare sizes with the MTD table;
4. open or inspect the files with an appropriate flash-analysis tool;
5. store at least two copies outside the router;
6. document which physical unit and hardware revision produced them.

A file merely existing is not proof of a usable backup.

## Step 3: write the model-specific U-Boot image

This is the highest-risk step. Confirm the exact filename and checksum again.

From the computer terminal, the source uploads its image:

```bash
scp -O ~/Downloads/mt7986-netcore_n60-pro-fip.bin useradmin@192.168.0.1:/tmp/
```

From the router's SSH shell, the original procedure writes the `FIP` partition:

```bash
mtd write /tmp/mt7986-netcore_n60-pro-fip.bin FIP
```

![Write U-Boot =679x168](https://image.ermao.net/images/blog/router-setup-guide/20260524_151200-c0c503.png)

Do not proceed merely because no error is printed. Check the command exit status and the model-specific verification method. Do not write `FIP` unless `/proc/mtd` and trusted documentation confirm that target on this exact unit.

## Step 4: install ImmortalWRT from U-Boot recovery

For the source's N60 Pro procedure:

1. Disconnect router power.
2. Press and hold the recessed Reset button.
3. Reconnect power while continuing to hold Reset.
4. After about 10 seconds, release Reset.
5. Connect to the isolated router network and open `192.168.1.1`.
6. In the U-Boot recovery page, select the exact matching ImmortalWRT image.
7. Start the update and do not interrupt power or network access.

Recovery-button timing and address are bootloader-specific. Use the instructions for the installed bootloader if they differ.

![U-Boot firmware page =680x453](https://image.ermao.net/images/blog/router-setup-guide/20260524_151235-6d1e20.png)

![Firmware update success page =679x313](https://image.ermao.net/images/blog/router-setup-guide/20260524_151243-bcbaa3.png)

Wait for a complete reboot before reconnecting. A browser success message alone is not permission to remove power immediately.

## Step 5: secure networking and install OpenClash

### 1. Sign in to the new interface

After reboot, the source opens `192.168.1.1`, the common default for this ImmortalWRT build. The first login had no password.

Immediately set a strong administrator password. Disable or restrict remote administration and SSH when they are no longer needed.

![First ImmortalWRT login =680x294](https://image.ermao.net/images/blog/router-setup-guide/20260524_151255-81a4a9.png)

![Set the ImmortalWRT administrator password =679x445](https://image.ermao.net/images/blog/router-setup-guide/20260524_151309-200d38.png)

### 2. Configure upstream network access

Two common layouts are:

* **Primary router:** connect the modem or optical network terminal to the WAN port and configure the required DHCP, PPPoE, or provider settings.
* **Secondary router or wireless repeater:** connect behind an existing router and preserve more of the current topology.

The source uses wireless relay: open `Network → Wireless`, enable the radio, select the 5 GHz band, scan for the existing Wi-Fi network, and enter its password. Set secure 2.4 GHz and 5 GHz SSIDs and passwords if the device will also provide Wi-Fi.

![Scan for the upstream Wi-Fi =680x413](https://image.ermao.net/images/blog/router-setup-guide/20260524_151341-49b103.png)

![Set wireless password 1 =679x232](https://image.ermao.net/images/blog/router-setup-guide/20260524_151350-e02322.png)

![Set wireless password 2 =680x480](https://image.ermao.net/images/blog/router-setup-guide/20260524_151358-e50b81.png)

A repeater or secondary-router layout can introduce double NAT, competing DHCP, DNS leaks, MTU problems, or reduced wireless throughput. Confirm which device supplies DHCP and DNS, and test both local and Internet routing.

### 3. Install OpenClash

After basic Internet access works:

1. Open `System → Software`.
2. Refresh package lists.
3. Search for `OpenClash`.
4. Review the repository, package signature, version, dependencies, and free flash space.
5. Install the package.

![Refresh the package list =680x401](https://image.ermao.net/images/blog/router-setup-guide/20260524_151456-51d3a4.png)

![Install OpenClash =679x358](https://image.ermao.net/images/blog/router-setup-guide/20260524_151505-8215ae.png)

If the page times out, do not assume installation succeeded. Check the package manager output and logs. Signing out and in again can refresh the LuCI menu when the package is installed correctly.

### 4. Install a compatible core and import a subscription

Open `Services → OpenClash`. The source follows the first-run prompt and selects a Meta-family core. Choose a core supported by the installed OpenClash release and the router's CPU architecture; “second option” is not a universal rule.

![Download a compatible core =679x295](https://image.ermao.net/images/blog/router-setup-guide/20260524_151517-dc0a3c.png)

![Review installation logs =680x517](https://image.ermao.net/images/blog/router-setup-guide/20260524_151526-d4bc39.png)

In the profile subscription section, add the provider subscription URL and update the profile list.

![Import an OpenClash profile =679x531](https://image.ermao.net/images/blog/router-setup-guide/20260524_151533-3286d1.png)

A subscription URL is a credential. Keep it out of screenshots, logs, public configuration repositories, DNS query strings, and untrusted conversion services.

### 5. Start and verify

Enable OpenClash and allow the core to restart.

![Start OpenClash =680x281](https://image.ermao.net/images/blog/router-setup-guide/20260524_151544-5d907e.png)

Review the logs for errors:

![OpenClash startup log =679x374](https://image.ermao.net/images/blog/router-setup-guide/20260524_151554-89f78d.png)

Then verify more than whether one page opens:

* domestic and international routing follows the intended policy;
* DNS uses the intended resolvers without loops or leaks;
* IPv4 and IPv6 behave as expected;
* devices without client software use the router path;
* local printers, casting, and private services remain reachable;
* failover and reboot recovery work;
* CPU, memory, temperature, and throughput remain acceptable.

## Troubleshooting checklist

The author bricked an older router during the work and ultimately replaced it. The practical lessons were:

1. **Exact U-Boot match:** confirm model, hardware revision, image source, checksum, and partition target.
2. **Reset timing:** on the source bootloader, hold Reset before applying power and continue until recovery starts.
3. **Addresses:** the stock source interface used `192.168.0.1`; the installed build used `192.168.1.1`.
4. **Missing OpenClash menu:** refresh the login, but also verify package and dependency status.
5. **Core download failure:** confirm basic routing, DNS, date and time, repository access, architecture, and storage.
6. **No Internet after relay setup:** check DHCP ownership, gateway, DNS, subnet conflicts, and double NAT.

## Frequently asked questions

### How is this different from a typical consumer router?

A supported OpenWrt-family device can install packages such as OpenClash and apply network policy for downstream devices. A closed stock router may not expose that capability.

### Is ImmortalWRT always better for a user in China?

No distribution is universally best. ImmortalWRT may offer useful localization, mirrors, packages, or device support, while upstream OpenWrt may have different release and support properties. Use the build with trusted support for the exact hardware and required functions.

### Can the device be bricked?

Yes. Preventive steps include:

1. use an image for the exact model and revision;
2. verify hashes and trusted instructions;
3. inspect the actual MTD layout;
4. make and validate complete off-device backups, especially Factory calibration data;
5. know the serial or external-programmer recovery process;
6. maintain stable power.

Even a good backup may require specialized hardware and skill to restore.

### What if OpenClash is not visible?

Sign out and back in or clear the LuCI cache, then confirm the package and dependencies are actually installed. Inspect logs for a failed installation.

### Primary or secondary router?

A primary router provides the clearest policy control but requires migrating the home topology. A secondary router or repeater changes less but can add double NAT, DNS, DHCP, roaming, and performance tradeoffs. The source demonstrates the latter.

## Related guides

* [Proxy-service reviews](/en/posts/vpn/)
* [Advanced Clash rule configuration](/en/blog/clash-rules-config/)
* [Mobile setup for Android and iOS](/en/blog/how-to-vpn-on-mobile/)
* [Desktop setup for Windows and macOS](/en/blog/how-to-vpn-on-computer/)
* [Clash Meta setup on Android](/en/article/eh8f4n86/)
* [Shadowrocket setup on iOS](/en/article/z747kgjd/)

::: warning Scope
This is a translation of a dated, model-specific installation record. Firmware, bootloaders, packages, and links can change. Verify current authoritative instructions for the exact device before modifying flash.
:::
