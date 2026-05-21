(function(){
    var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 92;

    var current = window.scrollY || 0;
    var target = current;
    var ease = 0.12;
    var ticking = false;

    function maxScroll(){ return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }

    function raf(){
        current += (target - current) * ease;
        if (Math.abs(target - current) < 0.5) {
            current = target;
            window.scrollTo(0, current);
            ticking = false;
            return;
        }
        window.scrollTo(0, current);
        requestAnimationFrame(raf);
    }

    window.addEventListener('wheel', function(e){
        if (e.ctrlKey) return;
        e.preventDefault();
        target += e.deltaY;
        if (target < 0) target = 0;
        var mx = maxScroll(); if (target > mx) target = mx;
        if (!ticking){ ticking = true; requestAnimationFrame(raf); }
    }, {passive:false});

    window.addEventListener('scroll', function(){
        if (!ticking){ current = window.scrollY; target = current; }
    }, {passive:true});

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
        anchor.addEventListener('click', function(e){
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            var id = href.split('#')[1];
            var el = document.getElementById(id);
            if (el){
                e.preventDefault();
                var top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
                target = Math.max(0, Math.min(top, maxScroll()));
                if (!ticking){ ticking = true; requestAnimationFrame(raf); }
                history.pushState(null, '', '#'+id);
            }
        });
    });

    window.addEventListener('resize', function(){ if (target > maxScroll()) target = maxScroll(); });

    var navToggle = document.querySelector('.nav-toggle');
    var navContainer = document.querySelector('.nav-container');
    var mainNav = document.querySelector('.main-nav');
    if (navToggle && navContainer) {
        navToggle.addEventListener('click', function(){
            var isOpen = navContainer.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
        });
        if (mainNav) {
            mainNav.querySelectorAll('a').forEach(function(a){
                a.addEventListener('click', function(){
                    navContainer.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
        window.addEventListener('resize', function(){ if (window.innerWidth > 768) { navContainer.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); } });
    }

    var formContact = document.getElementById('contactos');
    if (formContact) {
        var whatsappNumber = '543525480117';
        formContact.addEventListener('submit', function(event) {
            event.preventDefault();

            var nombre = this.nombre.value.trim();
            var apellido = this.apellido.value.trim();
            var email = this.email.value.trim();
            var ubicacion = this.ubicacion.value.trim();
            var mensaje = this.mensaje.value.trim();

            if (!mensaje) {
                alert('Por favor, escribí tu consulta antes de enviar.');
                this.mensaje.focus();
                return;
            }

            var lines = [];
            if (nombre || apellido) {
                lines.push('Hola, soy ' + [nombre, apellido].filter(Boolean).join(' '));
            } else {
                lines.push('Hola, soy un potencial cliente.');
            }
            if (ubicacion) {
                lines.push('Consulto sobre: ' + ubicacion);
            }
            if (email) {
                lines.push('Email: ' + email);
            }
            lines.push('Mensaje: ' + mensaje);

            var whatsappText = encodeURIComponent(lines.join('\n'));
            var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappText;

            window.open(whatsappUrl, '_blank');
        });
    }
})();
