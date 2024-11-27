document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const linkInput = document.getElementById('linkInput');
    const reconstructBtn = document.getElementById('reconstructBtn');
    const jsonInput = document.getElementById('jsonInput');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // 绑定事件
    reconstructBtn.addEventListener('click', () => {
        const link = linkInput.value.trim();
        if (!link) {
            alert('请输入链接');
            return;
        }
        const prompt = encodeURIComponent(`${link}  仔细阅读这个链接中的内容。接下来，扮演一名知识整理专家，把我提供的知识文章整理成知识或笔记卡片。\n## 背景信息\n把长文本内容整理成卡片后，会被分发到图文类社交媒体。文章整理成结构化后，同步生成用于社交媒体分发的标题、正文和预设评论内容。\n## 整理要求\n- 使用金字塔原理对知识文章进行提炼概括，如果原文不是金字塔结构则进行重构\n- 确保文章中的关键信息都被整理到知识卡片中\n- 确保每张卡片中各段信息之间、卡片知识与卡片知识之间具备连贯性\n- 输出纯文本格式内容\n## 输出要求\n以 JSON 格式输出，参考如下结构\n{"cards": {"CoverCard": {"title": "整组卡片的标题，优先使用疑问句，简洁具有吸引力"},"detailCards": [{"title": "第一张卡片的标题","knowledgePoints": {"point1": "第一个知识点的小标题，20字以内","point1_desc": "第一个知识点的展开介绍，100字左右","point2": "","point2_desc": "","point3": "","point3_desc": ""}}]},"notes": {"title": "使用整组卡片的标题","content": "社交媒体贴子的正文，条理化呈现价值","tags": "生成SEO友好的标签，Tag前使用#","comments": [{"fans": "用户1","comment": "模拟真实用户撰写3条可以引导其他用户评论的内容"}, {"fans": "用户2","comment": ""}, {"fans": "用户3","comment": ""}]}}`);
        const kimiUrl = `https://kimi.moonshot.cn/_prefill_chat?prefill_prompt=${prompt}&send_immediately=true&force_search=true`;
        window.open(kimiUrl, '_blank');
    });

    previewBtn.addEventListener('click', async () => {
        try {
            const jsonText = jsonInput.value.trim();
            if (!jsonText) {
                alert('请粘贴JSON格式文本');
                return;
            }
            
            // 解析JSON
            const data = parseJson(jsonText);
            if (!data) return;

            // 渲染预览
            await renderPreview(data);
            // 渲染笔记部分
            renderNotes(data.notes);
        } catch (error) {
            console.error('预览失败:', error);
            alert('预览失败，请检查JSON格式是否正确');
        }
    });

    downloadBtn.addEventListener('click', async () => {
        try {
            await downloadImages();
        } catch (error) {
            console.error('下载失败:', error);
            alert('下载失败，请稍后重试');
        }
    });

    // 初始化复制功能
    initializeCopyFeature();
});

// 初始化复制功能
function initializeCopyFeature() {
    document.querySelectorAll('.copyable').forEach(element => {
        element.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(this.textContent);
                const originalBg = this.style.backgroundColor;
                this.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
                setTimeout(() => {
                    this.style.backgroundColor = originalBg;
                }, 200);
            } catch (err) {
                console.error('复制失败:', err);
            }
        });
    });
}