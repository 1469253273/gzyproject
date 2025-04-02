document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // 公告关闭功能
    const announcementCloseBtn = document.querySelector('.announcement-close');
    const announcement = document.querySelector('.announcement');
    
    if (announcementCloseBtn && announcement) {
        announcementCloseBtn.addEventListener('click', function() {
            announcement.style.display = 'none';
        });
    }
    
    // 视频播放控制
    const videoOverlay = document.querySelector('.video-overlay');
    const video = document.querySelector('.hero-video video');
    const playBtn = document.querySelector('.play-btn');
    
    if (videoOverlay && video && playBtn) {
        playBtn.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                videoOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                playBtn.style.opacity = '0';
            } else {
                video.pause();
                videoOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                playBtn.style.opacity = '1';
            }
        });
        
        video.addEventListener('ended', function() {
            videoOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            playBtn.style.opacity = '1';
        });
    }
    
    // 用户评价轮播
    const testimonialDots = document.querySelectorAll('.testimonials-dots .dot');
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonialDots.length > 0 && testimonials.length > 0) {
        // 初始化轮播
        showTestimonial(0);
        
        // 点击切换
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showTestimonial(index);
            });
        });
        
        // 自动轮播
        let currentTestimonial = 0;
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        function showTestimonial(index) {
            // 隐藏所有评价
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
            });
            
            // 移除所有点的激活状态
            testimonialDots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // 显示当前评价
            testimonials[index].style.display = 'block';
            testimonialDots[index].classList.add('active');
        }
    }
    
    // 登录/注册演示
    const loginBtn = document.querySelector('.user-area-guest .btn-primary');
    const registerBtn = document.querySelector('.user-area-guest .btn-secondary');
    const guestArea = document.querySelector('.user-area-guest');
    const loggedInArea = document.querySelector('.user-area-logged-in');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (loginBtn && guestArea && loggedInArea && logoutBtn) {
        // 登录按钮点击
        loginBtn.addEventListener('click', function() {
            // 这里应该是登录表单逻辑，这里只做简单演示
            guestArea.style.display = 'none';
            loggedInArea.style.display = 'flex';
            
            // 保存登录状态到本地存储
            localStorage.setItem('isLoggedIn', 'true');
        });
        
        // 注册按钮点击
        if (registerBtn) {
            registerBtn.addEventListener('click', function() {
                alert('注册功能即将上线，敬请期待！');
            });
        }
        
        // 退出登录按钮点击
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            guestArea.style.display = 'flex';
            loggedInArea.style.display = 'none';
            
            // 清除登录状态
            localStorage.removeItem('isLoggedIn');
        });
        
        // 检查登录状态
        if (localStorage.getItem('isLoggedIn') === 'true') {
            guestArea.style.display = 'none';
            loggedInArea.style.display = 'flex';
        }
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 创建图片文件夹
    function createImageFolderNotice() {
        console.log('注意：请创建 images 文件夹并添加以下图片：');
        console.log('- logo.svg: 网站logo');
        console.log('- avatar.jpg: 用户头像示例');
        console.log('- video-poster.jpg: 视频封面图');
        console.log('- user1.jpg, user2.jpg, user3.jpg: 用户评价头像');
    }
    
    // 创建视频文件夹
    function createVideoFolderNotice() {
        console.log('注意：请创建 videos 文件夹并添加以下视频：');
        console.log('- demo.mp4: 首页演示视频');
    }
    
    // 显示文件夹创建提示
    createImageFolderNotice();
    createVideoFolderNotice();
    
    // 页面滚动效果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // 添加滚动时元素的动画效果
        const animateElements = document.querySelectorAll('.feature-card, .step, .quick-card, .testimonial');
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
    
    // 初始化动画元素
    const animateElements = document.querySelectorAll('.feature-card, .step, .quick-card, .testimonial');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // 触发初始滚动检测
    setTimeout(function() {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
    
    // 表单提交处理
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('感谢订阅！我们将定期发送最新资讯到您的邮箱：' + emailInput.value);
                emailInput.value = '';
            } else {
                alert('请输入有效的邮箱地址');
            }
        });
    }
    
    // CTA按钮点击事件
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('免费注册')) {
                alert('注册功能即将上线，敬请期待！');
            } else if (this.textContent.includes('了解会员方案')) {
                alert('会员方案详情页面正在建设中，敬请期待！');
            }
        });
    });
});
