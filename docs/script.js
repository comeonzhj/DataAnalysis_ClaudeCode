/**
 * 幻灯片脚手架 JavaScript 逻辑
 * 支持自动检测和加载幻灯片页面
 */

class SlideManager {
    constructor() {
        this.slides = [];
        this.currentSlideIndex = 0;
        this.slideFrame = document.getElementById('slide-frame');
        this.thumbnailsContainer = document.getElementById('thumbnails');
        this.slideCounter = document.getElementById('slide-counter');
        this.pageIndicator = document.getElementById('page-indicator');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        this.init();
    }

    async init() {
        try {
            await this.loadSlides();
            this.setupEventListeners();
            this.renderThumbnails();
            this.updateUI();
            // 初始化时也执行一次缩放
            setTimeout(() => this.scaleIframe(), 200);
        } catch (error) {
            console.error('初始化幻灯片管理器失败:', error);
            this.showError('加载幻灯片失败，请检查 slides 目录');
        }
    }

    // 自动检测并加载幻灯片
    async loadSlides() {
        this.slides = [];
        
        // 自动检测 slides 目录中的所有文件
        await this.autoDetectSlides();
        
        // 如果没有找到任何幻灯片，创建默认提示
        if (this.slides.length === 0) {
            this.slides.push({
                id: 'default',
                title: '欢迎使用',
                path: 'data:text/html;charset=utf-8,' + encodeURIComponent(this.getDefaultSlideHTML())
            });
        }
    }

    // 自动检测幻灯片文件
    async autoDetectSlides() {
        // 预定义的幻灯片标题映射
        const slideTitles = {
            'slide-1': '数据概览',
            'slide-2': '趋势分析'
        };

        // 尝试检测常见的幻灯片文件命名模式
        const patterns = [
            'slide-',
            'page-',
            'section-',
            'chapter-'
        ];

        for (let i = 1; i <= 50; i++) {
            for (const pattern of patterns) {
                const filename = `${pattern}${i}.html`;
                const path = `slides/${filename}`;
                const slideId = `${pattern}${i}`;
                
                try {
                    const response = await fetch(path, { method: 'HEAD' });
                    if (response.ok) {
                        // 检查是否已存在
                        if (!this.slides.find(slide => slide.path === path)) {
                            // 使用预定义标题或默认标题
                            const title = slideTitles[slideId] || `幻灯片 ${i}`;
                            this.slides.push({
                                id: slideId,
                                title: title,
                                path: path
                            });
                        }
                    }
                } catch (error) {
                    // 静默处理，文件不存在是正常的
                }
            }
        }

        // 按文件名排序
        this.slides.sort((a, b) => {
            const aNum = this.extractNumber(a.id);
            const bNum = this.extractNumber(b.id);
            return aNum - bNum;
        });
    }

    // 从文件名中提取数字用于排序
    extractNumber(filename) {
        const match = filename.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    // 获取默认幻灯片HTML
    getDefaultSlideHTML() {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>欢迎使用幻灯片脚手架</title>
    <style>
        body {
            margin: 0;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg,rgb(42, 42, 42) 0%,rgb(50, 50, 50) 100%);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
        }
        .welcome-container {
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        p {
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
        }
        .instructions {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-top: 2rem;
        }
        .instructions h3 {
            margin-bottom: 1rem;
        }
        .instructions ul {
            text-align: left;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="welcome-container">
        <h1>🎯 数据分析报告</h1>
        <p>欢迎使用幻灯片展示脚手架</p>
        
        <div class="instructions">
            <h3>📋 使用说明</h3>
            <ul>
                <li>在 <code>slides/</code> 目录中添加新的 HTML 文件</li>
                <li>文件命名格式：slide-1.html, slide-2.html 等</li>
                <li>刷新页面即可自动加载新幻灯片</li>
                <li>支持 ECharts 图表和响应式布局</li>
            </ul>
        </div>
    </div>
</body>
</html>
        `;
    }

        // 设置事件监听器
        setupEventListeners() {
            // 导航按钮
            this.prevBtn.addEventListener('click', () => this.previousSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());

            // 键盘导航
            document.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                    case ' ':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.slides.length - 1);
                        break;
                }
            });

            // 窗口大小改变时重新缩放iframe
            window.addEventListener('resize', () => {
                setTimeout(() => this.scaleIframe(), 100);
            });

            // 定期检查新幻灯片
            setInterval(() => {
                this.checkForNewSlides();
            }, 5000);
        }

    // 检查是否有新幻灯片添加
    async checkForNewSlides() {
        const currentCount = this.slides.length;
        await this.autoDetectSlides();
        
        if (this.slides.length > currentCount) {
            this.renderThumbnails();
            this.updateUI();
            console.log(`检测到 ${this.slides.length - currentCount} 个新幻灯片`);
        }
    }

    // 渲染缩略图
    renderThumbnails() {
        this.thumbnailsContainer.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const thumbnailItem = document.createElement('div');
            thumbnailItem.className = 'thumbnail-item';
            thumbnailItem.dataset.index = index;

            const thumbnailPreview = document.createElement('iframe');
            thumbnailPreview.className = 'thumbnail-preview';
            thumbnailPreview.src = slide.path;

            const thumbnailTitle = document.createElement('div');
            thumbnailTitle.className = 'thumbnail-title';
            thumbnailTitle.textContent = slide.title;

            thumbnailItem.appendChild(thumbnailPreview);
            thumbnailItem.appendChild(thumbnailTitle);

            // 点击事件
            thumbnailItem.addEventListener('click', () => {
                this.goToSlide(index);
            });

            this.thumbnailsContainer.appendChild(thumbnailItem);
        });
    }

    // 跳转到指定幻灯片
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentSlideIndex = index;
        const slide = this.slides[index];
        
        // 更新主框架
        this.slideFrame.src = slide.path;
        
        // 等待加载完成后计算缩放
        this.slideFrame.onload = () => {
            setTimeout(() => this.scaleIframe(), 100);
        };
        
        // 更新缩略图状态
        this.updateThumbnailStates();
        
        // 更新UI
        this.updateUI();
    }

    // 上一张幻灯片
    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.goToSlide(this.currentSlideIndex - 1);
        }
    }

    // 下一张幻灯片
    nextSlide() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.goToSlide(this.currentSlideIndex + 1);
        }
    }

    // 更新缩略图状态
    updateThumbnailStates() {
        const thumbnails = this.thumbnailsContainer.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentSlideIndex);
        });
    }

    // 智能缩放iframe以适应容器
    scaleIframe() {
        try {
            const iframe = this.slideFrame;
            if (!iframe) return;

            const container = iframe.parentElement;
            const containerRect = container.getBoundingClientRect();
            
            // 计算可用空间（减去padding）
            const availableWidth = containerRect.width - 48; // 3rem padding
            const availableHeight = containerRect.height - 48;
            
            // iframe的虚拟尺寸（在CSS中设定）
            const iframeWidth = 1600;
            const iframeHeight = 900;
            
            // 计算缩放比例
            const scaleX = availableWidth / iframeWidth;
            const scaleY = availableHeight / iframeHeight;
            const scale = Math.min(scaleX, scaleY, 1); // 不超过原始大小
            
            // 应用缩放
            iframe.style.transform = `scale(${scale})`;
            
            console.log(`iframe缩放: ${scale.toFixed(3)} (容器: ${availableWidth}x${availableHeight})`);
            
        } catch (error) {
            console.error('缩放iframe时出错:', error);
        }
    }


    // 更新UI状态
    updateUI() {
        // 更新计数器
        this.slideCounter.textContent = `${this.slides.length} 张幻灯片`;
        
        // 更新页面指示器
        this.pageIndicator.textContent = `${this.currentSlideIndex + 1} / ${this.slides.length}`;
        
        // 更新导航按钮状态
        this.prevBtn.disabled = this.currentSlideIndex === 0;
        this.nextBtn.disabled = this.currentSlideIndex === this.slides.length - 1;
        
        // 更新缩略图状态
        this.updateThumbnailStates();
    }

    // 显示错误信息
    showError(message) {
        this.thumbnailsContainer.innerHTML = `
            <div class="error">
                <p>${message}</p>
            </div>
        `;
    }

    // 刷新幻灯片列表
    async refresh() {
        await this.loadSlides();
        this.renderThumbnails();
        this.updateUI();
    }
}

// 全局函数
window.slideManager = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.slideManager = new SlideManager();
});

// 暴露给外部调用的API
window.SlideAPI = {
    refresh: () => window.slideManager?.refresh(),
    goToSlide: (index) => window.slideManager?.goToSlide(index),
    addSlide: (slide) => {
        if (window.slideManager) {
            window.slideManager.slides.push(slide);
            window.slideManager.renderThumbnails();
            window.slideManager.updateUI();
        }
    },
    getCurrentSlide: () => window.slideManager?.currentSlideIndex || 0,
    getTotalSlides: () => window.slideManager?.slides.length || 0
};
