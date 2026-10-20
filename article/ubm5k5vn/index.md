---
url: /article/ubm5k5vn/index.md
description: 因为 debian 更稳定、更轻量，所以想把 wsl2 中的 ubuntu 换成 debian。 本文记录一下过程。
---
因为 debian 更稳定、更轻量，所以想把 wsl2 中的 ubuntu 换成 debian。

本文记录一下过程。迁移时先保留 Ubuntu，安装干净的 Debian 后按需迁移文件；将 Ubuntu 的备份改名导入，不会把它转换成 Debian。

## 步骤 1: 导出当前的 Ubuntu 发行版

首先，需要将当前的 Ubuntu 发行版导出为一个 `.tar` 文件，以便以后可以恢复（如果需要的话）。

**以下命令都是在 Windows PowerShell 中运行的。**

```powershell
# 确认当前的 Ubuntu 发行版名称
wsl --list --verbose
# 保存工作并停止该发行版后，再导出备份
wsl --terminate Ubuntu-20.04
wsl --export Ubuntu-20.04 ubuntu_backup.tar
```

这会将 Ubuntu 发行版导出到当前目录，并保存为 `ubuntu_backup.tar`。

![导出当前的 Ubuntu 发行版 =1292x260](https://image.ermao.net/images/article/ubm5k5vn/image.png)

上面命令中的 `Ubuntu-20.04` 可能会因为你的 Ubuntu 版本而有所不同。确保将其替换为你的 Ubuntu 发行版名称。

## 步骤 2: 卸载当前的 Ubuntu 发行版

**此步骤先跳过，作为迁移验证后的可选清理。** Ubuntu 与 Debian 可以并存，不需要先卸载 Ubuntu。原来的卸载截图仅供最后核对命令使用；注销会永久删除该发行版的数据、软件和配置，不能只确认备份文件存在就执行。请先完成下面的安装、迁移及备份恢复验证。

![卸载ubuntu =909x163](https://image.ermao.net/images/article/ubm5k5vn/image-1.png)

## 步骤 3: 安装 Debian 发行版

可以从 Microsoft Store 安装 Debian。如果你喜欢命令行安装，可以使用以下命令：

```powershell
wsl --install -d Debian
```

![安装 Debian 发行版 =1863x431](https://image.ermao.net/images/article/ubm5k5vn/image-2.png)

这会安装 WSL 提供的 Debian 发行版；可先用 `wsl --list --online` 核对可用名称。首次运行时，Debian 会要求你创建一个新的用户和密码。

## 步骤 4: 恢复原来的数据（如果需要）

在新 Debian 中重新安装所需软件，按需复制个人文件和项目，并逐项核对配置兼容性。不要直接覆盖 Debian 的系统目录或整套 Ubuntu 配置；数据库应使用对应软件的导出、导入流程。

如果需要验证备份或恢复旧环境，可将 `ubuntu_backup.tar` 导入为一个**独立的 Ubuntu 恢复实例**。在备份所在目录运行，下面的安装路径需替换为有足够空间且未被其他发行版占用的位置：

```powershell
wsl --import Ubuntu-Restore "C:\WSL\Ubuntu-Restore" ubuntu_backup.tar --version 2
wsl -d Ubuntu-Restore
```

这仍然是 Ubuntu，名称及 `--version 2` 不会改变发行版内容；后者只指定使用 WSL 2。检查恢复实例中的文件是否完整、关键应用能否运行，再继续迁移。完成检查后用 `exit` 退出恢复实例，回到 Windows PowerShell 执行后续 WSL 命令。导入的实例可能默认以 root 启动，原用户名与 Debian 新建用户也不一定相同，复制后需核对文件归属和权限。

## 步骤 5: 进入 Debian

通过以下命令进入新的 Debian 环境：

```powershell
wsl -d Debian
```

验证 Debian 中的项目、数据和应用都正常，且 Ubuntu 备份已成功恢复验证后，用 `exit` 返回 Windows PowerShell，再设置默认发行版：

```powershell
wsl --set-default Debian
```

确认不再需要旧环境后，才可选择执行以下清理命令。**它会永久删除原 Ubuntu 的数据、软件和配置；请再次核对发行版名称，并保留独立的备份文件。** 不清理也可以继续使用 Debian。

```powershell
wsl --unregister Ubuntu-20.04
```

命令含义及删除风险参见 [Microsoft WSL 官方基本命令说明](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)。

如果之前用的 WindowsTerminal，记得改一下默认启动项。

![修改windowsterminal默认启动项 =1770x1211](https://image.ermao.net/images/article/ubm5k5vn/image-3.png)
