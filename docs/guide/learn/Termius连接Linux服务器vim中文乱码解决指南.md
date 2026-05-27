---
title: Termius 连接 Linux 服务器 vim 中文乱码解决指南
categories: learn

---







# Termius 连接 Linux 服务器 vim 中文乱码解决指南

> 适用场景：通过 Termius（或其他 SSH 工具）连接 Linux 服务器后，使用 vim 打开文件出现中文乱码。

---

## 一、问题排查思路

中文乱码本质是**编码不一致**导致的，按以下三层逐一排查：

| 层级 | 检查项 | 常见问题 |
|------|--------|----------|
| 1. 客户端 | Termius 终端编码 | 不是 UTF-8 |
| 2. 服务器 | 系统 locale | 不是 UTF-8 |
| 3. 文件本身 | 文件编码 | 是 GBK/GB2312 但 vim 按 UTF-8 读取 |

---

## 二、第一步：检查 Termius 客户端编码

### 设置位置

- **桌面版**：编辑 Host → `Terminal` 标签 → `Encoding` 设为 `UTF-8`
- **移动版**：Host 设置 → `Advanced` → `Charset` 选 `UTF-8`

### 字体推荐

选择支持中文的等宽字体：

- `Menlo`（macOS 自带）
- `JetBrains Mono`
- `Sarasa Mono SC`（更纱黑体，中英文宽度对齐）

---

## 三、第二步：检查服务器 locale

### 查看当前 locale

```bash
echo $LANG
locale
```

**正常输出示例**（已是 UTF-8）：

```
LANG=zh_CN.UTF-8
LC_CTYPE="zh_CN.UTF-8"
...
```

### 如果不是 UTF-8

**Debian / Ubuntu：**

```bash
sudo locale-gen zh_CN.UTF-8 en_US.UTF-8
sudo update-locale LANG=en_US.UTF-8
```

**CentOS / RHEL：**

```bash
sudo dnf install glibc-langpack-zh
```

然后在 `~/.bashrc` 末尾追加：

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

执行 `source ~/.bashrc` 生效。

> 推荐用 `en_US.UTF-8` 比 `zh_CN.UTF-8` 兼容性更好，中文文件照样正常显示。

---

## 四、第三步：判断文件本身的编码

### 用 file 命令查看

```bash
file 文件名
```

| 输出 | 含义 |
|------|------|
| `UTF-8 Unicode text` | UTF-8 编码，正常 |
| `ISO-8859 text` | **大概率是 GBK 误判**（国内服务器常见） |
| `ASCII text` | 纯英文 ASCII，正常 |

### 验证是否为 GBK

```bash
vim -c "e ++enc=gbk" 文件名
```

如果中文正常显示，说明文件就是 GBK 编码。

---

## 五、解决方案

### 方案 A：配置 vim 自动识别多种编码（推荐）

新建配置文件：

```bash
vim ~/.vimrc
```

写入：

```vim
set encoding=utf-8
set termencoding=utf-8
set fileencodings=ucs-bom,utf-8,gbk,gb18030,big5,latin1
syntax on
```

保存后，vim 会按 `fileencodings` 列表的顺序自动尝试解码，GBK 文件也能正常打开。

### 方案 B：把文件转成 UTF-8（一劳永逸）

**用 iconv 转换：**

```bash
# 备份
cp 文件名 文件名.bak

# 转码
iconv -f GBK -t UTF-8 文件名.bak -o 文件名

# 验证
file 文件名
```

**用 vim 一键转换：**

```bash
vim -c "e ++enc=gbk" -c "set fenc=utf-8" -c "w" 文件名
```

> 注意：如果文件是 docker 容器挂载的，转码后需重启容器：`docker restart 容器名`

---

## 六、附录：vim 常用编码命令

### vim -c 参数说明

`vim -c "命令"` = 打开文件后自动执行一条 vim 命令。

### 实用命令

```bash
# 用 GBK 编码打开文件
vim -c "e ++enc=gbk" 文件名

# 跳到第 100 行
vim -c "100" 文件名

# 打开后立即搜索关键字
vim -c "/error" 文件名

# 把 GBK 文件转成 UTF-8 保存
vim -c "e ++enc=gbk" -c "set fenc=utf-8" -c "w" 文件名
```

### 简写形式

`vim +命令` 等价于 `vim -c "命令"`：

```bash
vim +100 file.txt        # 跳到第 100 行
vim +/error log.txt      # 搜索 error
```

---

## 七、.vimrc 与 .viminfo 区别

| 文件 | 作用 | 创建方式 |
|------|------|----------|
| `~/.vimrc` | vim 配置文件 | **用户手动创建** |
| `~/.viminfo` | vim 历史记录（搜索、命令、光标位置等） | vim 运行时自动生成 |

新系统默认没有 `.vimrc`，需要自己创建。

---

## 八、快速排查 checklist

遇到 vim 中文乱码，按顺序确认：

- [ ] Termius 编码设置为 UTF-8
- [ ] 服务器 `echo $LANG` 输出 `*.UTF-8`
- [ ] `file 文件名` 查看文件编码
- [ ] 配置 `~/.vimrc` 启用 `fileencodings` 多编码识别
- [ ] 必要时用 `iconv` 把文件统一转成 UTF-8

---

**核心原则**：客户端、服务器、文件三方编码统一为 UTF-8，是最稳妥的长期方案。
