---
url: /blog/googleseo/index.md
description: Google官方教你如何做好SEO（搜索引擎优化），提升网站在搜索结果中的排名和流量。本文详细解读Google的SEO入门指南，帮助你优化网站内容和结构。
---
我有时候会非常嫉妒国外的互联环境，不论是公司文化还是技术氛围，都让人觉得很向往。

大多数人都在秉持着最初的互联网精神——“==开放==、==平等==、==协作==、==共享==”，而不是一味地追求商业利益最大化。

我曾读到过这样一段话：

> 过去25年，互联网的操作入口一直是搜索。你想要什么，就要去搜索。
>
> 谷歌主宰着搜索。
>
> 为了自己的利益，它有动机推动互联网发展。互联网越多样化，越混乱，对谷歌越有利，因为人们就会离不开搜索，来处理混乱的信息。
>
> 所以，谷歌一直激励人们为互联网创造内容。只有源源不断的内容，才能提升搜索的价值。

这段话让我深刻理解到，谷歌之所以能够成为互联网的巨头，正是因为它通过搜索引擎连接了全球的信息和用户。为了保持这种连接的有效性，谷歌不断推动内容的创造和分享，从而使互联网变得更加丰富和多样化。

所以 Google 对于教育用户如何做好 SEO（搜索引擎优化）是非常重视的。因为只有当网站内容质量高、结构合理，用户才能更容易地通过搜索引擎找到他们需要的信息。

***

而对于我们新手而言，能够通读 Google 官方的 SEO 指南，无疑是提升网站排名和流量的关键一步。

感兴趣的朋友，可以点击下面的链接，查看 Google 官方的 SEO 指南全文：[搜索引擎优化 (SEO) 入门指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-cn)

访问以上链接需要翻墙工具，如果你需要翻墙工具，可以参考我之前写的这篇文章：[便宜好用的翻墙机场推荐评测(长期更新 欢迎推荐)](https://www.ermao.net/posts/vpn/)

***

对于不方便翻墙的同学，可以直接看 Google 官方的 SEO 指南原文：

## 搜索引擎优化 (SEO) 入门指南

构建网站时，您很可能已经充分考虑了用户需求，尽量让用户能轻松找到和浏览您的内容。搜索引擎也是您的一个用户，它可以帮助其他用户发现您的内容。搜索引擎优化 (SEO) 旨在帮助搜索引擎了解您的内容，并通过搜索引擎帮助用户找到您的网站并决定是否应访问您的网站。

[搜索要素](https://developers.google.com/search/docs/essentials?hl=zh-cn)概述了您的网站需要满足哪些最重要的元素，才能显示在 Google 搜索中。虽然我们无法保证任何特定网站一定会添加到 Google 索引中，但遵**循搜索要素指南的网站更有可能出现在 Google 的搜索结果中**。SEO 围绕的是采取下一步行动，**努力改善您的网站在 Google 搜索中的显示情况**。本指南将向您介绍可在您的网站上采取的一些最常见且最有效的改进。

没有什么秘诀会自动让您的网站在 Google 中排名第一（抱歉！）。事实上，其中一些建议甚至可能不适用于您的业务，但遵循最佳做法有望让搜索引擎（不只是 Google）更容易理解、抓取您的内容并将其编入索引。

### Google 搜索的工作原理

Google 是一个全自动搜索引擎，会使用名为抓取工具的程序持续浏览网络，以寻找可添加到 Google 索引中的网页。通常，您只需将网站发布到网络上即可，无需执行其他操作。事实上，Google 搜索结果中列出的绝大多数网站都是 Google 在抓取网页的过程中自动找到并添加的。如果您想了解更多内容，可以参阅我们关于 [Google 如何发现、抓取和呈现网页](https://developers.google.com/search/docs/fundamentals/how-search-works?hl=zh-cn)的文档。

:::tip
**时间有限或不想探索新知识？** 您可以考虑聘请专业人士。 [请注意以下事项](https://developers.google.com/search/docs/fundamentals/do-i-need-seo?hl=zh-cn)。
:::

### 我多久才能在搜索结果中看到效果？

您的所有更改都需要一段时间才能反映在 Google 端。有些更改可能在几小时后生效，而其他更改可能需要几个月的时间才能生效。一般来说，您可能需要等待几周的时间来评估您的工作是否对 Google 搜索结果产生了有益影响。请注意，并非对网站所做的所有更改都会对搜索结果产生明显的影响；如果您对结果不满意且业务策略允许，请尝试以迭代更新的方式实施更改，看看是否产生了影响。

### 帮助 Google 找到您的内容

在实际执行本部分中提到的任何操作之前，请先检查 Google 是否已找到您的内容（或许您无需进行任何操作！）。请尝试使用 [`site: search operator`](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site?hl=zh-cn)在 Google 上搜索您的网站。 如果您看到指向您网站的结果，则表明您的网站已编入索引。例如，搜索 `site:wikipedia.org` 会返回[这些结果](https://www.google.com/search?q=site%3Awikipedia.org\&hl=zh-cn)。如果您没有看见自己的网站，请查看[技术要求](https://developers.google.com/search/docs/essentials/technical?hl=zh-cn)，确保没有任何技术方面的原因导致您的网站不会出现在 Google 搜索中，然后再返回此处。

Google 主要通过已抓取的其他网页中的链接来查找网页。在很多情况下，这些网站是链接到您的网页的其他网站。其他网站链接到您的网站是随着时间的推移自然发生的，您也可以通过[宣传您的网站](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-cn#promoting)来鼓励用户发现您的内容。

如果您愿意接受一些技术方面的挑战，您还可以[提交站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=zh-cn)，其中包含您网站上您所关注的所有网址。某些内容管理系统 (CMS) 甚至可能会自动为您执行此操作。不过，这并非强制要求，您应该首先确保[用户了解您的网站](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-cn#promoting)。

### 检查是否向 Google 和用户呈现了相同的网页

Google 抓取某个网页时，理想情况下应该和[普通用户看到的网页样貌一样](https://developers.google.com/search/blog/2014/05/understanding-web-pages-better?hl=zh-cn)。 为此，Google 需要能够访问与用户浏览器相同的资源。如果您的网站隐藏了构成网站的重要组件（例如 [CSS](https://en.wikipedia.org/wiki/CSS) 和 [JavaScript](https://en.wikipedia.org/wiki/JavaScript)），Google 可能无法理解您的网页，这意味着它们可能不会显示在搜索结果中，或者不会针对您关注的搜索字词获得较高的排名。

如果您的网页会根据用户的实际位置显示不同的信息，请确保您对 Google 根据抓取工具位置（通常是美国）显示的信息感到满意。

若要检查 Google 看到的您网页样貌，请使用 [Search Console 中的网址检查工具](https://support.google.com/webmasters/answer/9012289?hl=zh-cn)。

### 不希望某个网页出现在 Google 搜索结果中？

您可能需要选择让整个网站或网站的某些部分不显示在搜索结果中。例如，您可能不想让自己糟糕的新发型帖子显示在搜索结果中。Google 支持以多种方式让您选择不抓取您的网址和将其编入索引。如果您需要阻止某些文件、目录甚至整个网站显示在 Google 搜索结果中，请参阅我们有关[如何阻止内容显示在搜索结果中](https://developers.google.com/search/docs/crawling-indexing/control-what-you-share?hl=zh-cn#how-to-block-content)的指南。

### 整理网站

当您对网站进行设置或重新设计时，最好以符合逻辑的方式对其进行整理，因为这可以帮助搜索引擎和用户了解您的网页与网站其余部分之间的关系。不过，请不要放弃所有现有结构，并立即开始重新整理网站：虽然这些建议从长远来看可能很有用（尤其是在网站规模较大时），但搜索引擎很可能理解现有的网页，无论网站结构如何。

#### 使用描述性网址

网址的某些部分可在搜索结果中显示为面包屑导航，因此用户也可以根据网址判断某条结果对他们是否有用。

![google教你怎么做SEO 示例图片](https://image.ermao.net/images/blog/googleseo/image.png)

[网域](https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=zh-cn#domain) | [面包屑导航](https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=zh-cn#breadcrumb)

Google 会根据网址中的字词自动理解面包屑导航，但如果您喜欢技术性挑战，也可以使用结[构化数据](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=zh-cn)引导 Google 理解这些面包屑导航。尽量在网址中包含可能对用户有用的字词；例如：

`https://www.example.com/pets/cats.html`

仅包含随机标识符的网址对用户没有多大帮助；例如：

`https://www.example.com/2/6772756D707920636174`

#### 在目录中将主题相似的网页归为一组

![该图示展示了如何在目录中对网页进行分组](https://image.ermao.net/images/blog/googleseo/image-1.png)

如果您的网站上有数千个网址，那么整理内容的方式可能会影响 Google 抓取您的网站并将其编入索引的效果。具体而言，使用目录（或文件夹）将相似的主题归为一组有助于 Google 了解各个目录中的网址变化频率。

例如，请考虑以下网址：

`https://www.example.com/policies/return-policy.html`

`https://www.example.com/promotions/new-promos.html`

policies 目录中的内容几乎不会更改，但 promotions 目录中的内容可能会非常频繁地更改。Google 可以了解到这些信息，并以不同的频率抓取不同的目录。如需详细了解易于搜索的网站结构，请参阅我们的[电子商务网站指南](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure?hl=zh-cn)。商务网站往往规模更大，因此良好的网址结构更加重要。

#### 减少重复内容

某些网站会在不同网址下显示相同内容，这种情况称为重复内容。 搜索引擎会针对每个内容选择一个网址（规范网址）向用户显示。

您的网站上有重复内容并不违反我们的网络垃圾政策，但可能会造成糟糕的用户体验，而且搜索引擎可能会将抓取资源浪费在您根本不关心的网址上。如果您想尝试新事物，不妨了解一下是否可以为网页[指定规范版本](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=zh-cn)。但如果您未自行对网址进行规范化，Google 会尝试自动为您执行规范化操作。

进行规范化时，请尽量确保网站上的每一项内容都只能通过一个网址访问；如果两个网页中包含相同的促销活动信息，可能会使用户体验混乱（例如，用户可能想知道哪个网页是正确的，以及两者之间是否存在差异）。

如果您有多个包含相同信息的网页，请尝试将非首选网址[重定向](https://developers.google.com/search/docs/crawling-indexing/301-redirects?hl=zh-cn)到最能代表该信息的网址。如果无法重定向，请改用 `rel="canonical"` link 元素。但还是不必过于担心这一点，因为在大多数情况下，搜索引擎通常会自行理解。

### 让网站有趣且实用

与本指南中的任何其他建议相比，创建用户认为引人入胜且实用的内容对网站在搜索结果中的显示效果的影响可能更大。虽然“引人入胜且实用的内容”对不同的人来说可能具有不同的含义，但此类内容通常具有一些共同的特性，例如：

* **文字易于阅读且条理清晰**：以自然流畅的方式撰写内容，确保内容撰写得当、易于理解，没有拼写和语法错误。将长篇内容分成段落和章节，并提供标题以帮助用户浏览页面。
* **[内容独一无二](https://developers.google.com/search/docs/essentials/spam-policies?hl=zh-cn#scraped-content)**：在撰写新内容时，请勿复制他人的部分内容或全部内容，而是根据您对相应主题的了解自行创作内容。不要只是改编其他人已经发布的内容。
* **内容是最新的**：检查以前发布的内容并根据需要进行更新，如果不再相关，甚至可以将其删除。
* **内容[实用、可靠且以用户为中心](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=zh-cn)**：请务必确保所撰写的内容对读者有帮助且可靠。例如，提供专家信息或经验来源可以帮助用户了解文章的专业性。

#### 预期读者使用的搜索字词

思考用户找到您的某些内容时可能用到的搜索字词。相较于不太熟悉相关主题的用户，非常了解该主题的用户可能在搜索查询中会使用不同的关键字。例如，一些用户可能会搜索“熟食”，而另一些用户可能会搜索“奶酪拼盘”。预测搜索行为的这些差异并在撰写内容时考虑到您的读者，可能会对您的网站在搜索结果中的表现产生积极影响。

但是，如果您无法预料到用户查找您内容的所有方式，也不必担心。Google 的语言匹配系统非常复杂，能够理解您的网页与许多查询之间的关系，即使您并未明确使用其中的确切字词。

#### 避免投放会分散用户注意力的广告

虽然广告是互联网的一部分，目的就是要让用户看到，但不要让其过于分散注意力或阻止用户阅读您的内容。例如，让用户难以使用网站的广告或插页（在用户希望看到的内容之前或之后显示的页面）。

#### 指向相关资源的链接

链接是将用户和搜索引擎连接到您网站的其他部分或其他网站上的相关网页的好方法。事实上，Google 每天都是通过链接发现绝大多数的新网页，因此，要想让 Google 发现您的网页并有可能在搜索结果中显示它们，您需要考虑使用链接这项重要资源。此外，链接还可以将用户（和 Google）引导至能证实您所撰写内容的其他资源，从而增加价值。

![此示意图显示了一个网页如何链接到其他相关资源](https://image.ermao.net/images/blog/googleseo/image-2.png)

#### 撰写优质链接文字

链接文字（也称为定位文字）是您可以看到的链接文字部分。这类文字会告诉用户和 Google 有关您将链接到的网页的信息。借助[适当的定位文字](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=zh-cn#write-good-anchor-text)，用户和搜索引擎可以在访问之前轻松了解链接页包含的内容。此示意图显示了链接的文字部分

#### 在需要时提供链接

![google教你怎么做SEO 示例图片](https://image.ermao.net/images/blog/googleseo/image-3.png)

链接可为用户和搜索引擎提供有关某个主题的更多背景信息，这可能有助于展现您对该主题的了解程度。但是，如果您链接到无法控制的网页（例如其他网站上的内容），请确保您信任所链接到的资源。 如果您无法信任相应内容，但仍想链接到这些网站，请为该链接添加 `nofollow` [或类似注释](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links?hl=zh-cn)，以免搜索引擎将您的网站与您要链接到的网站关联起来。这有助于避免您在 Google 搜索中的排名受到潜在负面影响。

如果您的网站接受用户生成的内容（例如论坛帖子或评论），请确保 CMS 自动为用户发布的每个链接都添加了 `nofollow` 或类似注释。由于在这种情况下内容不是您创建的，因此您很可能不希望您的网站与用户链接到的网站盲目关联。这还有助于遏制垃圾内容发布者滥用您的网站。

### 影响您的网站在 Google 搜索中的外观

典型的 Google 搜索结果页由[几个不同的视觉元素](https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=zh-cn)组成，您可以通过影响这些元素来帮助用户决定是否应通过这些搜索结果访问您的网站。在本部分，我们将重点关注“标题链接”和“摘要”，因为它们是视觉上更重要的元素。

#### 影响标题链接

标题链接是搜索结果的标题部分，可以帮助用户决定点击哪个搜索结果。Google 会根据几个来源生成此标题链接，包括 `<title>` 元素内的字词（也称为标题文本）以及网页上的其他标题。此标题文本还可用作浏览器和书签中显示的标题。

![该图示展示了标题文本在网页上的外观以及它在 HTML 中的外观](https://image.ermao.net/images/blog/googleseo/image-4.png)

:::tip
**如果您使用 CMS**，那么除了专注于撰写优质标题之外，您可能不需要对标题采取任何技术性措施。大多数 CMS 都可以自动将您撰写的标题转换为 HTML 中的 `<title>` 元素。
:::

![google教你怎么做SEO 示例图片](https://image.ermao.net/images/blog/googleseo/image-5.png)

您可以通过撰写合适的标题来影响 Google 搜索中的标题链接：好的标题是网页独有的标题，简洁明了，能够准确描述网页内容。例如，标题可以包括您的网站或商家名称、其他的重要信息（比如商家的实际位置），以及有关特定网页可向用户提供哪些产品/服务的一些信息。请参阅我们[关于标题链接的文档](https://developers.google.com/search/docs/appearance/title-link?hl=zh-cn)，详细了解如何创建好的标题以及如何影响网站搜索结果的标题链接。

#### 控制摘要

在标题链接下方，搜索结果通常包含目标网页的说明，可帮助用户决定是否应点击该搜索结果。这称为摘要。

![阅读这篇完整指南，了解如何在 5 分钟内掌握各种鸡蛋烹饪方法。我们将介绍所有方法，包括：单面煎蛋、水煮蛋和煮荷包蛋。](https://image.ermao.net/images/blog/googleseo/image-6.png)

摘要源自搜索结果所链接到的网页的实际内容，因此您可以完全控制可用于生成摘要的字词。有时，摘要可能来自元描述标记的内容，通常是网页的一两句话简明摘要。良好的元描述应简短、是某个网页独有的，且包含该网页中最相关的信息。如需获得更多灵感，请查看我们关于[撰写优质元描述](https://developers.google.com/search/docs/appearance/snippet?hl=zh-cn#meta-descriptions)的提示。

#### 向您的网站添加图片并进行优化

很多人会直观地进行搜索，而图片可能是用户首次找到您网站的方式。 例如，如果您有一个食谱博客，用户可能会搜索“水果挞食谱”并浏览各种水果挞的照片，从而找到您的内容。

向您的网站添加图片时，请确保用户和搜索引擎可以找到并理解这些图片。

#### 在相关文字附近添加高画质图片

使用高画质图片时，您可为用户提供充足的上下文和细节，以便他们决定哪张图片最符合自己的需求。例如，如果用户搜索“雏菊”时在搜索结果中看到雪绒花，那么画质更好的图片将有助于用户区分花的类型。

使用清晰可辨的图片，并将其放在与图片相关的文字附近。图片旁边的文字可以帮助 Google 更好地了解图片的内容及其在网页中的含义。

例如，如果网页在评价伦敦的纱线店，那么合理的做法是在详细介绍某个纱线店位置、说明和评价信息的部分嵌入该纱线店的一张照片。这有助于 Google 和用户将图片与文字联系起来，为网页内容提供更多背景信息。

#### 为图片添加描述性替代文本

替代文本是一段简短的描述性文本，用于说明图片和内容之间的关系。它有助于搜索引擎了解图片的内容以及图片与网页之间的关系，因此撰写[合适的替代文本](https://developers.google.com/search/docs/appearance/google-images?hl=zh-cn#descriptive-alt-text)非常重要。您可以使用 img 元素的 alt 属性将替代文本添加到 HTML 中，或者在您将图片上传到网站时，您的 CMS 可以轻松地为图片指定说明信息。详细了解[如何撰写良好的替代文本](https://developers.google.com/search/docs/appearance/google-images?hl=zh-cn#descriptive-alt-text)以及如何将其添加到图片中。

### 优化您的视频

如果您的网站包含主要涉及个别视频的网页，用户也可以通过 Google 搜索中的视频结果发现您的网站。许多图片和文本最佳做法也适用于视频：

* 制作高品质的视频内容，并将视频嵌入到独立的网页上，靠近与该视频相关的文字。
* 在视频的标题和说明字段中撰写描述性文字（视频的标题仍然是标题，因此您也可以在此处采取撰写标题的最佳做法）。

如果您的网站特别侧重于视频，请继续阅读，了解您可以采取哪些措施来[针对搜索引擎优化视频](https://developers.google.com/search/docs/appearance/video?hl=zh-cn)。

### 推广您的网站

有效推广新内容能够让对同一主题感兴趣的人以及搜索引擎更快发现您的内容。为此，您可以采取以下多种方式：

* 社交媒体宣传
* 社区互动
* 离线和在线广告
* 口碑传播以及许多其他方法

口碑是[最有效持久的](https://www.nielsen.com/insights/2012/global-trust-in-advertising-and-brand-messages-2/)方式之一，也就是说，熟悉您网站的用户会将您的网站告诉朋友，而朋友也会访问您的网站。这可能需要一些时间，并且通常您需要先在其他做法（例如社区互动）中投入一些时间和精力。Google for Creators 团队的同事们拥有关于[建立和吸引受众群体](https://creators.google/en-us/content-creation-guides/audience-engagement/?hl=zh-cn)的宝贵资源。

倾注精力线下推广您的公司或网站也非常有帮助。例如，如果您拥有一个商家网站，请确保将网址印在您的商家名片、信头、海报和其他资料上。获得许可后，您还可以定期向受众群体发送简报，让他们了解您网站上的新内容。

与生活中的日常行为一样，您可能会过分宣传自己的网站，甚至带来负面影响：用户可能会对您的宣传感到厌倦，并且搜索引擎可能会认为某些做法是在[操纵搜索结果](https://developers.google.com/search/docs/essentials/spam-policies?hl=zh-cn)。

### 我们认为您不应重点关注的方面

随着 SEO 的不断发展，与其相关的理念和做法（有时还有误解）也在不断变化。 鉴于搜索引擎（和互联网）的发展方式，在过去被认为是最佳做法或重点优先事项的方面可能不再适用或不再有效。

为了帮助您专注于 SEO 真正重要的方面，我们收集了一些在互联网上传播的最常见和最突出的主题。总之，关于这些主题的建议是，您应采取最适合自己业务的做法；我们将在下面详细说明几个具体的点：

::: card-masonry cols="2" gap="3"

* **元关键字**

  Google 搜索[不使用关键字元标记](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag?hl=zh-cn)。

* **关键字堆砌**

  反复多次重复使用相同的字词（即使是变体）会让用户感到厌烦，[关键字堆砌违反了 Google 网络垃圾政策](https://developers.google.com/search/docs/essentials/spam-policies?hl=zh-cn#keyword-stuffing)。

* **域名或网址路径中的关键字**

  为网站选择名称时，请选择最适合您业务的名称。用户将通过此名称找到您的网站，因此我们建议您遵循常规营销最佳实践。从排名的角度来看，域名（或网址路径）中的关键字本身除了显示在[面包屑导航](https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=zh-cn#breadcrumb)中之外，几乎没有任何影响。

  还是关于域名的话题：TLD（即以“.com”或“.guru”等结尾的域名）仅在您以特定国家/地区的用户为目标受众群体时才重要，即使在这些情形下通常也影响力很小。例如，如果您要向在瑞士进行搜索的用户销售荷兰奶酪，那么从业务和 [SEO 的角度](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites?hl=zh-cn#geotargeting)来看，合理的做法是使用一个 .ch 域名。否则，Google 搜索并不在意您使用的是哪个 TLD（是 .com、.org 还是 .asia）。

* **内容长度下限或上限**

  内容长度本身对于排名而言并不重要（并没有什么效果最佳的字数目标下限或上限，不过您很可能希望长度至少是一个字词）。如果您使用了不同的字词（写得自然一些，不会重复），那么仅仅因为使用了更多关键字，就有更多机会在 Google 搜索中显示。

#####

* **子网域与子目录**

  从业务角度来看，可以采取对您的业务来说有意义的任何做法。例如，如果网站按子目录进行划分，则可能更容易管理，但有时则可能有必要将主题划分为子网域，具体取决于网站的主题或所在行业。

* **PageRank**

  虽然 [PageRank](https://developers.google.com/search/docs/appearance/ranking-systems-guide?hl=zh-cn#link-analysis) 使用链接，并且是 Google 的基本算法之一，但 Google 搜索的功能远不止链接。我们有许多排名衡量因素，而 PageRank 只是其中之一。

* **重复内容“处罚”**

  如果某些内容可通过多个网址访问，也没关系；完全不必为之忧虑。这种做法的效率低下，但也不会导致人工处置措施。[然而，复制他人的内容则另当别论](https://developers.google.com/search/docs/essentials/spam-policies?hl=zh-cn#scraped-content)。

* **标题的数量和顺序**

  按语义顺序排列标题对屏幕阅读器来说非常棒，但从 Google 搜索的角度来看，是否无序也无关紧要。网络通常不是有效的 HTML，因此 Google 搜索很少依赖于隐藏在 HTML 规范中的语义含义。

  此外，特定网页也没有什么效果最佳的理想标题数量。不过，如果您认为数量太多了，很可能就是太多了。

* **E-E-A-T 思维是一项排名因素**

  [它不是](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=zh-cn#eat)。

:::

### 后续步骤

* **Search Console 使用入门**：设置 Search Console 账号有助于您监控和优化您的网站在 Google 搜索中的表现。了解如何设[置账号以及首先应查看哪些报告](https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=zh-cn)。
* **长期维护网站的 SEO**：详细了解如何[长期管理网站的表现](https://developers.google.com/search/docs/fundamentals/get-started?hl=zh-cn)，包括更深入的 SEO 任务和场景，例如为网站迁移做准备或管理多语言的网站。
* **增强网站在 Google 搜索结果中的显示效果**：网页上包含有效的[结构化数据](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=zh-cn)还有助于网页在 Google 搜索结果中使用许多特殊功能，包括评价星级、轮播界面等。[查看您的网页有资格使用的搜索结果类型库](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=zh-cn)。

#### 随时了解最新资讯并提出问题

在您开始 SEO 之旅时，以下资源可以帮助您及时了解我们发布的更改和新资源：

* [Google 搜索中心博客](https://developers.google.com/search/blog?hl=zh-cn)：在 Google 搜索中心博客获取最新资讯。您可以找到关于 Google 搜索更新、Search Console 新功能及其他众多内容的信息。
* [LinkedIn](https://www.linkedin.com/showcase/googlesearchcentral/) 和 [X (Twitter)](https://twitter.com/googlesearchc) 上的 Google 搜索中心：请关注我们，了解 Google 搜索的最新动态，以及有助于您构建精彩网站的资源。
* [Google 搜索中心帮助论坛](https://support.google.com/webmasters/community?hl=zh-cn) 在网站所有者的产品论坛中，您可以就网站存在的 SEO 问题发帖咨询，还能找到有关创建品质出众的网站的妙招。论坛中有许多经验丰富的贡献者，包括[产品专家](https://productexperts.withgoogle.com/)，偶尔还会有 Google 员工。
* [Google 搜索中心 YouTube 频道](https://www.youtube.com/c/GoogleSearchCentral?hl=zh-cn)：观看我们为网站所有者录制的数百个实用视频。

## 结语

这篇文章==本身就是一篇非常好的 SEO 样例==，大家可以参考这篇文章的结构和内容，来优化自己的网站。

如果文章中所提到的每个细节你都能做到，那么你的网站在 Google 搜索中的排名肯定会有显著提升。
