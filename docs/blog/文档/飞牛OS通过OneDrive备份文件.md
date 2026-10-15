---
title: 飞牛OS通过docker安装OneDrive备份文件(超多废话版)
createTime: '2025/01/06 12:15:17'
permalink: /article/aofygutj/
tags:
  - 飞牛OS
  - docker
  - OneDrive
  - 备份
  - 文件
description: 飞牛 OS 通过 Docker 安装 OneDrive 并备份文件的教程，记录账号准备、容器部署、同步配置和备份注意事项，适合 NAS 用户参考。
---

手把手教学飞牛OS如何通过docker安装OneDrive备份文件

<!-- more -->

## 前言

飞牛OS本身可以很方便的通过百度网盘跟阿里云盘做备份。

但是众所周知，你们的部分资源是不能存储在国内的网盘中（密码箱也不行）

![飞牛OS通过OneDrive备份文件 示例图片 =198x193](https://image.ermao.net/images/article/aofygutj/image.png)

所以不得不将她们备份到国外混乱不堪的环境中。

今天就来手把手教你如何通过 OneDrive 备份文件。

## 注册 OneDrive

你必须得有个微软账号，如果没有的话，你可以去注册一个。

[官网地址](https://signup.live.com/)

同时推荐在淘宝找人拼车买个 Microsoft 365，这会使你的 OneDrive 空间变成 1T。

## 登入飞牛OS后台命令行

因为登陆时需要`交互式操作`，所以我们需要登陆后台命令行。

首先我们开启飞牛OS的 SSH 功能。

![飞牛OS通过OneDrive备份文件 示例图片 =1461x736](https://image.ermao.net/images/article/aofygutj/image-1.png)

然后在你本地终端登陆你的飞牛OS后台。

``` bash
ssh 飞牛用户名@飞牛地址
```

如下图

![飞牛OS通过OneDrive备份文件 示例图片 =692x133](https://image.ermao.net/images/article/aofygutj/image-2.png)

密码就是你的飞牛OS后台密码。注意，输入密码时是不会显示的，直接往上敲就可以了。

如果用户名、IP、密码都正确的话，你就可以登陆成功了。

![飞牛OS通过OneDrive备份文件 示例图片 =941x136](https://image.ermao.net/images/article/aofygutj/image-3.png)

## 切换为 root 用户

``` bash
sudo su
```

这里需要再输入一次密码，直接输入就好了。

![飞牛OS通过OneDrive备份文件 示例图片 =476x99](https://image.ermao.net/images/article/aofygutj/image-4.png)

你的用户名后面的`$`变成了`#`，这就表示你已经切换为 root 用户了。

## 准备好配置文件的目录

在飞牛OS后台，通常文件会在`/vol1/1000/你的用户名/`目录下。

其中`vol1`是存储池的编号，`1000`是你的用户编号。

你也可以依次点击 `文件管理` -> `我的文件` -> `右键目录` -> `详细信息` -> `复制原始路径` 来获取你的目录的路径。

![飞牛OS通过OneDrive备份文件 示例图片 =1786x702](https://image.ermao.net/images/article/aofygutj/image-5.png)

获取到了目录之后，我们给这个目录创建一个文件夹，用来持久化存储容器的配置文件。

``` bash
mkdir -p /vol1/1000/你的用户名/docker/onedrive/conf/
```

这个路径按你自己实际情况来就可以。

## 拉取镜像、创建容器

::: danger 先区分同步和备份，再启动容器
默认模式是双向同步，数据目录也默认以可读写方式挂载：本地删除可能删除云端文件，云端删除也可能删除本地文件；误改、损坏或勒索加密后的内容也可能传播。两个同步副本不等于独立备份。

首次运行前，先把本地和云端需要保留的数据保存到不参与本次同步的独立副本或快照，并确认能够恢复。核对账号、实际挂载路径和同步范围，先用少量非重要测试数据验证，再对正式目录执行 dry-run；发现意外删除、覆盖或目录范围不符时立即停止，不要直接进入后台运行。
:::

如果希望本地和云端都能编辑、两边保持一致，可以保留下面的双向模式。如果本地是唯一数据来源、只希望向云端归档，则应在首次预演和后续真实运行中都作以下调整：

- 在镜像名称之前同时加入 `-e ONEDRIVE_UPLOADONLY=1` 和 `-e ONEDRIVE_NOREMOTEDELETE=1`。**仅有 upload-only 仍可能删除远端已同步、但本地已删除的文件**；no-remote-delete 才用于阻止客户端删除远端条目。
- 把数据挂载改为 `-v 需要被同步的路径:/onedrive/data:ro`，限制容器对本地源数据的写入；配置目录 `/onedrive/conf` 仍需可写，以保存授权信息和同步状态。
- 这仍不是不可变备份：本地文件的修改或加密内容仍可能上传并替换云端当前版本。还需要独立副本、版本保留策略和恢复测试；`:ro` 也不能阻止客户端向云端写入。

以下两段是同一个**双向同步预演**的模板和实例，任选一段，替换路径后运行。`ONEDRIVE_DRYRUN=1` 只预览同步动作，不实际上传、下载或删除数据文件；`ONEDRIVE_SYNC_ONCE=1` 让预演结束后退出。授权及预演仍会在配置目录中写入凭据或状态，不能把它理解为整个容器完全不写盘。变量含义见[官方 Docker 文档](https://github.com/abraunegg/onedrive/blob/master/docs/docker.md)。

``` bash
docker run -it --name onedrive \
    -v /vol1/1000/你的用户名/docker/onedrive/conf/:/onedrive/conf \
    -v 需要被同步的路径:/onedrive/data \
    -e "ONEDRIVE_UID=1000" \
    -e "ONEDRIVE_GID=1000" \
    -e ONEDRIVE_DRYRUN=1 \
    -e ONEDRIVE_SYNC_ONCE=1 \
    -e ONEDRIVE_VERBOSE=1 \
    driveone/onedrive:latest
```

记得把上面的两处汉字`你的用户名`跟`需要被同步的路径`替换实际的值。

例如这个例子：

``` bash
docker run -it --name onedrive \
    -v /vol1/1000/emz/docker/onedrive/conf:/onedrive/conf \
    -v /vol1/1000/emz/同步/onedrive:/onedrive/data \
    -e "ONEDRIVE_UID=1000" \
    -e "ONEDRIVE_GID=1000" \
    -e ONEDRIVE_DRYRUN=1 \
    -e ONEDRIVE_SYNC_ONCE=1 \
    -e ONEDRIVE_VERBOSE=1 \
    driveone/onedrive:latest
```

容器启动后，会提示你登陆 OneDrive。点击其中的链接，然后登陆你的 OneDrive 账号。这时候会跳转到一个页面，需要复制这个页面的地址，然后回到终端，粘贴到终端中，回车。

![飞牛OS通过OneDrive备份文件 示例图片 =1035x193](https://image.ermao.net/images/article/aofygutj/image-6.png)

![飞牛OS通过OneDrive备份文件 示例图片 =1361x462](https://image.ermao.net/images/article/aofygutj/image-7.png)

成功登陆后，上面的命令会预演同步。确认日志明确显示 dry-run，再逐项检查计划中的上传、下载和删除；没有成功完成预演或未理解输出时，不要去掉预演参数。旧截图仅用于辨认界面，以实际日志为准。

![飞牛OS通过OneDrive备份文件 示例图片 =1362x235](https://image.ermao.net/images/article/aofygutj/image-8.png)

配置目录中的 `refresh_token` 等文件包含账号授权信息，其他文件还保存同步状态。不要公开、放进共享目录或提交到代码仓库；备份应加密并限制访问。密码变更或授权失效时，按官方 Docker 文档的 `ONEDRIVE_REAUTH=1` 流程重新授权，不要把手动删除令牌或整个配置目录作为默认处理方法。

迁移前先停止旧容器，再安全备份并传输 `conf` 目录；在新环境核对账号、数据路径和原有同步模式，重新预演，避免两边同时使用同一套状态运行。

![飞牛OS通过OneDrive备份文件 示例图片 =505x309](https://image.ermao.net/images/article/aofygutj/image-9.png)

## 后台持久运行

只有独立副本已保全、预演结果符合预期后，才进入真实同步。首次可在前面的命令中去掉 `ONEDRIVE_DRYRUN=1`，保留 `ONEDRIVE_SYNC_ONCE=1`，用测试数据完成一次真实同步和恢复验证，再安排长期后台运行。重建前先删除同名的旧容器对象；不要删除挂载的数据或配置目录。

**恢复验证：**确认测试文件出现在预期云端目录后，把它恢复到另一个不参与同步的目录或设备，比较文件内容、大小或哈希，并实际打开检查；再用专门的测试文件验证历史版本和删除后的恢复，核实账号的保留期限。不要拿唯一的正式文件做删除试验。仅看到“上传成功”不能证明备份可恢复。

首先删除之前的容器

``` bash
docker rm -f onedrive
```

然后重新启动容器，跟预演不同的是，去掉 `ONEDRIVE_DRYRUN=1` 和 `ONEDRIVE_SYNC_ONCE=1`，把 `-it` 改为 `-d`，同时添加 `--restart always`。**下面会立即执行真实的双向同步**；如果之前选的是单向归档，必须继续保留 `ONEDRIVE_UPLOADONLY=1`、`ONEDRIVE_NOREMOTEDELETE=1` 和数据挂载的 `:ro`，不能直接照抄双向示例。不要同时运行两个使用相同配置目录的容器。

``` bash
docker run -d --name onedrive \
    --restart always \
    -v /vol1/1000/你的用户名/docker/onedrive/conf/:/onedrive/conf \
    -v 需要被同步的路径:/onedrive/data \
    -e "ONEDRIVE_UID=1000" \
    -e "ONEDRIVE_GID=1000" \
    driveone/onedrive:latest
```

启动成功后，容器会在后台持久运行。并且飞牛OS的容器管理中也可以看到该容器了。

![飞牛OS通过OneDrive备份文件 示例图片 =910x139](https://image.ermao.net/images/article/aofygutj/image-10.png)

在运行日志中还可以看到容器的运行情况。

定期检查授权失效、空间不足、跳过文件和同步失败等日志，并重复恢复测试。更换挂载路径、同步方向或过滤规则前，也应先保全数据、停止旧实例并重新预演；不要把 `resync` 作为日常启动参数。

![飞牛OS通过OneDrive备份文件 示例图片 =1326x840](https://image.ermao.net/images/article/aofygutj/image-11.png)

## 配置文件

`/vol1/1000/你的用户名/docker/onedrive/conf/`目录下有一个名字叫`config`的文件，这个文件是容器的配置文件。

你可以通过修改它来优化同步效果。

例如这是我的配置文件：

``` bash
# 容器中的需要被同步的目录
sync_dir = "/onedrive/data"
# 自定义哪些文件夹不被同步，这里是双向的，本地和云端都生效（本地的不会上传，云端的不会下载）
skip_dir = "~*|.~*|*.tmp"
# 忽略所有隐藏文件和文件夹
skip_dotfiles = "true"
```

关于配置文件的详细说明可以参考官方文档

[https://github.com/abraunegg/onedrive/blob/master/docs/usage.md](https://github.com/abraunegg/onedrive/blob/master/docs/usage.md)

## docker 命令简单介绍

`-it`：表示交互式操作，其中`i`是交互式操作，`t`是创建一个终端。

`-d`：表示后台运行。

`--name`：容器的名字，可以自定义。

`-v`：挂载目录，左边是宿主机目录，右边是容器目录。

`-e`：环境变量，用于传递参数。

`--restart always`：表示容器退出后自动重启。
