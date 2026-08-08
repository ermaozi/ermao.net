---
url: /en/blog/clash-rules-config/index.md
description: >-
  Configure Loyalsoldier rule providers in Clash Verge Rev through a Merge
  override, route local and external traffic, block listed domains, and verify
  the result.
---
A Clash profile without suitable routing rules may send local websites through a distant proxy, waste subscription data, or use an unexpected route for a particular service. This guide uses the open-source Loyalsoldier rules and Clash Verge Rev's Merge override to route local traffic directly, proxy selected external traffic, and reject listed advertising or tracking domains.

Routing rules can reduce unnecessary route changes and improve consistency. They **cannot guarantee that an account will never be restricted**, make a data-center IP look residential, or ensure that every streaming service accepts the selected exit IP.

Prerequisites:

* Windows, macOS, or Linux: [Install Clash Verge Rev](/en/article/0gematwc/)
* Android: [Install Clash for Android](/en/article/eh8f4n86/)
* Subscription: [2026 proxy-service guide](/en/posts/vpn/)

## What Clash rules do

Clash evaluates traffic against an ordered list of rules:

| Traffic | Action | Result |
|---|---|---|
| 🟢 Listed local domains and IP ranges | **DIRECT** | Uses the original network |
| 🔴 Listed external services | **PROXY** | Uses the selected proxy policy |
| 🛑 Listed advertising and tracking domains | **REJECT** | Refuses the matching request |

Without a profile appropriate to the user's network:

* shopping, messaging, or video traffic intended to stay local may take a distant proxy route;
* one service may see unexpected exit locations when nodes are switched frequently;
* a site not covered by the rules follows the final fallback policy.

Rules act like an ordered routing table. They determine where a request goes; they do not change the reputation of the chosen IP.

## How matching works

Clash checks rules from top to bottom:

1. `youtube.com` matches a proxy rule and uses `PROXY`.
2. `taobao.com` matches a direct rule and uses `DIRECT`.
3. An unmatched domain follows the final fallback policy supplied by the profile.

The order matters. A more specific rule must normally appear before a broad rule that would otherwise match the same traffic.

## Rule source: Loyalsoldier/clash-rules

![Loyalsoldier clash-rules repository =900x784](https://image.ermao.net/images/blog/clash-rules-config/20260228_141256-b26939.png)

The source article recommends [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules). At its February 2026 snapshot, the repository had nearly 30,000 GitHub stars.

The project:

1. combines community-maintained domain and IP datasets, including separate Apple, Google, Telegram, private-network, and mainland-China lists;
2. uses GitHub Actions to rebuild published data regularly—the source article reports a daily 6:30 a.m. schedule;
3. publishes formats usable by compatible Clash cores and clients.

Compatibility depends on the exact Clash core and Merge syntax. Test the generated configuration in the client version you actually use.

Repository: <https://github.com/Loyalsoldier/clash-rules>

## Configure the rules in three steps

The screenshots use Clash Verge Rev. Another client may place Merge overrides elsewhere or not support this syntax.

::: warning Preserve the provider profile
Do not edit the downloaded provider profile directly. A subscription refresh normally replaces that file. Put custom rules in the client's Merge or override feature.
:::

### Step 1: open the global Merge override

1. Open Clash Verge Rev and select **Profiles** or **Subscriptions**.
2. Locate **Global Extended Merge Configuration**.
3. Right-click it and select **Edit File**.

![Clash Verge Rev global Merge override =900x697](https://image.ermao.net/images/blog/clash-rules-config/20260228_141318-51a08a.png)

### Step 2: add the rule-provider configuration

Back up any existing override before replacing it. Paste the following configuration:

> `prepend` places these providers and rules before rules from the subscription, giving them higher priority.

```yaml
prepend-rule-providers:
  reject:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"
    path: ./ruleset/reject.yaml
    interval: 86400

  icloud:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt"
    path: ./ruleset/icloud.yaml
    interval: 86400

  apple:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt"
    path: ./ruleset/apple.yaml
    interval: 86400

  google:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt"
    path: ./ruleset/google.yaml
    interval: 86400

  proxy:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt"
    path: ./ruleset/proxy.yaml
    interval: 86400

  direct:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt"
    path: ./ruleset/direct.yaml
    interval: 86400

  private:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt"
    path: ./ruleset/private.yaml
    interval: 86400

  telegramcidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt"
    path: ./ruleset/telegramcidr.yaml
    interval: 86400

  cncidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt"
    path: ./ruleset/cncidr.yaml
    interval: 86400

  lancidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt"
    path: ./ruleset/lancidr.yaml
    interval: 86400

  applications:
    type: http
    behavior: classical
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt"
    path: ./ruleset/applications.yaml
    interval: 86400

prepend-rules:
  - RULE-SET,applications,DIRECT
  - RULE-SET,private,DIRECT
  - RULE-SET,reject,REJECT
  - RULE-SET,icloud,DIRECT
  - RULE-SET,apple,DIRECT
  - RULE-SET,google,PROXY
  - RULE-SET,proxy,PROXY
  - RULE-SET,direct,DIRECT
  - RULE-SET,lancidr,DIRECT
  - RULE-SET,cncidr,DIRECT
  - RULE-SET,telegramcidr,PROXY
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
```

Rule summary:

| Rule set | Match type | Action | Intended traffic |
|---|---|---|---|
| `applications` | Local applications | DIRECT | Listed P2P or local applications |
| `private` | Private domains | DIRECT | `localhost` and local-network names |
| `reject` | Advertising/tracking domains | REJECT | Requests matching the maintained block list |
| `icloud` / `apple` | Apple services | DIRECT | iCloud, App Store, and related domains listed by the source |
| `google` | Google services | PROXY | Google Search, YouTube, and related listed domains |
| `proxy` | Common external domains | PROXY | Listed services such as X, Telegram, or Netflix |
| `direct` | Local domains | DIRECT | Listed mainland-China domains |
| `cncidr` / `lancidr` | IP ranges | DIRECT | Listed mainland-China and LAN ranges |
| `telegramcidr` | Telegram IP ranges | PROXY | Telegram address ranges in the provider |

Review the lists before using them in a high-sensitivity environment. A third-party list can contain errors, change over time, or block a domain required by another app.

### Step 3: save and reload

Save with the interface button or `Ctrl + S`.

In the Clash Verge Rev version used by the source article, the global Merge override did not have a separate enable switch; saving caused it to be merged into subscription profiles. If your version differs, consult its current override controls.

Because the rules are in a separate override, refreshing the provider subscription should not erase them.

## Expected effects

When the rules match correctly:

* listed local sites use the direct route rather than a distant proxy;
* listed streaming and external services use the selected proxy policy;
* Telegram's listed IP ranges use the proxy;
* domains in the `reject` list are refused.

These effects depend on the accuracy of the lists and the quality of the selected node. They do not guarantee Netflix access, TikTok availability, instant messaging, or complete advertisement blocking.

## Verify the merged configuration

1. Open **Settings**.
2. Find **Verge Advanced Settings**, then open **Current Configuration**.
3. Inspect the final merged YAML.

Look for providers such as `reject`, `google`, `apple`, and `cncidr`, and confirm that their rule references appear in the intended order.

![Verifying the merged Clash configuration =900x721](https://image.ermao.net/images/blog/clash-rules-config/20260228_141336-94acd7.png)

::: danger Use Rule Mode
The routing engine applies these decisions only in **Rule** mode. Global and Direct modes bypass the intended split-routing behavior.
:::

## Frequently asked questions

### A website stops opening after the rules are added

It may have matched the wrong direct, proxy, or reject rule. Open Clash Verge Rev's Connections panel, inspect the rule shown for the domain, then add a more specific custom rule before the conflicting one.

### Can Clash on a phone use custom rules?

Compatible Android Clash clients can use custom rules, although the interface differs. See [Clash for Android](/en/article/eh8f4n86/).

On iOS, see [Shadowrocket](/en/article/z747kgjd/) and the [Shadowrocket rules guide](/en/blog/shadowrocket-rules-config/).

### Do these providers update automatically?

`interval: 86400` asks the client to refresh each provider every 24 hours. The upstream repository also rebuilds its release data on a regular schedule. Automatic refresh still depends on the client being able to reach the provider URL.

## Further reading

* [Computer Access Guide](/en/blog/how-to-vpn-on-computer/) · [Mobile Access Guide](/en/blog/how-to-vpn-on-mobile/)
* [Clash Verge Rev](/en/article/0gematwc/) · [Clash for Android](/en/article/eh8f4n86/) · [Clash Verge Rev for macOS](/en/article/6vxkmmuh/)
* [Shadowrocket](/en/article/z747kgjd/) · [Shadowrocket Rules](/en/blog/shadowrocket-rules-config/) · [Shared Apple IDs](/en/blog/freeappleid/)
* [2026 Proxy-Service Guide](/en/posts/vpn/)
