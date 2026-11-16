# 映间 MARGIN · 油猴版

给 B 站换一个更清晰的界面：编辑式排版、液态玻璃控件、动态背景、足迹热力图，保留原生播放器 / 弹幕 / 评论。

由 [jiuyang5354/bilibili-margin](https://github.com/jiuyang5354/bilibili-margin)（MV3 扩展）打包成的用户脚本（Tampermonkey / Violentmonkey）。

![version](https://img.shields.io/badge/version-0.60.63-2f6f5e)

## 一键安装

1. 先装脚本管理器：[Tampermonkey](https://www.tampermonkey.net/)（Chrome / Edge / Firefox / Safari）或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 点下面的链接，管理器会弹出安装页，点「安装」：

   **👉 [安装 margin.user.js](https://raw.githubusercontent.com/Sam5440/bilibili-margin-userscript/main/margin.user.js)**

   jsDelivr 备用地址（国内更快）：

   ```
   https://cdn.jsdelivr.net/gh/Sam5440/bilibili-margin-userscript@main/margin.user.js
   ```

3. 打开 [www.bilibili.com](https://www.bilibili.com/)，首次运行会弹一次跨域授权（`GM_xmlhttpRequest`），点「总是允许」。
4. 右上角出现 MARGIN 顶栏即生效。

> 首次打开会取回业务代码（约 900 KB）和 8 个样式文件，之后写进 GM 存储缓存，再打开就是 0 请求。
> 升级脚本时版本号变化，缓存自动失效并重新取回。

## 菜单与开关

脚本管理器的图标菜单里有三项：

| 菜单 | 作用 |
| --- | --- |
| 暂停 / 启用 MARGIN | 全局开关，写在 GM 存储里，所有页面生效 |
| 打开设置面板 | 打开 MARGIN 设置（主题、背景、过滤、隐私开关等） |
| 本页切回原版 | 只对当前页面关闭皮肤；也可在网址后加 `?margin=off` |

## 权限说明

脚本会请求以下域名的跨域访问：

| 域名 | 用途 |
| --- | --- |
| `cdn.jsdelivr.net` / `gcore.jsdelivr.net` / `raw.githubusercontent.com` | 取回业务代码、样式、字体、图片 |
| `api.github.com` | 检查版本更新（可关） |
| `bsbsb.top` | 空降助手（跳过赞助片段，可关） |
| `ipwho.is` / `api.open-meteo.com` / `geocoding-api.open-meteo.com` / `www.nmc.cn` | 天气与定位（可关） |
| `app.bilibili.com` | B 站 App 推荐（可关） |

设置里的「外部服务」隐私开关可以整体关掉上面除 CDN 以外的请求。

## 仓库结构

```
.
├── margin.user.js          主脚本（约 4 KB）：取回业务代码并执行
├── public/
│   ├── js/margin-app.js    业务代码（界面逻辑、接口解析、流体背景）
│   ├── css/                界面样式 8 个文件
│   ├── fonts/              6 个西文字体 + margin-sc.css + sc/ 68 个中文分片
│   ├── img/                液态玻璃位移图
│   ├── data/               天气城市表（3577 条）
│   └── icons/              脚本图标
├── 说明.md                  移植与部署说明
└── LICENSE                 MIT
```

`margin.user.js` 只是引导层：从 jsDelivr 取回 `public/js/margin-app.js` 并执行，其余资源按 `public/` 下的相对路径拼接。

## 换到自己的仓库

1. Fork 或克隆本仓库。
2. 改 `public/js/margin-app.js` 第 11 行：

   ```js
   const MARGIN_ASSET_BASE = "https://cdn.jsdelivr.net/gh/<用户名>/<仓库>@main/public/";
   ```

3. 改 `margin.user.js` 里 `MARGIN_APP_URL` 常量，以及头部 `@namespace` / `@icon` / `@homepageURL` / `@supportURL` / `@updateURL` / `@downloadURL`。
4. 推送后在 `public/js/margin-app.js` 里改版本号，并同步 `margin.user.js` 的 `@version` 与 `MG_APP_CACHE` 键，缓存才会失效。

## 说明

- 设置与足迹存在 GM 存储，和扩展版数据不互通。
- 脚本资源全部走 CDN，仓库只存静态文件，不需要构建。
- 样式一个都取不到时**不挂皮肤**，保留 B 站原版界面并在控制台提示，不会出现半裸界面。

## 致谢与许可

原扩展作者：[jiuyang5354](https://github.com/jiuyang5354)，仓库 [bilibili-margin](https://github.com/jiuyang5354/bilibili-margin)。
本项目是油猴移植 / 自用分发版，遵循上游 MIT 协议，见 [LICENSE](./LICENSE)。
