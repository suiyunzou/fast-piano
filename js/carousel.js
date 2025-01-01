// 定义全局函数
window.rotateCarouselPrev = null;
window.rotateCarouselNext = null;

$(document).ready(function() {
    console.log('Carousel.js loaded');
    
    // 创建粒子背景
    function createParticles() {
        const particles = document.getElementById('particles');
        if (!particles) return;
        
        for(let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particles.appendChild(particle);
        }
    }
    createParticles();

    // 3D轮播图相关代码
    const carousel = $('.carousel');
    const items = $('.carousel-item');
    let currentAngle = 0;
    const itemCount = items.length;
    const angleIncrement = 360 / itemCount;

    console.log('Found carousel items:', items.length);

    // 初始化每个卡片的位置
    function setupCarousel() {
        items.each(function(index) {
            const angle = angleIncrement * index;
            $(this).css('transform', `rotateY(${angle}deg) translateZ(400px)`);
        });
        updateCarousel(); // 确保初始状态正确
    }

    // 更新轮播图的旋转
    function updateCarousel() {
        carousel.css('transform', `rotateY(${currentAngle}deg)`);
    }

    // 向前旋转
    window.rotateCarouselNext = function() {
        currentAngle -= angleIncrement;
        updateCarousel();
    };

    // 向后旋转
    window.rotateCarouselPrev = function() {
        currentAngle += angleIncrement;
        updateCarousel();
    };

    // 初始化轮播图
    setupCarousel();

    // 绑定按钮点击事件
    $('.prev').click(function(e) {
        e.preventDefault();
        rotateCarouselPrev();
    });

    $('.next').click(function(e) {
        e.preventDefault();
        rotateCarouselNext();
    });

    // 自动轮播
    let autoRotateInterval = setInterval(rotateCarouselNext, 3000);

    // 鼠标悬停时暂停自动轮播
    $('.carousel-container').hover(
        function() {
            clearInterval(autoRotateInterval);
        },
        function() {
            autoRotateInterval = setInterval(rotateCarouselNext, 3000);
        }
    );
});
