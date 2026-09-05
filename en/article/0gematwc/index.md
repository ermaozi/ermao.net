---
url: /en/article/0gematwc/index.md
description: >-
  Install Clash Verge on Windows, macOS, or Linux, import a subscription, enable
  service and TUN modes, set the system proxy, and test nodes.
---
This guide provides direct and GitHub downloads for Clash Verge, installation notes for Windows, macOS, and Linux, subscription import steps, TUN and system-proxy configuration, and basic troubleshooting.

## Download and install

::: tabs

@tab Windows

* Clash Verge for Windows x64, with system-proxy and TUN support:
  * [Windows x64 direct download](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Windows.x64.exe)
  * [Windows ARM64 direct download](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Windows.arm64.exe)

@tab macOS

* Clash Verge for Intel and Apple Silicon Macs:
  * [Intel x64 download](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.x64.dmg)
  * [Apple Silicon download](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.aarch64.dmg)

@tab Linux

* Debian packages for many distributions:
  * [Linux x64 `.deb`](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Linux.x64.deb)
  * [Linux ARM64 `.deb`](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Linux.arm64.deb)

@tab GitHub

* [Clash Verge Rev releases](https://github.com/clash-verge-rev/clash-verge-rev/releases)
* [Chinese-localized Clash for Windows releases](https://github.com/Z-Siqi/Clash-for-Windows_Chinese/releases/)

:::

Install the package appropriate for your platform. This guide recommends Clash Verge because it has a graphical interface and integrated TUN support.

## Platform notes

* **Windows:** Enable service mode and TUN mode after installation, then enable the system proxy.
* **macOS:** Move the app to Applications, grant network permissions on first launch, and enable either the required proxy or TUN settings.
* **Linux:** Use the appropriate `.deb` package where supported, then start the service and configure TUN according to the distribution's requirements.
* **Subscription:** Have a valid proxy-service subscription URL ready to import.

## Import and configure a subscription

![Clash Verge subscription-import screen =1377x1002](https://image.ermao.net/images/article/0gematwc/image.png)

Open **Profiles** or **Subscriptions**, paste the subscription URL into the input, and select **Import**.

If you do not have a subscription URL, consult the [proxy-service selection and review guide](/en/posts/vpn/).

![Imported subscription in the profile list =1374x485](https://image.ermao.net/images/article/0gematwc/image-1.png)

After a successful import, the subscription appears in the list.

The default update interval shown in the source guide is 1,440 minutes, or 24 hours. Adjust it if needed.

![Editing the subscription name, URL, and update interval =462x553](https://image.ermao.net/images/article/0gematwc/image-2.png)

Right-click and select **Edit Profile** to change the update interval, URL, or name.

![Enabling service mode and TUN mode =1377x978](https://image.ermao.net/images/article/0gematwc/image-3.png)

In **Settings**, install service mode, start it after installation, then enable **TUN Mode** and the **System Proxy** as required by your version and platform.

![Confirming Rule mode on the Proxies page =588x298](https://image.ermao.net/images/article/0gematwc/image-4.png)

Finally, open **Proxies** and confirm that the mode is set to **Rule**.

## Test the connection

![Clash Verge latency and connectivity test =1381x541](https://image.ermao.net/images/article/0gematwc/image-5.png)

Open the test section and select **Test All**. Confirm that at least one intended node responds and that the websites you need actually open.

## Frequently asked questions

* **Download fails or is slow:** Try the direct links above, use a different network, or use an existing working proxy to access GitHub.
* **Subscription will not import:** Confirm that the URL has not expired. Ask the provider for a current subscription URL if necessary.
* **TUN will not start:** Run with administrator or root privileges and close other VPN or proxy programs before retrying.
* **Rule mode does not work:** Confirm that **Rule** is selected on the Proxies page, then refresh the subscription.

## Questions and updates

You may leave a comment with questions. If a reply is delayed, email <admin@ermao.net>.

For the most recent version of this guide, visit <https://ermao.net/en/>.
