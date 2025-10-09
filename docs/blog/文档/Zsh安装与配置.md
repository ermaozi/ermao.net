---
title: Zsh 安装与配置 - 使用 Oh My Zsh 美化终端
createTime: 2025/01/27 11:07:08
permalink: /article/106izvxs/
tags: 
  - Zsh
  - Oh My Zsh
  - 终端
  - Linux
  - Debian
  - Shell
  - 命令行
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

设置 Zsh 为默认终端（记得不要加 `sudo`）：

```bash
chsh -s /bin/zsh
```

### 1.2 安装 Oh My Zsh

访问官网：[http://ohmyz.sh/](http://ohmyz.sh/) 或选择下面任一命令来安装：

```bash
# 使用 curl 安装
curl -fsSL https://install.ohmyz.sh | sh

# 使用 wget 安装
wget -O- https://install.ohmyz.sh | sh

# 使用国内镜像（curl）
curl -fsSL https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh | sh

# 使用国内镜像（wget）
wget -O- https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh | sh
```

在安装过程中，系统会提示是否用 Oh My Zsh 的默认配置文件覆盖现有的 `.zshrc`，请选择同意。

### 1.3 从 `.bashrc` 迁移配置（可选）

如果你曾在 Bash 中自定义了一些环境变量或别名，在切换到 Zsh 后，需要手动迁移这些配置。操作步骤如下：

```bash
# 查看原 Bash 配置文件
cat ~/.bashrc

# 编辑 Zsh 配置文件并粘贴自定义配置
nano ~/.zshrc

# 使配置生效
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

启用插件，只需修改 `.zshrc` 中的插件列表：

```bash
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
```

保存并使配置生效：

```bash
source ~/.zshrc
```

## 4. 小贴士

### 4.1 Root 用户配置

如果你想让 root 用户也使用 Zsh，建议在 root 的环境中安装 Oh My Zsh，并设置不同的主题以便区分：

```bash
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
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

如果自动更新提示被误触关闭，可以通过以下命令手动更新：

```bash
upgrade_oh_my_zsh
```
