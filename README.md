# article2redbook
使用 AI 总结文章，转成小红书图文的工具，可在线预览效果

**感谢 Windsurf，整个项目我一个字符都没碰，全程嘴炮**

老版本 —> [article2card](https://github.com/comeonzhj/article2card)

## 项目介绍

- 输入文章链接，推送到kimi进行总结，输出结构化内容（提示词在`js/main.js:16`）
  - 用来组装卡片的结构化知识点，参见`data.cards`
  - 用来组装笔记标题、正文、标签和水军评论的笔记内容，参见`data.notes`
- 使用 `html2canvas`渲染文章知识点为卡片
- 点击笔记区的标题、正文、标签和水军评论可以直接复制
- 点击下载图片可以下载全部图片

## 如何使用
1. 下载代码，解压
2. 本地运行：因为涉及到跨域问题，先运行后端服务server.js，默认是 localhost:3000
3. 云端部署：删掉server.js，放在云端服务器就好了

## 项目依赖
- [html2canvas](https://github.com/niklasvh/html2canvas)
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)
- [jszip](https://stuk.github.io/jszip)
