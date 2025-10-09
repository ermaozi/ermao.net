---
title: ubuntu2204中mongodb数据导入导出
tags:
  - ubuntu
  - mongodb
  - 运维
  - 数据库
  - 备份
createTime: 2024/09/28 08:36:06
permalink: /article/gokrv7a1/
---

近期在搭建开发环境时需要用到部分生产数据用于测试，单独作一篇文章来记录相关命令。

<!-- more -->

## 安装 mongodb-org-tools

在 Ubuntu 22.04 上，`mongo-tools` 包可能不可用。可以直接安装 MongoDB 客户端工具，它们包含了 `mongoexport` 工具。以下是安装步骤：

### 导入 MongoDB 公共 GPG 密钥：

```shell
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```

### 创建 MongoDB 源列表文件：

```shell
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### 更新包数据库：

```shell
sudo apt update
```

### 安装 MongoDB 客户端工具：

```shell
sudo apt install -y mongodb-org-tools
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

### 导入单表（集合 collection）

```shell
mongoimport --uri="mongodb://localhost:27017" --db=mydatabase --collection=mycollection --file=output.json
```

### 导入单个数据库

```shell
mongorestore --uri="mongodb://localhost:27017" --db=mydatabase --drop output/mydatabase
```

### 导入所有数据库

```shell
mongorestore --uri="mongodb://localhost:27017" --drop output
```

## 常见问题

### 已存在 key

E11000 duplicate key error collection

在导入数据时，如果数据库中已经存在相同的 key，可以使用 `--drop` 参数来删除已有数据。

### 已存在数据库

在导入数据时，如果数据库已经存在，可以使用 `--drop` 参数来删除已有数据库。在导出数据时，可以使用 `--query` 参数来指定导出条件。

### 提示身份验证失败（Authentication failed）

connection() error occurred during connection handshake: auth error: sasl conversation error: unable to authenticate using mechanism "SCRAM-SHA-1": (AuthenticationFailed) Authentication failed.

这是因为 MongoDB 4.0 之后默认使用了 SCRAM-SHA-1 认证方式，而之前的版本使用了 MONGODB-CR 认证方式。可以在连接字符串中指定认证方式：

```shell
# [!code word:--authenticationDatabase=admin]
mongoimport --uri="mongodb://localhost:27017" --authenticationDatabase=admin --drop output
```