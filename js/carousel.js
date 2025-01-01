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
    var carousel = $('.carousel');
    var items = $('.carousel-item');
    var currentAngle = 0;
    var itemCount = items.length;
    var angleIncrement = 360 / itemCount;
    var isAnimating = false;
    var autoRotate;

    console.log('Found carousel items:', items.length);

    function setupCarousel() {
        items.each(function(index) {
            var angle = angleIncrement * index;
            var zTranslate = 400;
            $(this).css({
                'transform': `rotateY(${angle}deg) translateZ(${zTranslate}px)`
            });
        });
    }

    setupCarousel();

    function rotateCarousel(direction) {
        console.log('Rotating carousel:', direction);
        if (isAnimating) return;
        isAnimating = true;
        
        if (direction === 'prev') {
            currentAngle += angleIncrement;
        } else {
            currentAngle -= angleIncrement;
        }
        
        carousel.css('transform', `rotateY(${currentAngle}deg)`);
        
        setTimeout(function() {
            isAnimating = false;
        }, 1000);
    }

    function startAutoRotate() {
        if (autoRotate) {
            clearInterval(autoRotate);
        }
        autoRotate = setInterval(function() {
            if (!isAnimating) {
                rotateCarousel('next');
            }
        }, 3000);
    }

    // 开始自动旋转
    startAutoRotate();

    // 使用 mouseenter/mouseleave 替代 hover
    var carouselContainer = $('.carousel-container');
    
    carouselContainer.on('mouseenter', function() {
        console.log('Mouse entered carousel');
        if (autoRotate) {
            clearInterval(autoRotate);
            autoRotate = null;
        }
    });

    carouselContainer.on('mouseleave', function() {
        console.log('Mouse left carousel');
        startAutoRotate();
    });

    // 定义全局函数
    window.rotateCarouselPrev = function() {
        console.log('Global prev function called');
        if (autoRotate) {
            clearInterval(autoRotate);
        }
        rotateCarousel('prev');
        startAutoRotate();
    };
    
    window.rotateCarouselNext = function() {
        console.log('Global next function called');
        if (autoRotate) {
            clearInterval(autoRotate);
        }
        rotateCarousel('next');
        startAutoRotate();
    };

    // 按钮点击事件
    $('.prev').on('click', function(e) {
        console.log('Previous button clicked in carousel.js');
        e.preventDefault();
        window.rotateCarouselPrev();
    });

    $('.next').on('click', function(e) {
        console.log('Next button clicked in carousel.js');
        e.preventDefault();
        window.rotateCarouselNext();
    });

    // 触摸控制
    var startX;
    carouselContainer.on('touchstart', function(e) {
        startX = e.touches[0].pageX;
        if (autoRotate) {
            clearInterval(autoRotate);
            autoRotate = null;
        }
    });

    carouselContainer.on('touchend', function(e) {
        var endX = e.changedTouches[0].pageX;
        var diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                rotateCarousel('next');
            } else {
                rotateCarousel('prev');
            }
        }

        startAutoRotate();
    });
});
