---
title: Read Plain-Text Books in Vim with a Quick-Exit Key
tags:
  - Vim
  - Plain text
  - PowerShell
createTime: '2022/07/16 16:00:02'
permalink: /en/article/yifph1jd/
description: A lighthearted Windows guide to reading authorized plain-text books in Vim, restoring the last position, and adding a small PowerShell launcher.
lang: en-US
translationOf: /article/yifph1jd/
---

This lighthearted guide shows how to read a plain-text book in Vim, move through it with a single key, save the last position, and exit quickly.

<!-- more -->

::: warning Use responsibly
Follow workplace policy and do not let personal reading interfere with your duties. Use only text you are legally permitted to download and read. The author cannot protect you from an unhappy manager.
:::

## 1. Install Vim on Windows

Download Vim from the [official Windows download page](https://www.vim.org/download.php#pc). Installer names and version numbers change, so choose the current signed Windows installer rather than looking for an exact `gvimXX.exe` filename from an old screenshot.

![Vim Windows download page](https://image.ermao.net/images/article/yifph1jd/image.png)

If Windows shows a reputation warning, verify the download source and publisher before proceeding. Do not bypass a warning merely because a tutorial says the file is safe.

![Windows download warning](https://image.ermao.net/images/article/yifph1jd/image-1.png)

![Vim installer](https://image.ermao.net/images/article/yifph1jd/image-2.png)

The installer can add Vim to `PATH`. If it does not, locate the directory containing `vim.exe`:

![Opening the Vim installation directory](https://image.ermao.net/images/article/yifph1jd/image-3.png)

![Copying the Vim directory path](https://image.ermao.net/images/article/yifph1jd/image-4.png)

Search Windows for “environment variables,” edit the user `Path`, and add that directory:

![Opening Windows environment variables](https://image.ermao.net/images/article/yifph1jd/image-5.png)

![Adding Vim to Path](https://image.ermao.net/images/article/yifph1jd/image-6.png)

Open a new PowerShell window and verify the command. The option uses two ASCII hyphens:

```powershell
vim --version
```

![Checking the Vim version](https://image.ermao.net/images/article/yifph1jd/image-7.png)

## 2. Configure Vim

Open the configuration file:

```powershell
vim $HOME\_vimrc
```

On recent Vim builds, `~/.vimrc` may also work on Windows, but `_vimrc` in the user profile remains a conventional Windows location. Inside Vim, press `i` to enter Insert mode and add:

```vim
" Move down two display lines with Space in Normal mode.
nnoremap <Space> 2gj

" Save and exit with F2.
nnoremap <F2> <Esc>:wq<CR>

" Restore the cursor to its last known position when possible.
augroup restore_cursor
  autocmd!
  autocmd BufReadPost *
        \ if line("'\"") > 1 && line("'\"") <= line("$") |
        \   execute "normal! g`\"" |
        \ endif
augroup END

set encoding=utf-8
set fileencodings=utf-8,gb18030,gbk,latin1
set wrap
set linebreak
set number
syntax on
colorscheme pablo
```

The source article used `:wp!`, which is not the save-and-quit command. Use `:wq` or press the mapped `F2`.

Press `Esc`, type:

```vim
:wq
```

and press Enter.

![Saving the Vim configuration](https://image.ermao.net/images/article/yifph1jd/image-8.png)

## 3. Open a Book

From a terminal embedded in VS Code, PyCharm, or another development tool:

```powershell
vim "C:\Users\YourName\Documents\Books\book.txt"
```

![Opening a text file from an editor terminal](https://image.ermao.net/images/article/yifph1jd/image-9.png)

![Reading plain text in Vim](https://image.ermao.net/images/article/yifph1jd/image-10.png)

In Normal mode:

- press `Space` to move down two wrapped display lines;
- press `F2` to save and exit; and
- reopen the file to return to the last stored cursor position.

If Vim does not remember the position, confirm that the `viminfo` file can be written and that no privacy setting disables marks.

## 4. Add a PowerShell Launcher

Create the PowerShell profile if necessary:

```powershell
New-Item -ItemType File -Force -Path $PROFILE
```

![Creating a PowerShell profile](https://image.ermao.net/images/article/yifph1jd/image-11.png)

Open it:

```powershell
vim $PROFILE
```

Add this safer, simplified launcher and change `$BookDirectory`:

```powershell
$BookDirectory = Join-Path $HOME 'Documents\Books'
$BookStateFile = Join-Path $BookDirectory '.current-book'

function Read-Book {
    param(
        [string]$Name,
        [switch]$List,
        [switch]$OpenFolder
    )

    New-Item -ItemType Directory -Force -Path $BookDirectory | Out-Null

    if ($OpenFolder) {
        Invoke-Item $BookDirectory
        return
    }

    $books = Get-ChildItem -LiteralPath $BookDirectory -Filter '*.txt' -File

    if ($List) {
        $current = if (Test-Path -LiteralPath $BookStateFile) {
            Get-Content -LiteralPath $BookStateFile -Raw
        } else {
            ''
        }
        foreach ($book in $books) {
            $prefix = if ($book.BaseName -eq $current.Trim()) { '* ' } else { '  ' }
            "$prefix$($book.BaseName)"
        }
        return
    }

    if ($Name) {
        $selected = $books | Where-Object BaseName -eq $Name | Select-Object -First 1
        if (-not $selected) {
            throw "No book named '$Name'. Run Read-Book -List."
        }
        Set-Content -LiteralPath $BookStateFile -Value $selected.BaseName -Encoding utf8
    }

    if (-not (Test-Path -LiteralPath $BookStateFile)) {
        throw 'No default book selected. Run Read-Book -List, then Read-Book -Name <name>.'
    }

    $currentName = (Get-Content -LiteralPath $BookStateFile -Raw).Trim()
    $path = Join-Path $BookDirectory "$currentName.txt"
    if (-not (Test-Path -LiteralPath $path)) {
        throw "The selected file no longer exists: $path"
    }

    vim -- $path
}

Set-Alias rn Read-Book
```

This version supports Unicode paths and uses literal-path operations to avoid wildcard surprises.

Restart PowerShell, then:

```powershell
# Open the folder.
rn -OpenFolder

# List available .txt files.
rn -List

# Select a default book by file name without .txt.
rn -Name "Example Book"

# Open the selected book.
rn
```

![Opening the books directory](https://image.ermao.net/images/article/yifph1jd/image-12.png)

![Listing text files](https://image.ermao.net/images/article/yifph1jd/image-13.png)

![Selecting the default book](https://image.ermao.net/images/article/yifph1jd/image-14.png)

PowerShell's execution policy may prevent a profile from loading on a managed computer. Do not weaken an organization-wide policy; ask the administrator or run the commands manually.
