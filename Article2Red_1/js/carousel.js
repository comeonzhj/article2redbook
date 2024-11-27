let currentSlide = 0;
let totalSlides = 0;

// 初始化轮播图
function initializeCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => showPreviousSlide());
    nextBtn.addEventListener('click', () => showNextSlide());

    // 添加键盘事件支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPreviousSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    });
}

// 显示指定索引的幻灯片
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;

    // 处理边界情况
    if (index >= totalSlides) {
        index = 0;
    } else if (index < 0) {
        index = totalSlides - 1;
    }

    // 更新当前幻灯片索引
    currentSlide = index;

    // 隐藏所有幻灯片
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // 显示当前幻灯片
    slides[currentSlide].classList.add('active');

    // 更新计数器
    updateCarouselCounter(currentSlide, totalSlides);
}

// 显示下一张幻灯片
function showNextSlide() {
    showSlide(currentSlide + 1);
}

// 显示上一张幻灯片
function showPreviousSlide() {
    showSlide(currentSlide - 1);
}

// 更新轮播图计数器
function updateCarouselCounter(current, total) {
    const counter = document.querySelector('.carousel-counter');
    counter.textContent = `${current + 1}/${total}`;
}

// 在页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', initializeCarousel);

// 导出函数供其他模块使用
window.showSlide = showSlide;
window.updateCarouselCounter = updateCarouselCounter;