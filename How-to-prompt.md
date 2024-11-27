以下为让 Claude & Windsurf 生成代码的提示词：
```
接下来作为一个全栈工程师，协助我开发一个网页工具吧！我来描述创意和功能实现逻辑，你帮我使用基础的前端语言撰写完整的代码！

简单来说，这是一个从结构化的 JSON 数据中提取信息，渲染成预览网页，把制定内容保存为图片下载的工具。

详细的功能和逻辑如下：

## 页面布局

- 页面整体布局如附件图片所示，分为左右两个区域
- 左侧为编辑区，包含两个部分：
	- 先是一个文本框，供用户输入链接，紧跟一个重构按钮，关于此按钮的交互逻辑会在下方详细解释。
	- 下方是文本输出区，用户会把从其他页面获取的 JSON 格式粘贴在这里。输入区下方为两个按钮：预览按钮和下载按钮。
- 右侧为根据用户数据的 JSON 格式预览后渲染的预览页面，它由两部分组成
	- 左侧为“图片”预览，由从 JSON 格式中提取的内容按照指定的布局渲染，可能有多张“图片”，这里使用主动点击切换的轮播样式
	- 右侧为内容预览，由从 JSON 格式中提取的标题、正文、标签和用户评论组成，具体要求见附件图片中的描述

## 按钮交互逻辑

- 用户在左侧编辑区上方的输入框输入链接，点击重构按钮后交互如下：
	- 将用户输入的内容与“阅读上面的链接，分析”拼接，赋值给%s；
	- 用户点击按钮后在新窗口访问`https://kimi.moonshot.cn/_prefill_chat?prefill_prompt=%s&send_immediately=true&force_search=true`链接
- 用户把kimi生成的内容复制到文本输入框中，相关按钮的交互如下：
	- 点击预览按钮后从输入内容中提取信息渲染成为右侧网页，用户输入的内容为严格的 JSON 格式文本，具体结构在下方<用户输入的JSON格式文本>给出
	- 点击下载按钮后，把右侧渲染网页中<轮播图片>使用html2canvas渲染为多张图片，打包后下载。

## 预览页面渲染逻辑

- 渲染包括两部分，左侧渲染预览无问题后，需要使用html2canvas导出为图片，右侧读取 JSON 内容显示在网页
- 左侧“图片”部分的渲染逻辑
	- 读取用户输入 JSON 格式文本中的`cards`的键值，把他们写入一个 1200*1600px 的画布上， 渲染预览时，画布尺寸缩小为 300*400px。画布有两类：
		- 封面画布：内容来自`cards.CoverCard.title`的值，字号为 90px，加粗，在画布(190,540)位置，左对齐，文字宽度最大810px，超出自动换行；
		- 详情画布：内容来自`cards.detailCards`,读取数组的数量，把其中`title`、`knowledgePoints.pointX`和`knowledgePoints.pointX_desc` 的值渲染到画不上，具体样式如下：
			- `cards.detailCards.title`在画布的(140,280)位置，字号为60px，文字宽度最大930，超出自动换行；
			- `cards.detailCards.knowledgePoints.pointX`在横向 215px 处，纵向在`cards.detailCards.title`文字下边界30px，字号 45px，加粗，文字宽度最大840px，超出自动换行；
			- `cards.detailCards.knowledgePoints.pointX_desc`在`cards.detailCards.knowledgePoints.pointX`下方 30px 处，横向位置相同
	- “图片”预览区上方中间显示当前为第x/n张图片，用户可以点击切换图片。
- 右侧笔记区域渲染逻辑
	- 读取用户输入 JSON 格式文本中的`notes`的键值，渲染在“图片”区域的右侧，具体要求见附件图片中的描述
	- 笔记区域渲染的所有文本，均可以点击文本复制到剪切板。

## 用户输入的JSON格式文本
```
{
    "cards":{
        "CoverCard": {
            "title": "渲染到轮播图片的第一张"
        },
        "detailCards": [{
            "title": "读取数组元素数，渲染到轮播图片的第2-X张，作为标题部分",
            "knowledgePoints": {
                "point1": "作为知识点，一共有3个，这是第1个",
                "point1_desc": "作为知识点的展开介绍，一共有3个，这是第1个",
                "point2": "作为知识点，一共有3个，这是第2个",
                "point2_desc": "作为知识点的展开介绍，一共有3个，这是第2个",
                "point3": "作为知识点，一共有3个，这是第3个",
                "point3_desc": "作为知识点的展开介绍，一共有3个，这是第1个"
            }
        }, {
            "title": "读取数组元素数，渲染到轮播图片的第3-X张，作为标题部分",
            "knowledgePoints": {
                "point1": "作为知识点，一共有3个，这是第1个",
                "point1_desc": "作为知识点的展开介绍，一共有3个，这是第1个",
                "point2": "作为知识点，一共有3个，这是第2个",
                "point2_desc": "作为知识点的展开介绍，一共有3个，这是第2个",
                "point3": "作为知识点，一共有3个，这是第3个",
                "point3_desc": "作为知识点的展开介绍，一共有3个，这是第1个"
            }
        }]
    },
    "notes":{
        "title":"笔记的标题",
        "content":"笔记的正文",
        "tags":"笔记的标签",
        "comments":[
            {
                "fans":"粉丝 1，可能有多个，需要读取元素数，循环渲染",
                "comment":"粉丝的评论"
            }
        ]
    }
}
```

## 代码要求
- 先给出代码的目录结构，再逐个生成代码
- 尽可能分模块撰写代码，确保方便修改迭代
- 使用基础的 HTML、css 和 JavaScript 来撰写，避免使用框架
```