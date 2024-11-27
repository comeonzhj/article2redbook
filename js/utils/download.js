async function downloadImages() {
    try {
        const zip = new JSZip();
        const slides = document.querySelectorAll('.carousel-slide');
        
        // 创建进度提示
        const progressDiv = createProgressElement();
        document.body.appendChild(progressDiv);

        for (let i = 0; i < slides.length; i++) {
            updateProgress(progressDiv, i + 1, slides.length);
            
            // 获取原始canvas
            const originalCanvas = slides[i].querySelector('canvas');
            if (!originalCanvas) continue;

            // 创建新的canvas
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 1600;
            const ctx = canvas.getContext('2d');

            // 加载背景图
            const img = new Image();
            img.crossOrigin = 'anonymous';
            const isDetailCard = slides[i].classList.contains('detail-card');
            // 使用基于当前页面的相对路径
            img.src = isDetailCard ? './img/detail-card.png' : './img/cover-card.png';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                // 设置5秒超时
                setTimeout(reject, 5000);
            }).catch(() => {
                console.warn('背景图加载失败，继续处理');
            });

            // 绘制背景
            try {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } catch (e) {
                console.warn('背景图绘制失败:', e);
            }

            // 绘制内容
            ctx.drawImage(originalCanvas, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/png');
            const base64Data = imageData.replace(/^data:image\/(png|jpg);base64,/, '');
            zip.file(`page_${i + 1}.png`, base64Data, {base64: true});
        }

        // 生成zip文件
        const content = await zip.generateAsync({type: 'blob'});
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'notes_images.zip';
        link.click();

        // 清理
        URL.revokeObjectURL(link.href);
        document.body.removeChild(progressDiv);
    } catch (error) {
        console.error('下载过程出错:', error);
        alert('下载失败，请稍后重试');
        const progressDiv = document.querySelector('div[style*="position: fixed"]');
        if (progressDiv) {
            document.body.removeChild(progressDiv);
        }
    }
}

function createProgressElement() {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 1000;
    `;
    return div;
}

function updateProgress(element, current, total) {
    element.textContent = `正在处理图片 ${current}/${total}...`;
}

// 导出函数
window.downloadImages = downloadImages;