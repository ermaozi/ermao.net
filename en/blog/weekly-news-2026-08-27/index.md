---
url: /en/blog/weekly-news-2026-08-27/index.md
description: >-
  Qwen's open weights, stronger WhatsApp account controls, a Kiro agent
  exfiltration path, ChatGPT ads in India, DeepSeek pricing, and two
  public-safety evidence chains.
---
From August 21 through August 27, 2026, the most useful technology question was not who posted the newest benchmark. It was what people can actually use now, and which layer of a digital chain deserves trust. Qwen3.8-Flash-Next released open weights while its hosted API remained forthcoming. WhatsApp replaced a six-digit account PIN with a stronger password option and added multiple passkeys. Research on Kiro showed how text inside a repository could be treated as an instruction by an agent with tools. Outside AI, the 4.7, 5.4, and 7.7 figures attached to one Sichuan earthquake demonstrated that numerical accuracy and source authorization are separate safety problems.

![Weekly digest cover for AI availability, account and agent security, and public alerts, August 21–27, 2026 =1600x900 =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-27/20260828_091506-296dd7.svg)

Ermao Blog generated the lead visual from this week's selected themes. It is editorial artwork, not event evidence. The approved original from Meta's WhatsApp announcement was not embedded because the uploader could not read its WebP dimensions; the draft does not replace it with a hotlink or an image with unclear reuse rights.

> **Draft disclosure:** Ermao Blog prepared this draft with public-source research and automated assistance. It is awaiting human review. Official announcements, reporting, security research, and this site's analysis are labeled separately. “Confirmed” means only that the cited evidence supports the statement; it does not imply testing by this site.

## What matters this week

| Lane | Event | Verified fact | Why it matters | Evidence status |
| --- | --- | --- | --- | --- |
| AI and open models | Qwen3.8-Flash-Next releases open weights | The package describes a 125B main model, a 51B N-gram embedding, and 6B active parameters per token; the hosted API was not yet live | Open weights and an immediately callable cloud API are two different kinds of availability | Official release plus independent reporting; vendor benchmarks are not independently reproduced |
| Account security | WhatsApp strengthens two-step verification | A full password can replace the six-digit PIN, and one account can hold multiple passkeys | The changes directly affect account recovery, weak-PIN risk, and cross-device sign-in | Meta announcement plus independent security reporting; rollout coverage remains unspecified |
| AI agent security | Kiro Powers creates a demonstrated exfiltration path | Researchers demonstrated repository content influencing Kiro IDE 0.7.45 and causing an external request carrying sensitive data | Opening an unfamiliar repository can expose tool and network permissions, not merely display code | Primary research plus reporting; no confirmed fixed version or widespread exploitation |
| AI business models | ChatGPT reportedly adds ads to Free and Go in India | TechCrunch reported an initial group of 50 brands and an ad manager planned for the following month | The deployment can show how answer independence, targeting data, and paid-tier expectations are separated | One credible report; no matching OpenAI announcement was found in this pass |
| AI API costs | DeepSeek makes weekends off-peak all day | The schedule took effect at 00:00 Beijing time on August 23, while two weekday windows remain peak | For delay-tolerant work, scheduling can matter as much as the nominal token price | Official pricing page plus independent reporting; pricing remains changeable |
| Public alerts | An unauthorized provider sends a 7.7 earthquake warning | The official final magnitude was 4.7 and the official warning estimate was 5.4; a provider whose authorization had ended sent 7.7 | Emergency information needs both an uncertainty model and a revocable source-authorization chain | Earthquake authority notice republished by CNR; vendor integration details remain unpublished |
| Food safety and accountability | Three authorities order tracing and tests after the “formaldehyde cabbage” video | A local preliminary inquiry confirmed the depicted conduct, police took measures involving people and vehicles, and authorities ordered tracing and targeted sampling | Readers need to distinguish a confirmed act and an active investigation from unpublished distribution and test results | CCTV reporting of the three-authority response; sampling and final penalties remain pending |

All seven daily records in the reporting window are marked `complete`, with nightly cutoffs between 23:04 and 23:06 Asia/Shanghai. No backfill was required. Five of the seven main stories are AI, security, or digital-service events; the earthquake alert and cabbage investigation are the two broader public-interest stories. The mandatory second look examined the omitted case involving indictments over alleged exports of AI servers from Taiwan to mainland China. The Reuters page could not be reopened and the archive did not contain a stronger primary court document, so that single-source item did not replace a better-supported selection.

## Open weights do not mean the cloud API is available

The Qwen team announced Qwen3.8-Flash-Next on August 26. The official release and [same-day reporting by ITHome](https://m.ithome.com/html/994735.htm) describe a 125-billion-parameter main model with a separate 51-billion-parameter N-gram embedding. The mixture-of-experts system activates 6 billion parameters per token. Native context is 262,144 tokens, and the team says YaRN can extend it to one million tokens.

Those figures describe different layers. Total parameters represent the model's overall capacity. Active parameters are closer to the main model computation selected for one token. The N-gram embedding is another large component that the design can offload to host memory and prefetch. Adding the figures and claiming that every token performs 176 billion parameters of computation would be misleading. Treating “6B active” as proof that the model deploys like an ordinary dense 6B model would be equally misleading. Weight storage, memory bandwidth, expert routing, and long-context prefill still shape real hardware requirements.

![Qwen3.8-Flash-Next open-weights and API availability comparison card =1600x900 =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-27/20260828_090255-61f5c5.svg)

The practical dividing line is between weights that are available and an API described as coming soon. A team that can operate GPUs, inference frameworks, quantization, and memory management can download the weights, review the license, and run its own evaluation. An application that depends on a hosted compatible endpoint still has to wait for the endpoint, quotas, billing, regional availability, data rules, and reliability terms. Reporting gave an intended price of RMB 1 per million input tokens and RMB 3 per million output tokens, but an announced price for a forthcoming API is not an available service-level commitment.

The team also reports training cost at about one-ninth of Qwen3.7-Plus and lists wins on several benchmarks. These are useful statements about the project's design goal, not independent reproductions. A deployment decision still needs tests on the buyer's Chinese long documents, codebase, images, tool calls, and failure recovery. It should measure task accuracy, time to first token, total latency, memory use, and total cost. A million-token context window matters only if the model can retrieve and use information located throughout the window, not merely accept the bytes.

The durable follow-up is therefore an availability tracker, not another parameter summary: when the API becomes callable, record its endpoint, context limit, price, data policy, rate limits, and observed behavior on a small fixed test set. For this week, the supported conclusion is that the weights are open. Real deployment cost, vendor benchmark advantages, and practical one-million-token performance remain outside evidence that Ermao Blog independently verified.

## WhatsApp account recovery moves beyond one PIN

Meta announced three WhatsApp account-security changes on August 25. Two-step verification can move from a six-digit PIN to a longer password containing letters, numbers, and special characters. Android users can receive more context before answering an unknown caller, including whether the number is from another country and whether the two accounts share groups. One account can also hold multiple passkeys for people who use both Android and iOS devices.

A password and a passkey are not the same control. A password remains a secret that a person knows; it can be reused, guessed, or entered into a phishing page. A passkey is normally a device-held key pair unlocked with a fingerprint, face, or screen-lock code. Authentication proves possession without handing the service a reusable password. Keeping both layers can make recovery stronger even when a one-time code has been stolen, but it does not make every other account-recovery path safe by default.

Meta says more than one billion people have already set up a passkey. The number shows that this is no longer a tiny experiment, but it is a vendor figure and does not mean every account is configured. It also does not mean account takeover has disappeared. SIM swaps, compromised email, malware, a stolen unlocked device, disclosure of a screen-lock code, and social engineering can still attack another part of the recovery chain.

The practical action is to inspect Settings > Account rather than wait for a promotional prompt. Where the stronger password option is present, users can replace a weak or reused PIN with a unique password, check recovery information, review linked devices, and remove obsolete passkeys. Where the entry is absent, Meta has not published a complete regional and version-by-version rollout table. Missing controls may indicate a staged rollout, not an account fault, and they are not a reason to install an unofficial “early” build from a message link.

Unknown-caller context is also a signal, not a verdict. Sharing a group does not make a caller trustworthy. A different country code does not make a caller fraudulent. The feature is useful because it creates a pause before a user obeys an urgent demand to transfer money, disclose a code, scan a recovery QR code, or move to another channel. Identity should still be confirmed through a separate known contact route.

## Repository text can become an instruction when an AI agent has tools

Mindgard's substantive August 27 update described a Kiro Powers path. The researchers say they demonstrated on Kiro IDE 0.7.45 that attacker-controlled repository content could influence the agent, cause it to read sensitive data, modify a workspace URL, and make an external request carrying a secret. The [Mindgard research page](https://mindgard.ai/blog/amazon-kiro-data-exfiltration) and [The Hacker News report](https://thehackernews.com/2026/08/amazon-kiro-prompt-injection-can.html) support the demonstrated chain. Neither source establishes widespread exploitation.

The central risk is not simply that an AI writes defective code. An agent interprets text and can invoke tools. A conventional IDE displays a README as documentation for a human to judge. An agent that does not strictly separate the user's goal, repository content, tool output, and system policy may treat malicious prose as another instruction in the task. Once the agent can read files, execute commands, call services, or browse, a prompt-injection problem becomes a permissions problem.

Exfiltration need not look like an obvious file upload. A token can be inserted into a URL path, query string, header, or tool argument. If an agent can read a home directory, environment variables, cloud credentials, or neighboring projects while making requests to arbitrary domains, the exposure expands from one untrusted repository to the development environment around it.

This new path must remain separate from CVE-2026-10591, an older file-write issue discussed by AWS in June. A fix or advisory for that older problem is not evidence that the Powers route disclosed on August 27 has been fixed. The material currently archived does not identify a fixed version for the new route, an official vendor response specific to it, or an incident count. It would therefore be wrong to say Kiro has suffered mass secret theft, and also wrong to declare the new path resolved because an older CVE had a patch.

Until the boundary is clearer, least privilege is more useful than an all-or-nothing ban on AI IDEs. Open unfamiliar repositories first in a container or isolated account without production cloud keys. Prevent automatic project-script execution. Restrict file access to the current workspace. Apply an outbound allowlist. Show complete tool arguments before execution and require approval for sensitive calls. In a team, retain logs showing which files the agent read and which network requests it made, not just the code it eventually generated.

These controls address the shared root cause: untrusted input reaching powerful tools without a narrow boundary. The evergreen follow-up selected for this issue is an “AI coding agent checklist before opening an unfamiliar repository,” organized around isolation, file scope, command execution, tool permissions, egress, secrets, and audit logs. It should wait until fixed-version information or reproducible boundaries are clearer.

## ChatGPT ads in India raise questions about answers, targeting, and paid tiers

[TechCrunch reported on August 27](https://techcrunch.com/2026/08/27/openai-to-start-showing-ads-on-chatgpts-free-and-go-tiers-in-india/) that OpenAI would show ads in ChatGPT Free and Go in India, initially involving 50 brands, with an ad manager planned for the following month. This weekly pass did not find a corresponding OpenAI announcement. The rollout details therefore remain attributed to TechCrunch rather than presented as an independently confirmed OpenAI policy.

India matters for two reasons. The report cites OpenAI as saying the country has more than 100 million weekly active ChatGPT users, providing a large environment in which to test ad inventory, advertiser demand, and user response. Go is also a lower-priced paid tier. If it carries ads, “paid” does not necessarily mean “ad-free”; price, model quota, and advertising rights have to be compared separately.

For users, the most important issue is not the presence of one more card on a page. It is whether three boundaries remain visible. First, can a person clearly distinguish a model answer, sponsored material, and an ordinary recommendation? Second, what data chooses an ad: country and device context, broad conversation category, the actual conversation, historical interests, or data from other products? Third, can an advertiser influence answer ordering, wording, or outbound links?

An ad-supported free service does not automatically mean answers have lost editorial independence. A system can publish a clear label standard, exclude sensitive targeting categories, offer user controls, separate ad selection from answer ranking, provide an ad library, and give users a complaint path. Conversely, a statement that ads do not influence answers is a company policy claim until technical and governance evidence makes the separation auditable.

This week supports only the reported India plan. The exact delivery pace, the full list of initial brands, the ad manager's launch date, the relationship between conversations and targeting, and expansion to other regions remain unresolved. The next high-value evidence is an OpenAI product or policy page explaining labeling, data use, answer separation, opt-outs, sensitive topics, and regional scope.

## DeepSeek's weekend discount makes API cost a scheduling problem

The [official DeepSeek pricing page](https://api-docs.deepseek.com/quick_start/pricing/) was updated on August 22. Beginning at 00:00 Beijing time on August 23, Saturday and Sunday are off-peak all day. Weekdays retain two peak windows, 09:00–12:00 and 14:00–18:00, with the remaining periods off-peak. This is not merely a lower sticker price; it makes periodic workload scheduling part of the price model.

![DeepSeek API weekend off-peak pricing schedule explainer card =1600x900 =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-27/20260828_090255-6f9433.svg)

Real-time chat, live customer support, and interactive code completion should not wait several hours merely to obtain a lower token price. Document embeddings, offline classification, translation queues, synthetic-data work, overnight reports, and retryable batch jobs are different. Their deadlines are often measured in hours or days, so weekend execution can be a real cost control.

Off-peak unit price does not guarantee lower total cost. If every queue starts at the weekend boundary, rate limits, tail latency, and retries may grow. A retry without an idempotency key, a client that resends the full context after each timeout, or two overlapping workers that both finish the same task can consume enough additional tokens to erase the discount. Cost evaluation should include input, output, cache hits, retries, successful jobs, and the final bill rather than comparing only the published rate.

Schedulers also need to calculate the boundary in Beijing time explicitly. A server's local timezone may not match the billing timezone. The update does not explain in detail how a long request crossing a boundary is classified: by submission time, token-generation time, or settlement time. For material volume, a small test batch and bill reconciliation are safer than moving the entire queue at once.

Ermao Blog's [VS Code guide for DeepSeek V4](/en/blog/vscode-deepseek-v4/) can help with client configuration, but it is not a pricing guarantee and does not replace the current official pricing page. The confirmed change is the all-day weekend off-peak schedule. Prices, windows, and capacity may change again.

## Weekly interest radar: a bad alert chain and an unfinished food-safety investigation

### 4.7, 5.4, and 7.7 describe different layers

On August 24, some phones and watches displayed a 7.7-magnitude alert for an earthquake in Changning, Sichuan. A [Sichuan Earthquake Administration notice republished by CNR](https://news.cnr.cn/native/gd/20260824/t20260824_527789270.shtml) says the official final magnitude was 4.7 and the official early-warning estimate was 5.4. The Chengdu Hi-Tech Disaster Reduction Institute, which sent 7.7 through several kinds of terminals, had lost its third-party authorization on July 22 but continued to invoke the related network identity.

![Comparison of the official magnitude, warning estimate, and incorrect Sichuan earthquake alert =1600x900 =1600x900](https://image.ermao.net/images/en/blog/weekly-news-2026-08-27/20260828_090314-ff1de3.svg)

One issue is ordinary early-warning uncertainty. An early-warning system estimates an event while only the first stations have received initial waves. A final magnitude uses more data and more processing time. The difference between an early 5.4 estimate and a final 4.7 therefore needs analysis of station coverage, algorithms, and updates. The difference alone is not proof that all earthquake early warnings are fake.

The second issue is authorization. Why could an organization whose authorization had ended still reach users through system-level channels on phones, watches, or apps? Did device vendors approve a provider name once, or verify current authorization? How were keys, API access, and push privileges revoked after the July change? Did vendors cross-check magnitude or clearly expose the source? Public material does not yet provide a complete answer.

Unknown facts include the number of affected devices, each manufacturer's correction time, integration review, and later accountability. Confirmed facts are narrower: 4.7 was the final official magnitude, 5.4 was the official warning estimate, and 7.7 came through a provider whose authorization had been terminated. Collapsing the three figures into one “official error” would conceal the authorization failure.

### The cabbage conduct was preliminarily confirmed; distribution and tests were not

On August 23, [CCTV reporting of the three-authority response](https://finance.eastmoney.com/a/202608233850362523.html) said a Kangbao County preliminary inquiry confirmed that the conduct shown in a video—dipping cabbage in a formaldehyde solution during procurement—had occurred. Police had taken compulsory measures involving relevant people and vehicles. Authorities ordered tracing of distribution and targeted sampling of cabbage and other perishable vegetables.

The notice confirms two layers: the depicted procurement conduct was supported by the local preliminary inquiry, and an enforcement chain involving police action, tracing, and sampling had begun. It does not yet identify every market that received the cabbage, the results of the tests, the affected quantities and batches, the final responsible parties, or the penalties.

For consumers, the current evidence does not justify regional stigma, panic about all cabbage, or buying an unvalidated home test promoted through social media. More useful steps are to retain purchase records, follow official batch and distribution notices, avoid consuming food with unexplained odor or visible treatment concerns, and report specific evidence through market-regulation channels. Anyone with a specific exposure concern or symptoms should seek professional medical and regulatory advice rather than a social-media remedy.

The next evidence capable of changing the conclusion is an official sampling result, distribution list, case update, or final enforcement decision. Until then, “the conduct was preliminarily confirmed and targeted sampling began” is supported; “nationwide distribution has been proven” is not.

## A lighter moment: if leap seconds are awkward, save up for a leap hour

On August 24, [Solidot described](https://www.solidot.org/story?sid=85179) a timekeeping proposal that had not been adopted. An international metrology meeting in October was expected to discuss replacing frequent leap seconds with a “leap hour,” allowing the difference caused by Earth's rotation to accumulate for centuries before one large adjustment.

The counterintuitive part is that a one-second adjustment is barely noticeable to a person but must exist somewhere in a distributed system. One system inserts a second at a defined instant, another smears the adjustment across a longer period, and poorly prepared software may not correctly represent 23:59:60 at all. Financial records, transport, power systems, authentication logs, and database ordering can all care about whether two machines describe the same instant in the same way.

This is a lighter item, not an adopted standard. This pass did not obtain the complete agenda from the international metrology body, and the implementation year, trigger threshold, and final decision remain unknown. Rewriting software today for a leap hour centuries away would be premature. Assuming today that clocks never repeat, jump, or disagree remains a current engineering mistake.

## Practical actions

1. **For WhatsApp accounts:** Inspect two-step verification and passkeys under Settings > Account. Replace weak or reused secrets, review linked devices, and remove obsolete credentials. Treat a missing control as a possible staged rollout, not a reason to install an unofficial build.
2. **For model evaluation:** Record Qwen artifact availability, hardware needs, license terms, and results on your own data separately from a forthcoming hosted API and vendor benchmarks.
3. **For AI coding agents:** Read unfamiliar repositories in an environment without production secrets, restrict file and network scope, and inspect full tool arguments before execution.
4. **For DeepSeek cost control:** Move only delay-tolerant, retryable work to the weekend window. Reconcile a small batch against the bill and measure retries and successful tasks, not just token price.
5. **For emergency and food-safety reports:** Protect yourself first, then verify through the relevant authority. Keep preliminary findings, sampling, distribution tracing, and final penalties as separate stages.

## Next checks and evergreen opportunity

The most consequential next evidence is Qwen's live API and its real quotas; an OpenAI policy page describing India ad labels, data use, and answer separation; a Kiro fixed version and vendor response; and official sampling, distribution, and enforcement results in the cabbage investigation. These developments could change practical action. A second retelling of an undated preview would not.

This week's named evergreen opportunity is an **AI coding-agent safety checklist for opening an unfamiliar repository**. It should not merely repeat the Kiro disclosure. It should demonstrate an isolated workflow covering file scope, command execution, MCP or other tool permissions, outbound networking, secret injection, and audit logs. A standalone guide should wait until vendor remediation information or a reproducible boundary is available.

## Sources

1. [Qwen Team: Qwen3.8-Flash-Next](https://qwen.ai/blog?id=qwen3.8-flash-next), August 26, 2026, official release.
2. [ITHome: Alibaba Qwen3.8-Flash (Next) Releases Open Weights](https://m.ithome.com/html/994735.htm), August 26, 2026, independent reporting.
3. [Meta: New Account Security Features for WhatsApp](https://about.fb.com/news/2026/08/new-account-security-features-for-whatsapp/), August 25, 2026, official announcement and lead-image source.
4. [The Hacker News: WhatsApp Adds Multiple Passkeys](https://thehackernews.com/2026/08/whatsapp-adds-multiple-passkeys-for.html), August 25, 2026, independent security reporting.
5. [Mindgard: Power Leak — Amazon Kiro IDE Prompt Injection Enables Data Exfiltration](https://mindgard.ai/blog/amazon-kiro-data-exfiltration), substantive update on August 27, 2026, security research.
6. [The Hacker News: Amazon Kiro Prompt Injection Can Exfiltrate Sensitive Data Through Kiro Powers](https://thehackernews.com/2026/08/amazon-kiro-prompt-injection-can.html), August 27, 2026, independent reporting.
7. [TechCrunch: OpenAI to Start Showing Ads on ChatGPT's Free and Go Tiers in India](https://techcrunch.com/2026/08/27/openai-to-start-showing-ads-on-chatgpts-free-and-go-tiers-in-india/), August 27, 2026, reporting not cross-checked against an OpenAI announcement in this pass.
8. [DeepSeek: Models and Pricing](https://api-docs.deepseek.com/quick_start/pricing/), updated August 22, 2026, official pricing page.
9. [Sichuan Earthquake Administration Notice Republished by CNR](https://news.cnr.cn/native/gd/20260824/t20260824_527789270.shtml), August 24, 2026, primary notice source.
10. [CCTV: Three Authorities Direct Rapid Response to Cabbage Dipped in Formaldehyde Solution During Procurement](https://finance.eastmoney.com/a/202608233850362523.html), August 23, 2026, official-response reporting.
11. [Solidot: International Metrology Meeting to Discuss Replacing Leap Seconds With a Leap Hour](https://www.solidot.org/story?sid=85179), August 24, 2026, explanatory lead for the lighter item.

## Related reading

* [Using DeepSeek V4 in VS Code](/en/blog/vscode-deepseek-v4/)
* [The Previous Domestic News and Technology Weekly](/en/blog/weekly-news-2026-08-20/)
* [Ermao Blog Editorial Policy](/en/editorial-policy/)

> **Disclaimer:** This article is a public-information digest and editorial analysis. It is not legal advice, investment advice, a product endorsement, or a guarantee of service availability. Software versions, prices, attack paths, platform policies, sampling, and investigations can change. Human review is still required before publication.
