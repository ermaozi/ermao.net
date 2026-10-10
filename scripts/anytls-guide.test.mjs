import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import matter from 'gray-matter'

const source = readFileSync(new URL('../docs/blog/文档/anytls协议完全指南.md', import.meta.url), 'utf8')
const english = readFileSync(new URL('../docs/en/blog/guides/anytls协议完全指南.md', import.meta.url), 'utf8')
const blocks = [...source.matchAll(/^```\s*(\w+)\s*\n([\s\S]*?)^```\s*$/gm)].map(([, language, text]) => ({ language, text }))
const jsonBlocks = blocks.filter(block => block.language === 'json')
const parsed = jsonBlocks.map(({ text }) => JSON.parse(text))
const compose = matter(`---\n${blocks.find(block => block.language === 'yaml').text}---`).data
const section = (start, end) => source.split(start)[1]?.split(end)[0]

test('AnyTLS examples are strict JSON and valid Compose YAML', () => {
  assert.equal(jsonBlocks.length, 17, 'Review coverage if examples are added or removed')
  assert.equal(blocks.filter(block => block.language === 'yaml').length, 1)
  for (const config of parsed) {
    assert.ok(config && typeof config === 'object')
    assert.equal(config.log?.output, undefined, 'Default examples must not require an unprovisioned log directory')
  }
  assert.equal(compose.services['sing-box'].image, 'ghcr.io/sagernet/sing-box:latest')
  assert.equal(compose.services['sing-box'].command, 'run -c /etc/sing-box/config.json')
  assert.deepEqual(compose.services['sing-box'].ports, ['443:443'])
})

test('Every server certificate path matches the Compose mounts and certificate installation', () => {
  const mounts = compose.services['sing-box'].volumes.map(value => value.split(':'))
  assert.deepEqual(mounts, [
    ['./config.json', '/etc/sing-box/config.json', 'ro'],
    ['./certs/fullchain.pem', '/etc/sing-box/fullchain.pem', 'ro'],
    ['./certs/privkey.pem', '/etc/sing-box/privkey.pem', 'ro'],
  ])
  const servers = parsed.flatMap(config => config.inbounds || []).filter(inbound => inbound.type === 'anytls')
  assert.equal(servers.length, 5)
  for (const server of servers) {
    for (const key of ['key_path', 'certificate_path']) {
      assert.ok(mounts.some(([, target]) => target === server.tls[key]), server.tls[key])
    }
    assert.ok(server.users.every(user => user.name && user.password), 'Keep legal sing-box user labels and passwords')
  }
  assert.match(source, /--key-file\s+\/etc\/sing-box\/privkey\.pem/)
  assert.match(source, /--fullchain-file\s+\/etc\/sing-box\/fullchain\.pem/)
  assert.match(source, /docker compose config\ndocker compose run --rm sing-box check -c \/etc\/sing-box\/config\.json/)
})

test('Package installation keeps the packaged service separate from a manually installed binary', () => {
  const packages = section('#### 3.2.1', '#### 3.2.2')
  assert.match(packages, /https:\/\/sing-box\.app\/install\.sh/)
  assert.match(packages, /sudo mkdir -p \/etc\/apt\/keyrings/)
  assert.match(packages, /https:\/\/sing-box\.app\/gpg\.key/)
  assert.match(packages, /systemctl cat sing-box/)
  assert.match(packages, /不要另建.*同名服务覆盖/)
  const service = section('#### 3.7.1', '#### 3.7.2')
  assert.match(service, /软件包安装.*沿用安装包自带服务/)
  assert.match(service, /手动二进制安装.*系统没有已有的/)
  assert.match(service, /ExecStart=\/usr\/local\/bin\/sing-box/)
  assert.match(source, /sudo install -m 755 "sing-box-\$\{SING_BOX_VERSION\}-linux-amd64\/sing-box" \/usr\/local\/bin\/sing-box/)
  assert.doesNotMatch(source, /deb-install\.sh|singbox\/sing-box|releases\/latest\/download\/sing-box-linux-amd64/)
  assert.match(section('#### 4.5.3', '### 4.6'), /不要用客户端配置覆盖服务端配置/)
})

test('Authentication and attribution follow the protocol without dropping server-side name labels', () => {
  assert.match(source, /参考实现和协议文档位于 \[anytls\/anytls-go\]/)
  assert.match(source, /从 1\.12\.0 起提供 AnyTLS 入站和出站支持/)
  assert.match(source, /TLS 握手完成后发送密码哈希认证请求.*sha256\(password\).*32 字节.*大端 uint16/)
  assert.match(source, /users\[\]\.name.*用于区分用户配置的标签/)
  assert.match(source, /不要手动把哈希填入 `password`/)
  assert.doesNotMatch(source, /由 sing-box 团队维护|sing-box团队开始设计|用户名\+密码的认证方式|客户端发送用户名和密码|核对用户名密码/)
  assert.match(english, /sha256\(password\)/)
  assert.match(english, /name` identifies the entry/)
})

test('Padding counts Write TLS indices and c exits when user data is exhausted', () => {
  assert.match(source, /stop=8 只处理序号 0–7，并非连接数量/)
  assert.match(source, /按 Write TLS 次数计数/)
  assert.match(source, /检查标记：上一个分包后若用户数据已发完，结束本次 Write TLS，跳过后续填充包/)
  assert.match(source, /0.*padding0.*认证请求发送，不支持分包/)
  assert.match(source, /不含 TLS 加密开销/)
  assert.doesNotMatch(source, /停止填充的连接数|在N个连接后停止填充|继续填充标记|指定连接类型的填充范围/)
})

test('Both mobile TUN examples use current address arrays', () => {
  const tuns = parsed.flatMap(config => config.inbounds || []).filter(inbound => inbound.type === 'tun')
  assert.equal(tuns.length, 2)
  for (const tun of tuns) {
    assert.deepEqual(tun.address, ['172.19.0.1/30'])
    assert.equal('inet4_address' in tun, false)
    assert.equal('inet6_address' in tun, false)
  }
  assert.match(source, /https:\/\/sing-box\.sagernet\.org\/migration\/#tun-address-fields-are-merged/)
})

test('Every route.final in complete examples resolves to a configured outbound', () => {
  for (const config of parsed) {
    if (!config.route?.final || !config.outbounds) continue
    assert.ok(config.outbounds.some(outbound => outbound.tag === config.route.final), config.route.final)
  }
})

test('Article identity and all existing navigation targets stay intact', () => {
  const data = matter(source).data
  assert.equal(data.title, 'AnyTLS协议是什么？AnyTLS原理、sing-box部署与客户端配置完整指南（2026）')
  assert.equal(data.permalink, '/article/anytls-guide/')
  assert.equal(data.createTime, '2026/05/08 08:33:10')
  const urls = [...source.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(match => match[1])
  for (const url of ['https://github.com/SagerNet/sing-box/releases', '../翻墙工具/Android手机使用clash.md', '../翻墙工具/windows下载安装clash.md', '../翻墙工具/ClashVergeRev安装与使用指南.md', '../翻墙工具/Shadowrocket新手使用教程.md', './什么是翻墙.md', './如何判断一个机场使用的线路类型.md', './路由器翻墙详细教程.md', '/posts/vpn/', './如何选择机场.md', '../跑路机场/机场跑路汇总.md']) assert.ok(urls.includes(url), url)
})
