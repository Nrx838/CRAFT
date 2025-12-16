        // --- 1. SLIDER LOGIC ---
        document.addEventListener('DOMContentLoaded', function () {
            const track = document.querySelector('.slider-track');
            const slides = Array.from(document.querySelectorAll('.slide'));
            const prevBtn = document.querySelector('.slider-arrow--left');
            const nextBtn = document.querySelector('.slider-arrow--right');

            if (track && slides.length > 0 && prevBtn && nextBtn) {
                let currentIndex = 0;

                function goToSlide(index) {
                    if (index < 0) {
                        index = slides.length - 1;
                    } else if (index >= slides.length) {
                        index = 0;
                    }
                    currentIndex = index;
                    track.style.transform = 'translateX(' + (-index * 100) + '%)';
                }

                prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
                nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
                
                // Авто-переключение слайдов каждые 5 секунд (опционально)
                // setInterval(() => goToSlide(currentIndex + 1), 5000);
            }
        });

        // --- 2. TECH BACKGROUND ANIMATION (Canvas) ---
        const canvas = document.getElementById('tech-canvas');
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];
        
        // Настройки анимации
        const config = {
            particleCount: 70, // Количество точек
            connectionDistance: 160, // Дистанция соединения
            mouseDistance: 200, // Радиус реакции на мышь
            color: '16, 163, 74', // RGB цвет (Зеленый #16a34a)
            speed: 0.4 // Скорость движения
        };

        // Отслеживание мыши
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Класс Частицы
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.speed;
                this.vy = (Math.random() - 0.5) * config.speed;
                this.size = Math.random() * 2 + 1; // Размер точки
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Отталкивание от границ
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Взаимодействие с мышью (мягкое притяжение/отталкивание)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance < config.mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (config.mouseDistance - distance) / config.mouseDistance;
                        const directionMultiplier = 1; // 1 = притягивать, -1 = отталкивать
                        
                        // Плавное изменение скорости
                        this.vx += forceDirectionX * force * 0.05 * directionMultiplier;
                        this.vy += forceDirectionY * force * 0.05 * directionMultiplier;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${config.color}, 0.5)`;
                ctx.fill();
            }
        }

        // Инициализация
        function init() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            
            // Адаптируем количество частиц под размер экрана
            const responsiveCount = window.innerWidth < 768 ? 40 : config.particleCount;

            for (let i = 0; i < responsiveCount; i++) {
                particles.push(new Particle());
            }
        }

        // Цикл анимации
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                let p1 = particles[i];
                p1.update();
                p1.draw();

                // Рисуем линии между близкими частицами
                for (let j = i; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p1.x - p2.x;
                    let dy = p1.y - p2.y;
                    let distance = Math.sqrt(dx*dx + dy*dy);

                    if (distance < config.connectionDistance) {
                        ctx.beginPath();
                        // Прозрачность зависит от дистанции (чем ближе, тем ярче)
                        let opacity = 1 - (distance / config.connectionDistance);
                        ctx.strokeStyle = `rgba(${config.color}, ${opacity * 0.25})`; 
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        // Ресайз окна
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init(); // Пересоздаем частицы при сильном изменении размера
        });

        init();
        animate();


