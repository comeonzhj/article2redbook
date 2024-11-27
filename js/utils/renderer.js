async function renderPreview(data) {
    // 清空现有的轮播图
    const carouselSlides = document.getElementById('carouselSlides');
    carouselSlides.innerHTML = '';

    // 创建并渲染封面画布
    const coverCanvas = await createCanvas(data.cards.CoverCard.title);
    carouselSlides.appendChild(wrapCanvas(coverCanvas, 'cover-card'));

    // 渲染详情画布
    for (const detailCard of data.cards.detailCards) {
        const canvas = await createDetailCanvas(detailCard);
        carouselSlides.appendChild(wrapCanvas(canvas, 'detail-card'));
    }

    // 更新轮播计数器
    updateCarouselCounter(0, carouselSlides.children.length);

    // 显示第一张
    showSlide(0);
}

function wrapCanvas(canvas, type) {
    const wrapper = document.createElement('div');
    wrapper.className = `carousel-slide ${type}`;
    wrapper.appendChild(canvas);
    return wrapper;
}

function renderNotes(notes) {
    // 渲染标题
    document.querySelector('.note-title').textContent = notes.title;

    // 渲染正文
    document.querySelector('.note-content').textContent = notes.content;

    // 渲染标签
    document.querySelector('.note-tags').textContent = notes.tags;

    // 渲染评论
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    
    notes.comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment-item';
        commentEl.innerHTML = `
            <div class="comment-fan copyable">${comment.fans}</div>
            <div class="comment-text copyable">${comment.comment}</div>
        `;
        commentsList.appendChild(commentEl);
    });

    // 重新初始化复制功能
    initializeCopyFeature();
}

function measureText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    return lines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const lines = measureText(ctx, text, maxWidth);
    let currentY = y;
    
    lines.forEach(line => {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
    });

    return currentY; // 返回文本结束的y坐标
}