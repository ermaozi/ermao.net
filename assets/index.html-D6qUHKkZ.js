import{_ as s,c as n,a as r,b as t,d as l,w as o,r as p,o as d,e as i}from"./app-DcxoQjQA.js";const h="/assets/image-EjApq5Ns.png",m="/assets/image-1-CBKinZ0h.png",c="/assets/image-2-BiOZQMxy.png",g="/assets/image-3-BV6uG0R-.png",f="/assets/image-4-c2t8aife.png",u={};function O(k,a){const e=p("RouteLink");return d(),n("div",null,[a[3]||(a[3]=r('<p>大多数教程都集中在如何本地部署 DeepSeek 模型，但本教程将引导您探索另一种方法：通过搜索引擎（如 Fofa 和 Shodan）查找公开的 Ollama 模型 API 服务。</p><p>Ollama 是一个强大的支持本地部署的大型语言模型，允许用户通过 API 进行交互。借助 Fofa 和 Shodan 等搜索引擎，您可以定位那些暴露在互联网上的 Ollama 服务，并将其集成到自己的项目中，以便更加便捷地实现 AI 交互。</p><h2 id="一、通过-fofa-搜索-ollama-api" tabindex="-1"><a class="header-anchor" href="#一、通过-fofa-搜索-ollama-api"><span>一、通过 Fofa 搜索 Ollama API</span></a></h2><p>Fofa 是一个强大的互联网设备和服务搜索引擎，可以帮助用户发现公开的 API 服务。通过在 Fofa 中输入特定的关键词，您可以精准地找到暴露在互联网上的 Ollama API 服务。</p><h3 id="_1-1-fofa-搜索步骤" tabindex="-1"><a class="header-anchor" href="#_1-1-fofa-搜索步骤"><span>1.1 Fofa 搜索步骤</span></a></h3><ol><li><p>打开 Fofa 官网，在搜索框中输入以下查询语句：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>app=&quot;Ollama&quot; &amp;&amp; is_domain=false</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><strong>app=&quot;Ollama&quot;</strong>：用于筛选与 Ollama 相关的在线服务。</li><li><strong>is_domain=false</strong>：排除域名服务，仅显示直接暴露的 API 端点，减少干扰信息。</li></ul></li><li><p>点击搜索后，您将看到所有公开的 Ollama API 服务列表，并可以根据需要进行进一步筛选和分析。</p></li></ol><h3 id="_1-2-结果分析" tabindex="-1"><a class="header-anchor" href="#_1-2-结果分析"><span>1.2 结果分析</span></a></h3><p>如果搜索结果显示相关的 IP 地址和端口号，您可以尝试访问这些服务，以检查是否开放了 Ollama API。</p><p>请注意，访问时务必遵守相关法律法规，确保您连接到合法且授权的 API，避免未经许可的操作，防止违反法律。</p><p><img src="'+h+'" alt="Ollama 本地部署的 DeepSeek"></p><h2 id="二、shodan-搜索-ollama-api" tabindex="-1"><a class="header-anchor" href="#二、shodan-搜索-ollama-api"><span>二、Shodan 搜索 Ollama API</span></a></h2><p>Shodan 是另一个强大的搜索引擎，专门用于查找互联网上的各种设备和服务。通过 Shodan，您可以发现运行中的 Ollama 服务实例。</p><h3 id="_2-1-shodan-搜索步骤" tabindex="-1"><a class="header-anchor" href="#_2-1-shodan-搜索步骤"><span>2.1 Shodan 搜索步骤</span></a></h3><ol><li><p>打开 <a href="https://shodan.io" target="_blank" rel="noopener noreferrer">Shodan 官网</a>，在搜索框中输入以下查询语句：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>Ollama is running</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这个查询用于查找运行中的 Ollama 服务。</p></li><li><p>搜索结果将返回包含 Ollama API 实例的 IP 地址和端口号。</p></li></ol><h3 id="_2-2-结果分析" tabindex="-1"><a class="header-anchor" href="#_2-2-结果分析"><span>2.2 结果分析</span></a></h3><p>Shodan 会提供关于公开服务的详细信息，如 IP 地址、端口号和可能的 API 路径等。同样，确保这些服务是合法的，并且您有权访问。</p><p><img src="'+m+'" alt="Ollama 本地部署的 DeepSeek"></p><h2 id="三、如何访问找到的-ollama-api" tabindex="-1"><a class="header-anchor" href="#三、如何访问找到的-ollama-api"><span>三、如何访问找到的 Ollama API</span></a></h2><h3 id="_3-1-使用-chatbox-连接到远程-ollama-服务" tabindex="-1"><a class="header-anchor" href="#_3-1-使用-chatbox-连接到远程-ollama-服务"><span>3.1 使用 Chatbox 连接到远程 Ollama 服务</span></a></h3><ol><li>下载并安装 <a href="https://chatboxai.app/" target="_blank" rel="noopener noreferrer">Chatbox AI</a>。</li><li>打开 Chatbox 设置，在模型提供方中选择 &quot;Ollama&quot;。 <img src="'+c+'" alt="Ollama 本地部署的 DeepSeek"></li><li>在模型下拉框中选择您运行的本地模型。 <img src="'+g+'" alt="Ollama 本地部署的 DeepSeek"></li><li>点击保存后，您便可以通过 Chatbox 与远程 Ollama 服务进行交互。 <img src="'+f+'" alt="Ollama 本地部署的 DeepSeek"></li></ol><h2 id="四、安全性和合规性" tabindex="-1"><a class="header-anchor" href="#四、安全性和合规性"><span>四、安全性和合规性</span></a></h2><p>在访问和使用这些 API 时，请务必考虑以下几点：</p><ol><li><strong>合法性</strong>：确保您访问的 API 是公开且经过授权的，避免任何未经许可的访问行为。</li><li><strong>安全性</strong>：如果您计划公开暴露自己的 Ollama API，确保使用 HTTPS 加密，并采取身份验证措施，防止恶意访问。</li><li><strong>防火墙配置</strong>：确保防火墙配置正确，允许合法请求访问您的 API，同时阻止不必要的外部访问。</li></ol><p>遵循这些安全措施，您可以在使用 Ollama API 时确保合法性与安全性。</p><h2 id="五、总结" tabindex="-1"><a class="header-anchor" href="#五、总结"><span>五、总结</span></a></h2><p>通过 Fofa 和 Shodan 等搜索引擎，您可以轻松找到暴露在互联网上的 Ollama 本地模型 API 服务。利用这些 API，您能够将 Ollama 模型集成到自己的项目中，进行各种自然语言处理任务。</p><p>但在使用这些服务时，请务必遵守相关法律法规并采取适当的安全措施，确保操作合法并且安全。</p><p>希望本教程能帮助您顺利上手，并有效地利用 Ollama 本地模型 API！</p><h2 id="六、相关链接" tabindex="-1"><a class="header-anchor" href="#六、相关链接"><span>六、相关链接</span></a></h2>',29)),t("p",null,[l(e,{to:"/article/c3gj5lqy/"},{default:o(()=>a[0]||(a[0]=[i("通过Ollama本地部署DeepSeek代码大模型：从硬件配置到VSCode实战指南")])),_:1})]),t("p",null,[l(e,{to:"/posts/vpn/"},{default:o(()=>a[1]||(a[1]=[i("便宜好用的翻墙机场推荐评测(长期更新 欢迎推荐)")])),_:1})]),t("p",null,[l(e,{to:"/article/jqtuqouj/"},{default:o(()=>a[2]||(a[2]=[i("使用cloudflare进行URL重定向")])),_:1})])])}const I=s(u,[["render",O]]),A=JSON.parse('{"path":"/article/tj38tso3/","title":"搜索引擎查找 Ollama 本地部署的 DeepSeek，实现免费 AI 运行","lang":"zh-CN","frontmatter":{"title":"搜索引擎查找 Ollama 本地部署的 DeepSeek，实现免费 AI 运行","createTime":"2025/02/12 7:25:01","permalink":"/article/tj38tso3/","tags":["Ollama","DeepSeek","Fofa","Shodan","Chatbox","AI","搜索引擎","免费"],"description":"大多数教程都集中在如何本地部署 DeepSeek 模型，但本教程将引导您探索另一种方法：通过搜索引擎（如 Fofa 和 Shodan）查找公开的 Ollama 模型 API 服务。 Ollama 是一个强大的支持本地部署的大型语言模型，允许用户通过 API 进行交互。借助 Fofa 和 Shodan 等搜索引擎，您可以定位那些暴露在互联网上的 Olla...","head":[["meta",{"property":"og:url","content":"https://www.ermao.net/article/tj38tso3/"}],["meta",{"property":"og:title","content":"搜索引擎查找 Ollama 本地部署的 DeepSeek，实现免费 AI 运行"}],["meta",{"property":"og:description","content":"大多数教程都集中在如何本地部署 DeepSeek 模型，但本教程将引导您探索另一种方法：通过搜索引擎（如 Fofa 和 Shodan）查找公开的 Ollama 模型 API 服务。 Ollama 是一个强大的支持本地部署的大型语言模型，允许用户通过 API 进行交互。借助 Fofa 和 Shodan 等搜索引擎，您可以定位那些暴露在互联网上的 Olla..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-12T07:46:47.000Z"}],["meta",{"property":"article:tag","content":"Ollama"}],["meta",{"property":"article:tag","content":"DeepSeek"}],["meta",{"property":"article:tag","content":"Fofa"}],["meta",{"property":"article:tag","content":"Shodan"}],["meta",{"property":"article:tag","content":"Chatbox"}],["meta",{"property":"article:tag","content":"AI"}],["meta",{"property":"article:tag","content":"搜索引擎"}],["meta",{"property":"article:tag","content":"免费"}],["meta",{"property":"article:modified_time","content":"2025-02-12T07:46:47.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"搜索引擎查找 Ollama 本地部署的 DeepSeek，实现免费 AI 运行\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-02-12T07:46:47.000Z\\",\\"author\\":[]}"]]},"readingTime":{"minutes":3.77,"words":1130},"git":{"updatedTime":1739346407000,"contributors":[{"name":"ermaozi","username":"ermaozi","email":"admin@ermao.net","commits":2,"avatar":"https://avatars.githubusercontent.com/ermaozi?v=4","url":"https://github.com/ermaozi"}]},"autoDesc":true,"filePathRelative":"文档/免费deepseek.md","headers":[],"categoryList":[{"id":"325369","sort":10000,"name":"文档"}]}');export{I as comp,A as data};
