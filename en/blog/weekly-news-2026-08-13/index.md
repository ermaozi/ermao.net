---
url: /en/blog/weekly-news-2026-08-13/index.md
description: >-
  A sourced weekly digest on DeepSeek Harness, impersonating VPN extensions,
  exposed AI reasoning logs, SharePoint exploitation, license-plate
  surveillance, and Claude's math result.
---
From August 7 through August 13, 2026, the most consequential stories were not simply about another set of AI features. They were about what people hand to their tools: a browser extension can take control of an entire browsing session, a public agent trace can retain secrets inside an opaque reasoning object, and a delayed enterprise patch can become a practical attack surface as soon as proof-of-concept code appears. DeepSeek also shipped a runnable—but explicitly unstable—agent harness, while surveillance reform and an AI-assisted mathematics result offered two different models of checkable progress.

![Weekly cover for AI tools, VPN extension risks, platform accountability, and science, August 7–13, 2026 =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-13/20260814_091119-70caf1.svg)

> **Draft disclosure:** Ermao.net prepared this draft with public-source research and automated assistance. It is awaiting human review. “Confirmed” means only that the listed evidence directly supports the claim. Vendor statements, research findings, reporting, and our analysis remain separate; none is presented as Ermao.net testing.

## What matters this week

| Lane | Event | Verified fact | Why it matters | Evidence status |
| --- | --- | --- | --- | --- |
| AI tools | DeepSeek Harness developer preview | The official repository provides an `npx @deepseek-ai/dsh web` launch path, plugin architecture, and MIT license | Runnable software is not a stable interface; production users need a boundary for breaking changes | Official repository, verified |
| Cross-border access and security | 737 impersonating VPN extensions | Of 522 retrieved packages, 520 used one SOCKS5 system; 516 were still listed when the corpus was collected | Finding a free extension that connects can mean entrusting every browser request to an unknown operator | First-party code research plus independent report, verified |
| AI security | Encrypted reasoning blocks could be replayed and decoded | Researchers decoded 315,320 blocks from public traces and say the main demonstrated attack stopped after mitigations | Removing visible text alone may not remove credentials or private information from agent logs | Paper plus independent report, verified |
| Enterprise security | SharePoint exploitation followed a public PoC | CVE-2026-55040 lets a remote unauthenticated attacker impersonate a site user or administrator; a July patch exists | “A patch is available” is not the same as “every exposed asset is fixed” | Rapid7 analysis plus exploitation telemetry, verified |
| Platform accountability | Flock changes its license-plate database | The company promises mandatory case identifiers, anomaly audits, and shorter default retention, but the changes are not fully in force | Privacy depends on default permissions, retention, review, and outside constraints—not a general promise | Associated Press reporting, verified |
| Science and AI | Claude raises a bound related to Riemann zeros | Published materials put the lower bound at 67.2%, up from 41.6%, and include a paper, process records, and Lean work | Claude did not prove the Riemann hypothesis, but the project shows how failures, experts, and formal checks can interact | Paper and expert materials, verified; peer review pending |

The first four stories cover Ermao.net's core AI, security, digital-tool, and cross-border interests. The last two broaden the edition with platform accountability and a scientific result. The lighter solar item is separate and does not pad the six-event main count. All seven daily records are now `complete`: August 12 had been missing, so this run backfilled only that date and did not rediscover the other six days.

## DeepSeek Harness is runnable, but “developer preview” is the most important feature label

DeepSeek published the [DeepSeek Harness repository](https://github.com/deepseek-ai/deepseek-harness) on August 13. This was more than a teaser or a signup page. Its README gives a direct command—`npx @deepseek-ai/dsh web`—that starts a local web interface on `127.0.0.1:3080` by default. It also documents the source-build path, points to architecture and development material, opens community discussions, and uses the MIT license.

The term *harness* matters. The project is not merely another chat interface. A harness connects models, tools, context, task loops, user interaction, and extension points. DeepSeek describes an “everything is a plugin” architecture powered by Cordis. For a developer, that promises a way to add or replace capabilities without continually expanding one monolithic core. For an ordinary tester, however, the immediate fact is narrower: there is a low-friction local interface that can be launched and explored. Those two forms of value should not be compressed into a claim that a new generation of agents is already production-ready.

The repository gives the strongest caution in unusually plain language: this is a **developer preview**, and compatibility-breaking changes will occur. That sentence matters more than launch-day stars. The daily record captured roughly 26,000 stars and more than 1,900 forks a few hours after creation; the totals continued moving by the time of this recheck. Those numbers establish intense attention. They do not establish a stable plugin API, a mature upgrade path, reviewed third-party plugins, or reliable behavior under real long-running workloads.

Testing and production adoption therefore need different tracks. An individual can explore the UI, tools, and plugin model using an isolated directory, a low-privilege account, and disposable tasks. A team connecting the harness to source code, cloud accounts, browsers, or internal documents needs pinned revisions, dependency and plugin review, a record of granted permissions, and a rollback path for interface changes. A developer preview is excellent for answering, “Does this composition model improve our workflow?” It is poor evidence for promising that next month's build will run unchanged.

The one-command experience also does not remove supply-chain concerns. `npx` downloads and executes a package, while plugins may gain filesystem, network, command, or credential access. A minimal security evaluation records the package source, exact revision, runtime account, mounted directories, outbound network access, and callable tools. A trial agent should not inherit production `.env` files, SSH keys, logged-in browser state, or an entire home directory merely because setup is convenient. This week's reasoning-log story adds a second concern: even when a tool does not deliberately upload secrets, its debug trace can become another disclosure channel.

Ermao.net did not run Harness or test its reliability, performance, or plugin isolation. The verified facts are its repository, documented launch path, license, and preview warning. Our [local DeepSeek deployment guide](/en/article/c3gj5lqy/) covers a different data boundary. Running a model locally is not the same as starting a harness locally; the harness may still call hosted models and external tools.

## The critical question about a free VPN extension is who gets the traffic

Socket published its [research into 737 Chrome VPN and proxy extensions](https://socket.dev/blog/chrome-vpn-extension-impersonation) on August 11, with independent coverage circulating on August 12. The extensions appeared under at least 40 developer accounts and had a combined 75,486 installs according to the store's displayed buckets. Socket says 274 impersonated 66 established VPN or privacy brands. Researchers obtained 522 packages; 520 routed browser traffic through one SOCKS5 system. When the corpus was collected, 516 extensions were still listed.

Each number has a boundary. The 737 extensions do not imply 737 independent threat groups. The install total is a sum of Chrome Web Store display buckets, not an exact deduplicated user count. The 516 figure describes a collection-time snapshot, not a guarantee about the store today. The strongest evidence comes from code and public infrastructure: many packages used `chrome.proxy.settings`, routed nearly all non-loopback browser requests through fixed proxies, impersonated brands, advertised nonexistent paid locations, added remote configuration, and showed signs of trying to evade store review.

![Verified facts and limits for the impersonating VPN-extension campaign =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-13/20260814_091119-179991.svg)

What can a proxy operator see? It can observe source IP addresses, destinations, connection patterns, TLS metadata such as server-name indications, and any content sent over plain HTTP. Correct HTTPS usually prevents a simple proxy from reading encrypted page bodies and passwords. That does not remove the privacy problem: metadata, browsing patterns, DNS behavior, and opportunities for downgrade or redirection remain sensitive. If an extension also has permission to read or modify site data and tabs, the risk extends beyond the network proxy and has to be evaluated permission by permission.

One caveat is just as important as the warning. The research demonstrates that the operator was placed in a position to observe traffic. It does not prove that every user's content was stored, sold, or maliciously used. Writing “all passwords were stolen” would exceed the evidence. Treating the service as harmless because no complete theft list exists would make the opposite error: a proxy is inherently a trust decision, and undisclosed centralized control is material.

The practical response begins in the extension manager. Verify names, developers, installation sources, proxy privileges, and site permissions. Disable and remove an unknown or impersonating extension, then confirm that browser and operating-system proxy settings returned to normal. If the extension handled plain-HTTP activity, saw sensitive forms, or had page-reading permissions, rotate high-value passwords and tokens from a trusted network and clean device, revoke sessions, and review multifactor settings. Changing every secret inside a browser that may still be controlled defeats the point.

For future installations, a store listing, five-star reviews, and a familiar icon are not proof of authenticity. Start from the vendor's official website or repository and follow its store link in reverse. Check developer identity, minimum permissions, privacy disclosures, update history, and source availability. Our [mobile access guide](/en/blog/how-to-vpn-on-mobile/) explains installation and access basics; it is not an endorsement of any free browser extension. This story also defines the edition's evergreen follow-up: a browser VPN/proxy permission and impersonation checklist.

## Encrypted reasoning is still confidential session material

The paper [Stealing Reasoning Traces from Proprietary LLM APIs](https://arxiv.org/abs/2608.09867) examines opaque objects used to carry reasoning state in OpenAI, Anthropic, and Google APIs. Providers do not necessarily return readable internal reasoning. Instead, a client may receive an encrypted or signed block and pass it back with a later request. Because the client cannot read the characters, developers can mistake the block for safe logging material. The research argues that unreadability did not prevent a provider's service from interpreting it later.

The authors report that reasoning objects were portable across sessions, users, and models within a provider's ecosystem. They gave a block produced by a stronger model to a weaker compatible model and prompted the latter to act as a fuzzy decoder. The paper describes four consequences: extracting proprietary reasoning, recovering private data from public traces, exposing hazardous material hidden behind a safe visible answer, and placing invisible instructions inside a block for later replay. Independent reporting says the team processed 315,320 blocks from 6,708 public agent trajectories.

![Why encrypted reasoning blocks in public agent logs still require secret handling =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-13/20260814_091119-410c70.svg)

The statistics require care. The abstract reports 367 personally identifiable information artifacts and 182 credentials. Reporting also presents a later categorization after excluding benchmark material. The sets should not be casually added together. More importantly, the attack did not allow someone to enter a username and retrieve arbitrary private chats. An attacker first needed an exposed reasoning object and access to a compatible API in the same provider family. The study does not document malicious exploitation in the wild, and the reconstructed text may not be a perfect word-for-word copy of the original hidden reasoning.

The authors say the main extraction attack stopped working after responsible disclosure and mitigations by August 2026. This run did not find public, itemized confirmations from all three providers that map directly to the paper. The accurate statement is therefore that the research team reports that its demonstrated path was mitigated—not that every historic log has become safe. Preventing fresh cross-user replay and dealing with objects already published in repositories are separate questions.

Development teams need more than a regular expression over visible messages. Before publishing issues, evaluation traces, CI artifacts, object-storage samples, demos, or chat exports, remove complete reasoning, thinking, signature, and opaque-item fields. Preserve only the minimum summary required for the task. When raw traces were public, search Git history, mirrors, caches, and artifacts rather than deleting only the latest file. Rotate API keys, access tokens, passwords, and other secrets based on what the logged process could read.

The event also exposes a design cost in stateless APIs. Letting the client carry reasoning state creates flexibility, but it shifts storage, isolation, compatibility, and sharing responsibilities to the application. A safer model treats opaque reasoning as confidential session material, binds it to the intended user, session, model, and purpose, and applies expiration and anti-replay controls. Strong encryption is essential, but an encrypted object is not ordinary noise if a service will accept it and perform semantic operations on it.

## SharePoint's public PoC turned patch delay into a much shorter clock

Rapid7 and Microsoft disclosed CVE-2026-55040 on July 14, and Microsoft shipped a fix in its July update. On August 11, Rapid7 published a [technical analysis and proof of concept](https://www.rapid7.com/blog/post/ra-microsoft-sharepoint-jwt-token-authentication-bypass-cve-2026-55040/). The vulnerability lies in SharePoint's JWT validation pipeline. Four weaknesses can be chained so that a remote unauthenticated attacker forges a token and impersonates a site user or administrator. This is an authentication bypass, not evidence that every SharePoint server can be disabled on demand, but the ability to read and alter data with another identity is already serious.

On August 13, [independent reporting](https://thehackernews.com/2026/08/attackers-exploit-sharepoint.html) said attackers had begun using the public PoC. The cited telemetry counted 12 attempts since July 19, eight of them on August 12 and 13. That is a small observation set, not a global victim count. The operators and goals remain unknown. It nevertheless illustrates a recurring timing change: once reliable reproduction code appears, scanning and opportunistic attempts can accelerate within days or hours.

Why is a month-old patch still news? Publication changes the availability of a remedy; it does not automatically change every server. An organization still has to find on-premises SharePoint farms, identify versions, map public entry points and reverse proxies, schedule maintenance, deploy to every node, and verify success. One forgotten lab instance or an incompletely updated farm keeps the exposure alive despite a closed patch ticket.

A fact-based response starts by distinguishing vulnerable on-premises SharePoint from Microsoft 365 cloud service. Administrators should verify the July update across all nodes, review public exposure and unusual authentication or data-change activity, preserve logs, and temporarily restrict access if patching cannot be confirmed. If there are signs of compromise, applying the update does not prove an intruder has left. Incident response still needs to examine tokens, credentials, persistence, and lateral movement.

The August release also addressed another component of a broader SharePoint chain, but the CVEs should not be collapsed. CVE-2026-55040 supplies the authentication bypass. A separate code-execution issue forms the other half. Rapid7 says the July authentication fix already breaks its unauthenticated chain; the August patch closes the code-execution component as well. Describing that as “July's patch did nothing” would mislead organizations that acted promptly.

The durable lesson is a loop: advisory, asset discovery, deployment, verification, and monitoring. Without inventory, the patch team cannot identify targets. Without installation verification, a completed work item does not prove risk closure. Without exploitation intelligence, teams sort only by severity scores. Without useful logs, they cannot answer whether an exposed server was probed after the PoC appeared.

## Flock's reforms show why defaults matter more than optional safeguards

Automated license-plate readers turn a plate, time, and location into a searchable database record. [Associated Press reporting on August 13](https://apnews.com/article/2a93bc075e2f7ffcca9e04a35d75a3fe) says Flock Safety announced changes after disputes over immigration enforcement, private searches, and cross-jurisdictional use. By January 1, 2027, the company says it will require more case identifiers and anomaly review, examine emergency overrides, and reduce default retention from 30 days to seven.

The privacy issue is not merely that a roadside camera saw a plate. When many places, dates, and agencies combine records, the resulting system can reconstruct movements. A single observation on a public road may look ordinary; a long-lived, cross-agency search can reveal visits to a hospital, religious site, political event, home, or workplace. Scale, retention, and linkage create sensitivity that no individual photograph carried by itself.

The proposed changes explain why “customers may enable safeguards” is often insufficient. Agencies operate under time and staffing pressure. Optional case fields are easy to skip, and optional audits may never be reviewed. Requiring a case identifier and anomaly detection raises the cost of a casual search. Reducing default retention shrinks the period in which unrelated historical records remain available. These are material changes and should not be dismissed as meaningless.

They are also not fully effective yet, and they do not add a warrant requirement. Can an officer type an arbitrary case number, or must it match a real case system? Who defines an anomalous search, how quickly is it reviewed, and does a review reach an external authority? Can data still be exported, copied, or queried through a partner system? What remedy exists when an override is abused? Until those questions are answered, “the platform announced changes” must not become “the abuse problem is solved.”

For readers outside the United States, the useful takeaway is not a transplanted legal conclusion but a reusable evaluation grid for any large location database: who can search, on what authority, for how long data persists, whether every query is logged, who reviews anomalies, whether cross-agency sharing is visible, how errors are corrected, and who is accountable for misuse. A long privacy policy cannot substitute for these defaults.

## Claude and the Riemann problem: the useful story is how failure became evidence

Anthropic released research materials on August 11 concerning zeros of the Riemann zeta function. The paper, expert notes, process records, and formalization repository support a precise but limited claim: the provable lower bound for the proportion of relevant zeros on the critical line increased from **41.6% to 67.2%**. This is not proof that every nontrivial zero lies on that line, so it is not a proof of the Riemann hypothesis and does not justify stories about an AI winning the Millennium Prize.

The hypothesis concerns where the zeta function's nontrivial zeros lie. A full proof would place every one at real part one-half. Mathematicians have instead established lower bounds on the proportion guaranteed to be there. Moving that guarantee from 41.6% to 67.2% is a substantial intermediate result. The remaining gap is still fundamental, and percentage progress cannot be extrapolated linearly to 100%.

The process is more informative than the phrase “AI discovered a theorem.” Reporting based on Anthropic's materials says two runs produced roughly 31 million output tokens, encountered 650 failed attempts, coordinated 60 subagents, executed 2,400 shell commands, and wrote hundreds of Python scripts. Those figures show the scale of search; they do not validate the theorem. Validation comes from a readable proof, accurate use of prior mathematical work, expert scrutiny, and Lean formalization.

External expert review is not automatically completed peer review. Anthropic organized the process, and the unreleased research model and multi-agent setup limit independent replication. Lean can check whether a formal statement follows from its encoded assumptions, but people must still verify that the formal statement faithfully represents the mathematical claim in the paper. Formal checking strengthens the evidence chain; it does not remove the research community from it.

The healthier AI narrative here is not a single-prompt oracle. It is a research collaborator operating through tools, parallel search, recorded failures, code, and human feedback. Most developers do not need to reproduce a 31-million-token run. They can adopt the more useful pattern: turn a complex claim into auditable intermediate artifacts—hypotheses, counterexamples, scripts, logs, proof drafts, tests, and human sign-off.

Human review should still ask whether the paper enters formal peer review, whether independent mathematicians reproduce the central steps, whether the Lean repository covers the principal theorem, and whether the method generalizes. This draft calls 67.2% a published lower bound in the released materials. It does not transform “progress on a Riemann-related bound” into “the Riemann hypothesis was solved.”

## A lighter moment

### The kind of curl seen on water also exists on the Sun—it was simply too small to resolve

An August 7 [Nature paper](https://www.nature.com/articles/s41586-026-10871-3) and [Ars Technica explanation](https://arstechnica.com/science/2026/08/the-worlds-biggest-solar-telescope-caught-vortexes-on-the-suns-surface/) describe small-scale Kelvin–Helmholtz instability on the solar surface. When two fluids move past one another at different speeds, their boundary can buckle and roll into vortices. Similar physics shapes ripples on water and curling cloud layers. Solar plasma was expected to show it too, but the structures were below earlier telescopes' resolving power.

Using the four-meter Daniel K. Inouye Solar Telescope, the team reached a spatial resolution of about 19 kilometers and reconstructed a sequence at two-second intervals. It identified 47 vortex-bearing interfaces, with individual structures roughly 25 to 170 kilometers wide; some doubled in size in under a minute. The dimensions are enormous on a human map and tiny as solar texture.

The playful part is the scale contrast. The evidence boundary remains serious: a short observation and simulations support the existence of the instability, but they do not make it the explanation for all solar heating or activity. The archived source image has unclear reuse rights and is not uploaded here. A striking picture is not a reason to relax either evidence or copyright checks.

## Practical actions

1. **Browser users:** Check developers, install sources, proxy privileges, and site permissions for VPN or proxy extensions. Remove suspicious items and verify proxy recovery before changing exposed passwords and tokens from a trusted device.
2. **Agent developers:** Treat reasoning, thinking, signature, and complete API traces as confidential by default. Remove full objects before publishing and inspect Git history, CI artifacts, mirrors, and caches after a leak.
3. **DeepSeek Harness testers:** Use an isolated directory and low-privilege account, pin a revision, inspect plugins and network egress, and keep production secrets and whole home directories outside the preview.
4. **SharePoint administrators:** Confirm inventory, versions, July patch status, and public exposure, then preserve and review logs. A patch applied after suspicious activity is not a completed incident response.
5. **Platform buyers and policymakers:** Ask for default retention, case binding, query audit, cross-agency sharing, anomaly review, and external remedy. A one-word claim of “compliance” is not an answer.
6. **Editors and readers:** Keep research demonstrations, vendor mitigations, in-the-wild exploitation, and confirmed victim scope separate. Stars, installs, telemetry attempts, and expert comments do not prove claims their sources never made.

## Next checks and evergreen opportunity

Next week should check whether the Chrome Web Store removes more impersonating VPN extensions, whether Socket publishes a stable list that users can verify, and whether the browser platform addresses review and remote-configuration failures. The reasoning-trace story needs itemized responses from OpenAI, Anthropic, and Google and a distinction between old public traces and mitigations for new API calls. DeepSeek Harness merits another update only when documentation, plugin interfaces, or release stability materially change—not because its star count grows.

SharePoint follow-up should look for broader exploitation confirmation, affected scope, and usable detection indicators. Flock should be judged again when mandatory controls actually launch, with comparison of default retention, audit results, and outside supervision rather than treating a 2027 roadmap as current reality. Claude's mathematical work should be revisited through independent review, formalization coverage, and replication discussion.

The named evergreen follow-up is a **browser VPN/proxy extension permission and impersonation checklist**. It should cover reverse-navigation from a brand website to the store, developer identity, proxy and site permissions, remote configuration, update history, source code, proxy recovery after uninstall, session revocation, and credential rotation. It should not rank extensions as “absolutely safe” or treat store review as a warranty. The steps and evidence are what can remain useful.

The mandatory second look rechecked the 9-point Manus data-migration event. It has an August 23 backup deadline and clear value for notified users. However, this run still had only secondary reporting: the Manus page failed TLS access, so the relevant jurisdictions and affected-user share could not be independently checked. It did not replace the equally scored, better-supported SharePoint, Flock, or mathematics stories, and it was not added merely to increase the count. The official migration page is a priority for the next run.

## Sources

1. [DeepSeek AI: DeepSeek Harness official repository](https://github.com/deepseek-ai/deepseek-harness), August 13, 2026.
2. [Socket: 737 Chrome VPN Extensions Linked to Brand Impersonation and Browser Traffic Redirection](https://socket.dev/blog/chrome-vpn-extension-impersonation), August 11, 2026.
3. [The Hacker News: 737 Chrome VPN Extensions Caught Routing Traffic Through Proxies](https://thehackernews.com/2026/08/737-chrome-vpn-extensions-caught.html), August 12, 2026.
4. [Panfilov et al.: Stealing Reasoning Traces from Proprietary LLM APIs](https://arxiv.org/abs/2608.09867), submitted August 10, 2026.
5. [The Hacker News: OpenAI, Anthropic, Google API Flaw Let Weaker Models Decode Reasoning](https://thehackernews.com/2026/08/openai-anthropic-google-api-flaw-let.html), August 12, 2026.
6. [Rapid7: Microsoft SharePoint JWT Token Authentication Bypass Technical Analysis](https://www.rapid7.com/blog/post/ra-microsoft-sharepoint-jwt-token-authentication-bypass-cve-2026-55040/), August 11, 2026.
7. [The Hacker News: Attackers Exploit SharePoint Authentication Bypass After Public PoC](https://thehackernews.com/2026/08/attackers-exploit-sharepoint.html), August 13, 2026.
8. [Associated Press: Surveillance tech company Flock announces platform changes](https://apnews.com/article/2a93bc075e2f7ffcca9e04a35d75a3fe), August 13, 2026.
9. [Anthropic: Claude's research paper on the Riemann zeta function](https://www-cdn.anthropic.com/564f962e60643842f5fcb4a17c9dbc8f608f1c37.pdf), released August 11, 2026.
10. [ITHome: Anthropic releases Claude's Riemann-related result](https://www.ithome.com/0/988/453.htm), August 11, 2026.
11. [Nature: Small-scale Kelvin–Helmholtz instability on the Sun](https://www.nature.com/articles/s41586-026-10871-3), August 7, 2026.
12. [Ars Technica: The world's biggest solar telescope caught vortexes](https://arstechnica.com/science/2026/08/the-worlds-biggest-solar-telescope-caught-vortexes-on-the-suns-surface/), August 7, 2026.
13. [ITHome: Manus returns to independent operation and requires some account migration](https://www.ithome.com/0/988/522.htm), August 11, 2026; used only for the second look.

## Related reading

* [Run DeepSeek locally: environment and model setup](/en/article/c3gj5lqy/)
* [Mobile access and application installation guide](/en/blog/how-to-vpn-on-mobile/)
* [OpenClaw beginner guide: build a private Telegram AI assistant](/en/blog/yecv6pn6/)
* [Previous weekly technology and digital-life digest](/en/blog/weekly-news-2026-08-06/)
* [Ermao.net editorial policy](/en/editorial-policy/)

> **Disclaimer:** This is a public-information digest, not legal advice, investment advice, a product endorsement, exploit guidance, or a guarantee of service availability. Software versions, store listings, attack activity, platform policies, and research conclusions may continue to change. Recheck the relevant official source before acting.
