function createCanvas(title) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    
    // 清除背景
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景图片
    const img = new Image();
    img.src = './img/cover-card.png';

    // 等待图片加载完成后再绘制
    return new Promise((resolve) => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 绘制标题
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 120px sans-serif';
            drawWrappedText(ctx, title, 190, 540, 810, 180);  // 2倍行距
            
            resolve(canvas);
        };
        img.onerror = () => {
            console.warn('背景图加载失败');
            // 绘制标题
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 120px sans-serif';
            drawWrappedText(ctx, title, 190, 540, 810, 180);  // 2倍行距
            
            resolve(canvas);
        };
    });
}

function createDetailCanvas(detailCard) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    
    // 清除背景
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景图片
    const img = new Image();
    img.src = './img/detail-card.png';

    // 等待图片加载完成后再绘制
    return new Promise((resolve) => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 绘制标题
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 80px sans-serif';
            let currentY = 280;
            
            // 测量文本高度
            const titleMetrics = ctx.measureText(detailCard.title);
            const titleHeight = titleMetrics.actualBoundingBoxAscent + titleMetrics.actualBoundingBoxDescent;
            
            currentY = drawWrappedText(ctx, detailCard.title, 140, currentY, 930, 90);
            
            // 添加标题下方的边框线
            ctx.beginPath();
            ctx.strokeStyle = '#7f7f7f';
            ctx.lineWidth = 1;
            ctx.moveTo(140, currentY - 50);
            ctx.lineTo(1070, currentY - 50);
            ctx.stroke();
            
            currentY += 70;  // 增加标题和内容之间的间距

            // 获取并绘制知识点
            const points = getKnowledgePoints(detailCard);
            points.forEach(item => {
                // 绘制知识点
                ctx.font = 'bold 50px sans-serif';
                // 添加眼睛 Emoji
                currentY = drawWrappedText(ctx, '💡 ' + item.point, 140, currentY, 840, 55);
                
                // 绘制知识点描述
                ctx.font = '35px sans-serif';
                currentY = drawWrappedText(ctx, item.description, 140, currentY + 20, 840, 55);
                currentY += 60;
            });
            
            resolve(canvas);
        };
        img.onerror = () => {
            console.warn('背景图加载失败');
            // 继续绘制其他内容
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 80px sans-serif';
            let currentY = 280;
            
            // 测量文本高度
            const titleMetrics = ctx.measureText(detailCard.title);
            const titleHeight = titleMetrics.actualBoundingBoxAscent + titleMetrics.actualBoundingBoxDescent;
            
            currentY = drawWrappedText(ctx, detailCard.title, 140, currentY, 930, 90);
            
            // 添加标题下方的边框线
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.moveTo(140, currentY + 10);
            ctx.lineTo(1070, currentY + 10);
            ctx.stroke();
            
            currentY += 50;  // 增加标题和内容之间的间距

            // 获取并绘制知识点
            const points = getKnowledgePoints(detailCard);
            points.forEach(item => {
                // 绘制知识点
                ctx.font = 'bold 50px sans-serif';
                // 添加眼睛 Emoji
                currentY = drawWrappedText(ctx, '💡 ' + item.point, 140, currentY, 840, 55);
                
                // 绘制知识点描述
                ctx.font = '35px sans-serif';
                currentY = drawWrappedText(ctx, item.description, 140, currentY + 30, 840, 55);
                currentY += 30;
            });
            
            resolve(canvas);
        };
    });
}

// 绘制带边框和背景的文本块
function drawTextBlock(ctx, text, x, y, maxWidth, style = {}) {
    const {
        fontSize = 16,
        fontWeight = 'normal',
        textColor = '#000000',
        backgroundColor = 'transparent',
        padding = 10,
        borderRadius = 0
    } = style;

    ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
    ctx.fillStyle = backgroundColor;

    const metrics = ctx.measureText(text);
    const textWidth = Math.min(metrics.width, maxWidth);
    const textHeight = fontSize * 1.2;

    // 绘制背景
    if (backgroundColor !== 'transparent') {
        if (borderRadius > 0) {
            drawRoundRect(ctx, x - padding, y - textHeight - padding,
                textWidth + padding * 2, textHeight + padding * 2, borderRadius);
        } else {
            ctx.fillRect(x - padding, y - textHeight - padding,
                textWidth + padding * 2, textHeight + padding * 2);
        }
    }

    // 绘制文本
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);

    return {
        width: textWidth + padding * 2,
        height: textHeight + padding * 2
    };
}

// 绘制圆角矩形
function drawRoundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
}

// 绘制带换行的文本
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');  
    let line = '';
    let lines = [];
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i];
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    
    let currentY = y;
    lines.forEach(line => {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
    });
    
    return currentY;
}

// 导出函数供其他模块使用
window.createCanvas = createCanvas;
window.createDetailCanvas = createDetailCanvas;