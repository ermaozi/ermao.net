---
url: /article/gokrv7a1/index.md
description: >-
  Ubuntu 22.04 中 MongoDB 数据导入导出笔记，整理 mongoexport、mongoimport
  等工具安装与常用命令，适合开发环境迁移测试数据时参考。
---
近期在搭建开发环境时需要用到部分生产数据用于测试，单独作一篇文章来记录相关命令。

## 安装 MongoDB Database Tools

按[官方 Database Tools 安装指南](https://www.mongodb.com/docs/database-tools/installation/)选择与 Ubuntu 22.04 和 CPU 架构匹配的 Linux 软件包，再按对应说明安装。Database Tools 独立发布，不应从 MongoDB Server 的版本推断工具版本。

原笔记中的 `apt-key` 和 `focal/mongodb-org/6.0` 源不再作为 Ubuntu 22.04 的安装建议；MongoDB Server 6.0 已于 2025 年 7 月 31 日结束支持，详见[官方生命周期表](https://www.mongodb.com/legal/support-policy/lifecycles)。安装后可用以下命令检查工具版本：

```shell
mongoexport --version
mongodump --version
mongorestore --version
```

## 导出数据

### 导出单表（集合 collection）

```shell
mongoexport --uri="mongodb://localhost:27017" --db=mydatabase --collection=mycollection --out=output.json
```

### 导出单个数据库

```shell
mongodump --uri="mongodb://localhost:27017" --db=mydatabase --out=output
```

### 导出所有数据库

```shell
mongodump --uri="mongodb://localhost:27017" --out=output
```

## 导入数据

先在隔离的空测试环境中确认目标地址、数据库和备份内容，再执行导入或恢复；以下示例中的 `localhost:27017` 也必须确认是预期测试实例。覆盖现有数据前另做独立备份。生产样本仅使用获准的数据，并在移入开发环境前脱敏。

[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/) 接受 JSON、CSV 或 TSV；`mongodump` 生成的 BSON 目录应交给 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/)，不能用 `mongoimport` 读取。

### 导入单表（集合 collection）

```shell
mongoimport --uri="mongodb://localhost:27017" --db=mydatabase --collection=mycollection --file=output.json
```

### 导入单个数据库

```shell
mongorestore --uri="mongodb://localhost:27017" --nsInclude='mydatabase.*' output
```

### 导入所有数据库

```shell
mongorestore --uri="mongodb://localhost:27017" output
```

## 常见问题

### 已存在 key

E11000 duplicate key error collection

目标集合已存在冲突的唯一键。先在空测试集合中核验数据，或按业务含义处理冲突；不要为了消除报错直接添加 `--drop`。不带 `--drop` 的恢复仍会写入数据，也可能因重复键失败，应检查工具输出并核对集合、文档数量和索引。

### 已存在数据库

数据库存在不等于需要删除。`mongorestore --drop` 会在恢复前删除备份对应的目标集合，不删除备份中没有的集合，也不是删除整个已有数据库。只有明确需要替换、已确认目标并另做备份时才考虑使用。若恢复包含 `admin` 数据库，配合 `--drop` 还会移除现有用户凭证并以备份中的用户替换，应单独评估，不能当作普通数据覆盖。

`mongoexport --query` 用于筛选导出的文档，不是解决恢复冲突的参数。

### 提示身份验证失败（Authentication failed）

connection() error occurred during connection handshake: auth error: sasl conversation error: unable to authenticate using mechanism "SCRAM-SHA-1": (AuthenticationFailed) Authentication failed.

认证失败不能仅归因于 MongoDB 版本。先核对用户名、密码、权限、目标实例和 TLS 要求。`--authenticationDatabase` 指用户创建所在的认证库，不是认证机制；机制由 `--authenticationMechanism` 等连接选项指定，应按实际账户配置核对。

例如用户确实创建在 `admin` 中时，恢复 BSON 目录可使用：

```shell
mongorestore --uri="mongodb://localhost:27017" --username=USERNAME --authenticationDatabase=admin --nsInclude='mydatabase.*' output
```

将 `USERNAME` 替换为实际用户名；若用户创建在其他库，应相应修改认证库。提供用户名但省略密码选项时，工具会交互提示输入密码，不要把真实密码写进命令或连接字符串。
