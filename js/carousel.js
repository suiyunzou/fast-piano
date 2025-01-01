// 定义全局函数
window.rotateCarouselPrev = null;
window.rotateCarouselNext = null;

$(function() {
    var carousel = $('.carousel');
    var items = $('.carousel-item');
    var currentAngle = 0;
    var itemCount = items.length;
    var angleIncrement = 360 / itemCount;
    var isAnimating = false;
    var currentIndex = 0;

    // 初始化设置
    function setupCarousel() {
        items.each(function(index) {
            var angle = angleIncrement * index;
            var zTranslate = 400; // 轮播半径
            $(this).css({
                'transform': `rotateY(${angle}deg) translateZ(${zTranslate}px)`
            });
        });
    }

    setupCarousel();

    // 轮播旋转函数
    function rotateCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % itemCount;
            currentAngle -= angleIncrement;
        } else {
            currentIndex = (currentIndex - 1 + itemCount) % itemCount;
            currentAngle += angleIncrement;
        }
        
        carousel.css('transform', `rotateY(${currentAngle}deg)`);
        
        setTimeout(function() {
            isAnimating = false;
        }, 1000);
    }

    // 暴露给全局的旋转函数
    window.rotateCarouselNext = function() {
        rotateCarousel('next');
    };

    window.rotateCarouselPrev = function() {
        rotateCarousel('prev');
    };

    // 键盘控制
    $(document).on('keydown', function(e) {
        if (e.keyCode === 37) { // 左箭头
            rotateCarousel('prev');
        } else if (e.keyCode === 39) { // 右箭头
            rotateCarousel('next');
        }
    });

    // 触摸事件
    var startX;
    $('.carousel-container').on('touchstart', function(e) {
        startX = e.touches[0].pageX;
    });

    $('.carousel-container').on('touchend', function(e) {
        var endX = e.changedTouches[0].pageX;
        var diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // 最小滑动距离
            if (diff > 0) {
                rotateCarousel('next');
            } else {
                rotateCarousel('prev');
            }
        }
    });
});
