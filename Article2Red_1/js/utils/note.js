// 渲染笔记内容
function renderNotes(notes) {
    if (!notes) return;

    // 渲染标题
    const titleElement = document.querySelector('.note-title');
    titleElement.textContent = notes.title;
    makeElementCopyable(titleElement);

    // 渲染正文
    const contentElement = document.querySelector('.note-content');
    contentElement.textContent = notes.content;
    makeElementCopyable(contentElement);

    // 渲染标签
    const tagsElement = document.querySelector('.note-tags');
    tagsElement.textContent = notes.tags;
    makeElementCopyable(tagsElement);

    // 渲染评论
    renderComments(notes.comments);
}

// 渲染评论区域
function renderComments(comments) {
    const commentsContainer = document.getElementById('commentsList');
    commentsContainer.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors';

        // 创建粉丝名称元素
        const fanElement = document.createElement('div');
        fanElement.className = 'comment-fan copyable text-gray-700 font-medium mb-2';
        fanElement.textContent = comment.fans;
        makeElementCopyable(fanElement);

        // 创建评论内容元素
        const commentTextElement = document.createElement('div');
        commentTextElement.className = 'comment-text copyable text-gray-600 text-sm leading-relaxed';
        commentTextElement.textContent = comment.comment;
        makeElementCopyable(commentTextElement);

        // 组装评论元素
        commentElement.appendChild(fanElement);
        commentElement.appendChild(commentTextElement);
        commentsContainer.appendChild(commentElement);
    });
}

// 使元素可复制
function makeElementCopyable(element) {
    element.addEventListener('click', async function() {
        try {
            const text = this.textContent;
            await navigator.clipboard.writeText(text);
            
            // 添加视觉反馈
            const originalBg = this.style.backgroundColor;
            this.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
            
            // 显示复制成功提示
            showCopyTooltip(this);

            // 恢复原始背景色
            setTimeout(() => {
                this.style.backgroundColor = originalBg;
            }, 200);
        } catch (err) {
            console.error('复制失败:', err);
            showCopyTooltip(this, true);
        }
    });
}

// 显示复制提示
function showCopyTooltip(element, isError = false) {
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed bg-black/70 text-white px-3 py-1.5 rounded text-xs pointer-events-none z-50';
    tooltip.textContent = isError ? '复制失败' : '已复制';

    // 计算提示框位置
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.transform = 'translateX(-50%)';

    document.body.appendChild(tooltip);

    // 自动移除提示
    setTimeout(() => {
        tooltip.remove();
    }, 1500);
}

// 导出函数供其他模块使用
window.renderNotes = renderNotes;