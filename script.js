// DOM লোড হওয়ার পর সব ফাংশনালিটি ইনিশিয়ালাইজ করুন
document.addEventListener('DOMContentLoaded', function() {
    console.log("NB Photography Script Loaded");
    
    // বুকিং সিস্টেম
    const bookButtons = document.querySelectorAll('.nb-book-btn');
    const bookingModal = document.getElementById('nb-bookingModal');
    const closeModal = document.querySelector('.nb-close-modal');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageName = this.getAttribute('data-package');
            const packagePrice = this.getAttribute('data-price');
            const packageFeatures = this.getAttribute('data-features');
            
            document.getElementById('nb-modalPackageTitle').textContent = packageName;
            
            let featuresHTML = `
                <p style="margin-bottom: 10px;"><strong>প্যাকেজ নাম:</strong> ${packageName}</p>
                <p style="margin-bottom: 10px;"><strong>মূল্য:</strong> ${packagePrice}</p>
                <p style="margin-bottom: 10px;"><strong>প্যাকেজ বিবরণ:</strong></p>
                <ul style="margin-left: 20px; margin-top: 5px; padding-left: 15px;">
            `;
            
            packageFeatures.split(',').forEach(feature => {
                featuresHTML += `<li style="margin-bottom: 5px; list-style-type: disc;">${feature.trim()}</li>`;
            });
            
            featuresHTML += `</ul>`;
            document.getElementById('nb-modalPackageDetails').innerHTML = featuresHTML;
            
            // WhatsApp লিঙ্ক - ইউনিকোড এনকোডিং ব্যবহার করে
            const whatsappMessage = encodeURIComponent(
                `NB ফটোগ্রাফি - প্যাকেজ বুকিং অনুরোধ\n\n` +
                `প্যাকেজ নাম: ${packageName}\n` +
                `মূল্য: ${packagePrice}\n\n` +
                `বৈশিষ্ট্য:\n${packageFeatures.split(',').map(f => '• ' + f.trim()).join('\n')}\n\n` +
                `আমি এই প্যাকেজটি বুক করতে চাই।`
            );
            document.getElementById('nb-whatsappBtn').href = `https://wa.me/8801628233346?text=${whatsappMessage}`;
            
            // Messenger লিঙ্ক - ইউনিকোড এনকোডিং ব্যবহার করে
            const facebookMessage = encodeURIComponent(
                `NB ফটোগ্রাফি - প্যাকেজ বুকিং অনুরোধ\n\n` +
                `প্যাকেজ নাম: ${packageName}\n` +
                `মূল্য: ${packagePrice}\n\n` +
                `বৈশিষ্ট্য:\n${packageFeatures.split(',').map(f => '• ' + f.trim()).join('\n')}\n\n` +
                `আমি এই প্যাকেজটি বুক করতে চাই।`
            );
            document.getElementById('nb-facebookBtn').href = `https://m.me/nbphotographybd46?text=${facebookMessage}`;
            
            bookingModal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', function() {
        bookingModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // ইমেজ স্লাইডার
    const slider = document.getElementById('nb-gallerySlider');
    const slides = document.querySelectorAll('.nb-gallery-slide');
    const prevBtn = document.getElementById('nb-prevSlide');
    const nextBtn = document.getElementById('nb-nextSlide');
    const sliderNav = document.getElementById('nb-sliderNav');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    
    // নেভিগেশন ডটস তৈরি করুন
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('nb-slider-dot');
        if(index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        sliderNav.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.nb-slider-dot');
    
    function goToSlide(slideIndex) {
        slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        currentSlide = slideIndex;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // টাচ ইভেন্ট হ্যান্ডলার
    slides.forEach((slide, index) => {
        // টাচ ইভেন্ট
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);
        
        // মাউস ইভেন্ট
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });
    
    // টাচ স্টার্ট
    function touchStart(index) {
        return function(event) {
            currentSlide = index;
            startPos = getPositionX(event);
            isDragging = true;
            
            animationID = requestAnimationFrame(animation);
            slider.classList.add('grabbing');
        }
    }
    
    // টাচ এন্ড
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        const movedBy = currentTranslate - prevTranslate;
        
        if(movedBy < -100 && currentSlide < slides.length - 1) {
            currentSlide += 1;
        }
        
        if(movedBy > 100 && currentSlide > 0) {
            currentSlide -= 1;
        }
        
        setPositionByIndex();
        slider.classList.remove('grabbing');
    }
    
    // টাচ মুভ
    function touchMove(event) {
        if(isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function animation() {
        setSliderPosition();
        if(isDragging) requestAnimationFrame(animation);
    }
    
    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function setPositionByIndex() {
        currentTranslate = currentSlide * -window.innerWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // অটো স্লাইড
    let slideInterval = setInterval(nextSlide, 5000);
    
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // FAQ ফাংশনালিটি
    const faqQuestions = document.querySelectorAll('.nb-faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            document.querySelectorAll('.nb-faq-answer').forEach(item => {
                if(item !== answer) {
                    item.classList.remove('active');
                    item.previousElementSibling.querySelector('i').classList.remove('fa-chevron-up');
                    item.previousElementSibling.querySelector('i').classList.add('fa-chevron-down');
                }
            });
            
            answer.classList.toggle('active');
            
            if (answer.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // কাউন্টার অ্যানিমেশন
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if(current >= target) {
                clearInterval(timer);
                current = target;
            }
            
            if(element.id === 'nb-clientCounter') {
                element.textContent = Math.floor(current) + '+';
            } else if(element.id === 'nb-packageCounter') {
                element.textContent = Math.floor(current);
            } else if(element.id === 'nb-satisfactionCounter') {
                element.textContent = Math.floor(current) + '%';
            }
        }, 16);
    }
    
    // কাউন্টার শুরু করুন
    animateCounter(document.getElementById('nb-clientCounter'), 500);
    animateCounter(document.getElementById('nb-packageCounter'), 10);
    animateCounter(document.getElementById('nb-satisfactionCounter'), 100);

    // মিউজিক প্লেয়ার
    const musicToggle = document.getElementById('nb-musicToggle');
    const bgMusic = document.getElementById('nb-bgMusic');
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        if(isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play().catch(e => {
                console.log("Audio playback failed:", e);
            });
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    // ফর্ম ভ্যালিডেশন
    const contactForm = document.getElementById('nb-contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const name = document.getElementById('nb-name');
        const phone = document.getElementById('nb-phone');
        const package = document.getElementById('nb-package');
        const message = document.getElementById('nb-message');
        
        // নাম ভ্যালিডেশন
        if(name.value.trim() === '') {
            document.getElementById('nb-nameError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nb-nameError').style.display = 'none';
        }
        
        // ফোন ভ্যালিডেশন
        const phoneRegex = /^[0-9]{11}$/;
        if(!phoneRegex.test(phone.value.trim())) {
            document.getElementById('nb-phoneError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nb-phoneError').style.display = 'none';
        }
        
        // প্যাকেজ ভ্যালিডেশন
        if(package.value === '') {
            document.getElementById('nb-packageError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nb-packageError').style.display = 'none';
        }
        
        // বার্তা ভ্যালিডেশন
        if(message.value.trim() === '') {
            document.getElementById('nb-messageError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nb-messageError').style.display = 'none';
        }
        
        if(isValid) {
            alert('ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
            contactForm.reset();
        }
    });

    // ইমেজ লোড ফ্যালব্যাক
    document.querySelectorAll('.nb-gallery-slide img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/800x400?text=NB+Photography';
            this.alt = 'ইমেজ লোড করতে ব্যর্থ হয়েছে';
        };
    });
});
