---
url: /en/article/106izvxs/index.md
description: >-
  Install Zsh and Oh My Zsh on Debian or Ubuntu, migrate shell settings, add
  Powerlevel10k and useful plugins, and manage updates safely.
---
Zsh offers interactive completion, globbing, prompt customization, and many other shell features. Oh My Zsh is an optional community framework that organizes Zsh configuration, themes, and plugins.

This guide uses Debian or Ubuntu. Commands and package names differ on other distributions.

## 1. Install Zsh and Basic Tools

Update the package index and install Zsh, Git, and curl:

```bash
sudo apt update
sudo apt install zsh git curl
```

Upgrading every package is deliberately separate from installation. Review a production server's pending upgrades before running `sudo apt upgrade`.

Confirm the Zsh path:

```bash
command -v zsh
zsh --version
```

Set it as the current user's login shell. Do not use `sudo` here:

```bash
chsh -s "$(command -v zsh)"
```

Log out and back in for the login-shell change to take effect. You can also run `zsh` to test it immediately.

## 2. Install Oh My Zsh

The [official Oh My Zsh repository](https://github.com/ohmyzsh/ohmyzsh) publishes this installer:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Running a remote script gives that script your user permissions. For a higher-assurance environment, download it, inspect it, and then execute the reviewed local copy:

```bash
curl -fsSLo /tmp/ohmyzsh-install.sh \
  https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh
less /tmp/ohmyzsh-install.sh
sh /tmp/ohmyzsh-install.sh
```

The installer may offer to create or replace `~/.zshrc`. Back up an existing file first:

```bash
cp -a ~/.zshrc ~/.zshrc.backup 2>/dev/null || true
```

Avoid unofficial installer mirrors unless you have verified their ownership and contents against the upstream repository.

## 3. Migrate Settings from Bash

Do not blindly source all of `~/.bashrc` from Zsh: Bash-specific syntax may fail or behave differently. Instead, review the file and copy only portable aliases and environment variables:

```bash
less ~/.bashrc
${EDITOR:-nano} ~/.zshrc
```

Reload the configuration:

```bash
source ~/.zshrc
```

For variables required by graphical applications or every login shell, a shell-specific interactive file may be the wrong location. Follow your distribution's guidance for `~/.profile`, environment files, or the service that launches the application.

Root has a separate home directory and configuration. In most cases, keep root's shell minimal and use a normal account plus `sudo` instead of installing a large plugin stack for root.

## 4. Choose a Theme

Oh My Zsh themes are selected in `~/.zshrc`:

```zsh
ZSH_THEME="robbyrussell"
```

List bundled themes:

```bash
find ~/.oh-my-zsh/themes -maxdepth 1 -name '*.zsh-theme' -printf '%f\n' | sort
```

### Powerlevel10k

Powerlevel10k is a highly configurable third-party Zsh theme. Follow its [official installation instructions](https://github.com/romkatv/powerlevel10k):

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

Then set:

```zsh
ZSH_THEME="powerlevel10k/powerlevel10k"
```

Restart Zsh or run:

```bash
exec zsh
```

The setup wizard normally starts on first use. Run it again with:

```bash
p10k configure
```

Some prompt styles require a compatible Nerd Font configured in the terminal application. The theme repository documents its recommended fonts and checks.

## 5. Install Useful Plugins

Oh My Zsh already includes plugins such as `git`, `z`, `extract`, and `web-search`. Third-party plugins belong under the custom plugin directory.

### zsh-autosuggestions

```bash
git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
```

It suggests commands from history as you type. The configured key binding or right-arrow key can accept a suggestion.

### zsh-syntax-highlighting

```bash
git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
```

It highlights command syntax interactively. Its project recommends loading it near the end so that it can wrap ZLE widgets created by other plugins.

### Bundled plugins

* `z` jumps among frequently used directories.

* `extract` supplies the `x` helper for supported archive formats:

  ```bash
  x archive.tar.gz
  ```

* `web-search` opens searches from the command line. Remember that query text is sent to the selected search provider.

Enable plugins in one `plugins` declaration in `~/.zshrc`:

```zsh
plugins=(
  git
  z
  extract
  web-search
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

Then start a fresh shell:

```bash
exec zsh
```

Each plugin increases startup work and may introduce aliases. Enable only what you use, and consult the plugin's README before relying on an alias in scripts.

## 6. Optional Proxy Helpers

For a local SOCKS proxy listening on port `1089`, functions in `~/.zshrc` can set and clear the conventional environment variables:

```zsh
proxy() {
  export ALL_PROXY='socks5h://127.0.0.1:1089'
  export all_proxy="$ALL_PROXY"
  export HTTPS_PROXY='http://127.0.0.1:1089'
  export HTTP_PROXY="$HTTPS_PROXY"
}

unproxy() {
  unset ALL_PROXY all_proxy HTTPS_PROXY HTTP_PROXY
}
```

This example assumes the same local port accepts both SOCKS and HTTP proxy protocols, which is not always true. Match the scheme and port to your client. `socks5h` asks compatible applications to resolve hostnames through the proxy; application support varies.

Do not place proxy usernames, passwords, or tokens directly in a world-readable shell configuration.

## 7. Update, Troubleshoot, or Remove Oh My Zsh

Update manually with the current command:

```bash
omz update
```

The older `upgrade_oh_my_zsh` helper has been superseded by `omz update`.

Measure startup time if the shell becomes slow:

```bash
time zsh -i -c exit
```

Disable recently added plugins one at a time and restart Zsh to isolate the cause.

Uninstall Oh My Zsh with:

```bash
uninstall_oh_my_zsh
```

Review any restored or retained dotfiles afterward. To change the login shell back to Bash:

```bash
chsh -s "$(command -v bash)"
```
