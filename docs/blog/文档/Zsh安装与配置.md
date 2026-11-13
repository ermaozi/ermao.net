---
title: Zsh 安装与配置 - 使用 Oh My Zsh 美化终端
createTime: '2025/01/27 11:07:08'
permalink: /article/106izvxs/
tags:
  - Zsh
  - Oh My Zsh
  - 终端
  - Linux
  - Debian
  - Shell
  - 命令行
description: >-
  传统的 Bash 功能相对简陋且不美观。本文将带你通过 Debian 系统(Ubuntu 也一样)，安装 Zsh 以及 Oh My
  Zsh，对终端进行美化。Oh My Zsh 是 Zsh 的一个扩展工具集，提供了丰富的功能和主题，让终端界面更加个性化和高效。
---

传统的 Bash 功能相对简陋且不美观。本文将带你通过 Debian 系统(Ubuntu 也一样)，安装 Zsh 以及 Oh My Zsh，对终端进行美化。Oh My Zsh 是 Zsh 的一个扩展工具集，提供了丰富的功能和主题，让终端界面更加个性化和高效。

<!-- more -->

## 1. 环境配置

### 1.1 安装基本工具

首先，更新系统并安装必要的工具：

```bash
# 更新软件源
sudo apt update && sudo apt upgrade -y

# 安装 Zsh、Git 和 Curl
sudo apt install zsh git curl -y
```

设置当前用户的登录 shell（记得不要加 `sudo`）：

```bash
chsh -s /bin/zsh
```

`chsh` 不会把当前正在运行的 Bash 变成 Zsh；登录 shell 的更改需要重新登录才会生效。

### 1.2 安装 Oh My Zsh

使用 [Oh My Zsh 官方安装脚本](https://github.com/ohmyzsh/ohmyzsh/blob/master/tools/install.sh)。下面按默认的 `~/.zshrc` 和 `~/.oh-my-zsh` 路径操作；若设置过 `ZDOTDIR` 或自定义 `ZSH`，先确认实际路径，不直接套用。

先为已有配置建立独立备份，记下输出的备份目录；任何一步失败都先停止，不继续安装：

```bash
zsh_backup_dir=$(mktemp -d "$HOME/zsh-backup.XXXXXX") &&
if [ -e "$HOME/.zshrc" ] || [ -L "$HOME/.zshrc" ]; then
  cp -p "$HOME/.zshrc" "$zsh_backup_dir/zshrc"
fi && printf '%s\n' "$zsh_backup_dir"
```

下载官方脚本并阅读，确认后才执行。脚本具有当前用户的文件操作权限，不使用 `sudo`：

```bash
omz_review_dir=$(mktemp -d) &&
curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh \
  -o "$omz_review_dir/install.sh" &&
less "$omz_review_dir/install.sh"
```

确认下载与检查均成功后，单独执行：

```bash
KEEP_ZSHRC=yes CHSH=no RUNZSH=no sh "$omz_review_dir/install.sh"
```

这会保留已有 `.zshrc`，不自动修改登录 shell，也不自动进入 Zsh；没有 `.zshrc` 时仍会创建模板。若已有配置被保留，安装完成不代表框架已经加载：对照 `~/.oh-my-zsh/templates/zshrc.zsh-template` 手动合并需要的设置，保留自己的变量和别名，不重复添加加载行。默认路径下，最小设置为：

```zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

不要依赖 `curl ... | sh` 的覆盖确认提示：官方脚本检测到标准输入不是终端时，会关闭覆盖确认、修改登录 shell 和自动启动 Zsh。已有配置若未显式要求保留，可能被备份后替换，而不是等待你同意。

配置准备好后，运行 `zsh` 进入 Zsh，再进行下面的加载操作。若新配置有问题，退出这次 Zsh 会话，在原 shell 中用刚才备份的 `zshrc` 恢复 `~/.zshrc`；没有旧文件时不要误用其他备份。

### 1.3 从 `.bashrc` 迁移配置（可选）

如果你曾在 Bash 中自定义了一些环境变量或别名，在切换到 Zsh 后，需要手动迁移这些配置。操作步骤如下：

```bash
# 查看原 Bash 配置文件
cat ~/.bashrc

# 编辑 Zsh 配置文件并粘贴自定义配置
nano ~/.zshrc

# 仅在已经进入 Zsh 的终端中使配置生效
source ~/.zshrc
```

如果是 root 用户，执行 `sudo su` 后再次进行上述操作。

## 2. 配置主题

### 2.1 自定义主题

你可以下载自定义的 Zsh 主题：

```bash
# 下载主题文件
sudo wget -O $ZSH_CUSTOM/themes/haoomz.zsh-theme https://cdn.haoyep.com/gh/leegical/Blog_img/zsh/haoomz.zsh-theme

# 编辑 .zshrc 文件，设置主题
nano ~/.zshrc

# 设置主题为 haoomz
ZSH_THEME="haoomz"

# 使配置生效
source ~/.zshrc
```

你也可以选择其他主题，例如 `lukerandall` 或 `robbyrussell`。

### 2.2 推荐主题

Oh My Zsh 内置了多个主题，你可以查看所有主题样式：

```bash
cd ~/.oh-my-zsh/themes && ls
```

#### 2.2.1 Powerlevel10k

根据许多用户推荐，`powerlevel10k` 主题非常美观且自定义性强，强烈推荐使用：

```bash
# 克隆 Powerlevel10k 主题
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 设置主题
ZSH_THEME="powerlevel10k/powerlevel10k"
```

完成后，终端会自动引导你配置 `powerlevel10k` 主题。

## 3. 安装插件

Oh My Zsh 已经内置了许多有用的插件，像是 `git` 插件。你可以在 `~/.oh-my-zsh/plugins` 目录查看所有内置插件。

### 3.1 插件推荐

#### 3.1.1 Zsh Auto-suggestions

`zsh-autosuggestions` 插件会根据你的输入，自动建议可能的命令，按下 `右箭头` 即可自动补全。

```bash
# 安装插件
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

#### 3.1.2 Zsh Syntax Highlighting

`zsh-syntax-highlighting` 插件会根据命令合法性高亮显示：合法的命令为绿色，不合法的命令为红色。

```bash
# 安装插件
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

#### 3.1.3 `z` 插件

内置的 `z` 插件可以让你快速跳转到最近访问过的目录，避免输入长路径。

#### 3.1.4 `extract` 插件

`extract` 插件可以解压各种格式的压缩文件，使用 `x` 命令即可：

```bash
# 使用 x 解压文件
x file.tar.gz
```

#### 3.1.5 `web-search` 插件

`web-search` 插件允许你在终端直接搜索，支持多种搜索引擎。

### 3.2 启用插件

启用插件，在 `~/.zshrc` 中修改现有的 `plugins` 列表，并保留在 `source $ZSH/oh-my-zsh.sh` 之前。[zsh-syntax-highlighting 官方安装说明](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#oh-my-zsh)要求它最后加载，以便处理其他插件创建的 ZLE 组件：

```bash
plugins=(
  git
  zsh-autosuggestions
  z
  extract
  web-search
  zsh-syntax-highlighting
)
```

保存后重新打开一个 Zsh 终端，使插件按新的顺序加载。若当前终端仍使用 Bash，先启动 `zsh`，不要在 Bash 中执行 `source ~/.zshrc`。

## 4. 小贴士

### 4.1 Root 用户配置

如果你想让 root 用户也使用 Zsh，建议在 root 的环境中安装 Oh My Zsh，并设置不同的主题以便区分：

```bash
ZSH_THEME="ys"
plugins=(
  git
  zsh-autosuggestions
  z
  extract
  web-search
  zsh-syntax-highlighting
)
```

### 4.2 配置本地代理

如果你在终端使用代理，可以在 `.zshrc` 中设置代理：

```bash
# 设置代理
proxy () {
  export ALL_PROXY="socks5://127.0.0.1:1089"
  export all_proxy="socks5://127.0.0.1:1089"
}

# 取消代理
unproxy () {
  unset ALL_PROXY
  unset all_proxy
}
```

### 4.3 卸载 Oh My Zsh

如果你想卸载 Oh My Zsh，使用以下命令：

```bash
uninstall_oh_my_zsh
```

### 4.4 手动更新 Oh My Zsh

如需手动更新，在已加载 Oh My Zsh 的 Zsh 终端中使用[官方当前文档中的命令](https://github.com/ohmyzsh/ohmyzsh#manual-updates)：

```bash
omz update
```
