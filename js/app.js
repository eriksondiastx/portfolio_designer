// ==========================================
// LANDING PAGE LOGIC (Frontend)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carregar os dados hardcoded (via data.js)
    let data = portfolioData;

    try {
        // 2. Renderizar o "Hero"
        const heroNameEl = document.getElementById('heroNameText');
        const heroSpecialtyEl = document.getElementById('heroSpecialtyText');
        const heroPhraseEl = document.getElementById('heroPhraseText');
        const navLogoEl = document.getElementById('navLogo');
    
    // Animação de Typewriter para o Hero Name
    const firstName = data.hero.designerName.split(' ')[0] || 'Designer';
    navLogoEl.innerHTML = `${firstName}<span class="text-blue-500">.</span>`;
    
    heroNameEl.textContent = data.hero.designerName;
    heroSpecialtyEl.textContent = data.hero.specialty;
    
    // Typewriter effect approach via JS manipulation for phrase
    let textToType = data.hero.creativePhrase;
    heroPhraseEl.textContent = '';
    let i = 0;
    function typeWriter() {
        if (i < textToType.length) {
            heroPhraseEl.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 50); // Speed
        } else {
            heroPhraseEl.classList.remove('typewriter-text'); // Remove blink cursor when done
        }
    }
    setTimeout(typeWriter, 500); // Delay start

    // Redes Sociais (Hero)
    const socialLinks = document.getElementById('heroSocialLinks');
    if(data.social.behance) socialLinks.innerHTML += `<a href="${data.social.behance}" target="_blank" class="hover:text-blue-500 transition-colors"><i class="fa-brands fa-behance"></i></a>`;
    if(data.social.dribbble) socialLinks.innerHTML += `<a href="${data.social.dribbble}" target="_blank" class="hover:text-pink-500 transition-colors"><i class="fa-brands fa-dribbble"></i></a>`;
    if(data.social.instagram) socialLinks.innerHTML += `<a href="${data.social.instagram}" target="_blank" class="hover:text-purple-500 transition-colors"><i class="fa-brands fa-instagram"></i></a>`;
    if(data.social.linkedin) socialLinks.innerHTML += `<a href="${data.social.linkedin}" target="_blank" class="hover:text-blue-400 transition-colors"><i class="fa-brands fa-linkedin-in"></i></a>`;

    // 3. Renderizar "Sobre Mim"
    document.getElementById('aboutImage').src = data.about.avatarUrl;
    document.getElementById('aboutNameFirst').textContent = firstName;
    document.getElementById('aboutStyleText').innerHTML = `<strong>Estilo:</strong> ${data.about.designStyle}`;
    
    // Split bio in paragraphs if there are line breaks
    let bioText = '';
    if (data.about && data.about.bio) {
        bioText = data.about.bio.split('\n').map(p => `<p class="mb-2">${p}</p>`).join('');
    } else {
        bioText = '<p>Biografia não informada.</p>';
    }
    document.getElementById('aboutBioText').innerHTML = bioText;

    const softSkillsContainer = document.getElementById('aboutSoftSkills');
    softSkillsContainer.innerHTML = '';
    if (data.about && data.about.softSkills) {
        data.about.softSkills.forEach(skill => {
            softSkillsContainer.innerHTML += `
                <span class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm font-medium hover:border-blue-500 transition-colors cursor-default text-gray-200">${skill}</span>
            `;
        });
    }

    // 4. Scroll Reveal Logic (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target); // Animate only once per load
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Se o browser não suportar, mostramos tudo de uma vez
        revealElements.forEach(el => el.classList.add('active'));
    }

    // Tentar forçar o load de todas as reveals caso haja delay severo (ajuda em bugs de layout)
    setTimeout(() => {
        revealElements.forEach(el => {
            if(!el.classList.contains('active')) el.classList.add('active');
        });
    }, 2000);

    // 5. Theme Toggle Logic (Dark/Light)
    const themeBtn = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check saved preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if(currentTheme === 'light') {
        body.classList.add('light-mode');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        body.classList.remove('light-mode');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun text-yellow-500"></i>';
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun text-yellow-500"></i>';
        
        // Add a small rotation animation
        themeBtn.classList.add('rotate-180');
        setTimeout(() => themeBtn.classList.remove('rotate-180'), 300);
    });

    // 6. Renderizar Portfólio & Criar Filtros
    const portfolioGrid = document.getElementById('portfolioGrid');
    const portfolioFilters = document.getElementById('portfolioFilters');
    
    // Obter categorias únicas
    const categoriesSet = new Set(data.portfolio.map(p => p.category));
    
    // Criar botões de filtro dinamicamente
    categoriesSet.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn px-5 py-2 rounded-full text-sm font-medium border border-gray-700 hover:border-blue-500 text-gray-400 hover:text-white transition-colors bg-gray-900 capitalize';
        btn.setAttribute('data-filter', cat);
        btn.textContent = cat;
        portfolioFilters.appendChild(btn);
    });

    // Renderizar Projetos
    function renderPortfolio(filter = 'all') {
        portfolioGrid.innerHTML = '';
        const filteredProjects = filter === 'all' ? data.portfolio : data.portfolio.filter(p => p.category === filter);
        
        filteredProjects.forEach((proj, idx) => {
            // Animação inline de atraso (Stagger effect)
            const delay = (idx * 0.1).toFixed(1);
            
            portfolioGrid.innerHTML += `
                <div class="group relative overflow-hidden rounded-2xl bg-gray-800 break-inside-avoid shadow-lg transform transition-all duration-500 hover:-translate-y-2 cursor-pointer portfolio-item animate-fadeIn" style="animation-delay: ${delay}s" onclick="openLightbox('${proj.id}')">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity z-10"></div>
                    <img src="${proj.imageUrl}" alt="${proj.name}" class="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" onerror="this.src='https://placehold.co/600x600/1f2937/fff?text=Photo'">
                    
                    <div class="absolute bottom-0 left-0 w-full p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span class="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2 block">${proj.category}</span>
                        <h4 class="text-2xl font-bold font-space text-white mb-2 leading-tight">${proj.name}</h4>
                        <div class="w-0 group-hover:w-12 h-1 bg-blue-500 transition-all duration-500"></div>
                    </div>
                </div>
            `;
        });
    }

    renderPortfolio(); // Initial render

    // Lógica dos Botões de Filtro
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualizar classes ativas
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-white', 'text-black');
                b.classList.add('bg-gray-900', 'text-gray-400', 'border-gray-700');
            });
            btn.classList.add('active', 'bg-white', 'text-black');
            btn.classList.remove('bg-gray-900', 'text-gray-400', 'border-gray-700');
            
            // Re-renderizar com filtro
            renderPortfolio(btn.getAttribute('data-filter'));
        });
    });

    // 7. Renderizar Experiência
    const expContainer = document.getElementById('expContainer');
    expContainer.innerHTML = '';
    data.experience.forEach(exp => {
        let galleryHTML = '';
        if (exp.gallery && exp.gallery.length > 0) {
            galleryHTML = `<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">`;
            exp.gallery.forEach((img, idx) => {
                galleryHTML += `
                    <div class="group/gallery relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 cursor-pointer" onclick="openExperienceLightbox('${exp.id}', ${idx})">
                        <img src="${img.url}" alt="${img.title}" class="w-full h-40 object-cover transform group-hover/gallery:scale-110 transition-transform duration-500" onerror="this.src='https://placehold.co/600x400/1f2937/fff?text=Image'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h5 class="text-white font-bold text-sm mb-1">${img.title}</h5>
                            <p class="text-gray-300 text-xs">${img.description}</p>
                        </div>
                    </div>
                `;
            });
            galleryHTML += `</div>`;
        }

        expContainer.innerHTML += `
            <div class="relative pl-8 group pb-8">
                <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-900 group-hover:scale-150 group-hover:bg-blue-400 transition-transform z-10"></div>
                <div class="absolute left-0 top-4 bottom-0 w-px bg-gray-800 -translate-x-[0.5px]"></div>
                <h4 class="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors relative z-10 bg-gray-950 inline-block pr-2">${exp.project}</h4>
                <div class="text-blue-500 text-sm font-medium mb-3">${exp.company}</div>
                <p class="text-gray-400 leading-relaxed">${exp.description}</p>
                ${galleryHTML}
            </div>
        `;
    });

    // 8. Renderizar Formação
    const eduContainer = document.getElementById('eduContainer');
    eduContainer.innerHTML = '';
    data.education.forEach(edu => {
        eduContainer.innerHTML += `
            <div class="glass p-6 rounded-2xl group hover:-translate-y-2 transition-transform duration-300">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">${edu.courseName}</h4>
                        <span class="text-gray-400 text-sm"><i class="fa-solid fa-building-columns mr-2"></i>${edu.institution}</span>
                    </div>
                    <span class="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">${edu.year}</span>
                </div>
                ${edu.certificateUrl ? `
                <a href="${edu.certificateUrl}" target="_blank" class="text-sm font-medium text-white hover:text-purple-400 transition-colors inline-flex items-center gap-2 mt-2">
                    <i class="fa-solid fa-download"></i> Ver Certificado
                </a>` : ''}
            </div>
        `;
    });

    // 9. Renderizar Skills
    const skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.innerHTML = '';
    const sortedSkills = [...data.skills].sort((a, b) => b.level - a.level);
    
    sortedSkills.forEach(skill => {
        skillsContainer.innerHTML += `
            <div class="bg-gray-800/50 border border-gray-800 p-6 rounded-2xl text-center group hover:bg-gray-800 transition-colors">
                <div class="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-700 group-hover:border-blue-500 transition-colors">
                    <span class="text-xl font-bold text-blue-500">${skill.level}%</span>
                </div>
                <h4 class="text-white font-medium">${skill.name}</h4>
            </div>
        `;
    });

    // 10. Renderizar Idiomas
    if (data.languages && data.languages.length > 0) {
        const langContainer = document.getElementById('languagesContainer');
        if (langContainer) {
            langContainer.innerHTML = '';
            data.languages.forEach(lang => {
                langContainer.innerHTML += `
                    <div class="bg-gray-800/50 border border-gray-800 p-5 rounded-2xl hover:bg-gray-800 transition-colors group">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">${lang.flag}</span>
                                <div>
                                    <h4 class="text-white font-semibold">${lang.name}</h4>
                                    <span class="text-xs text-blue-400 font-medium">${lang.level}</span>
                                </div>
                            </div>
                            <span class="text-sm font-bold text-gray-400">${lang.percent}%</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style="width: ${lang.percent}%"></div>
                        </div>
                    </div>
                `;
            });
        }
    }

    // 11. Links do Footer (Cópia do Hero)
    document.getElementById('footerSocialLinks').innerHTML = socialLinks.innerHTML;

    // 11. Navbar Blur on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg', 'bg-gray-900/80', 'backdrop-blur-md');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('shadow-lg', 'bg-gray-900/80', 'backdrop-blur-md');
                navbar.classList.add('bg-transparent');
            }
        });
    }

    } catch (error) {
        console.error("Erro renderizando layout dinâmico:", error);
    }
});

// --- Fora do DOMContentLoaded ---
// Função de Lightbox (Global)
function openLightbox(projectId) {
    const data = portfolioData;
    const proj = data.portfolio.find(p => p.id === projectId);
    if(!proj) return;
    
    // Criar modal dinamicamente se não existir
    let lightbox = document.getElementById('portfolioLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'portfolioLightbox';
        lightbox.className = 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 lg:p-12 opacity-0 transition-opacity duration-300 pointer-events-none';
        document.body.appendChild(lightbox);
    }
    
    lightbox.innerHTML = `
        <button onclick="closeLightbox()" class="absolute top-6 right-6 text-white text-4xl hover:text-blue-500 transition-colors z-50"><i class="fa-solid fa-xmark"></i></button>
        <div class="max-w-6xl w-full mx-auto relative transform scale-95 transition-transform duration-300" id="lightboxContent">
            <div class="flex flex-col lg:flex-row gap-8 items-center h-full">
                <div class="w-full lg:w-2/3 h-[50vh] lg:h-[80vh] flex items-center justify-center bg-gray-900/50 rounded-2xl overflow-hidden p-2">
                    <img src="${proj.imageUrl}" class="max-h-full max-w-full object-contain drop-shadow-2xl" alt="${proj.name}" onerror="this.src='https://placehold.co/1000x800/1f2937/fff?text=Photo'">
                </div>
                <div class="w-full lg:w-1/3 text-white">
                    <span class="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">${proj.category}</span>
                    <h3 class="text-4xl md:text-5xl font-black font-space mb-6 leading-tight">${proj.name}</h3>
                    <p class="text-gray-300 mb-8 text-lg leading-relaxed">${proj.description}</p>
                    <button class="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors transform hover:-translate-y-1">Ver Estudo de Caso <i class="fa-solid fa-arrow-up-right-from-square ml-2"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Show anim
    lightbox.classList.remove('pointer-events-none');
    requestAnimationFrame(() => {
        lightbox.classList.add('opacity-100');
        document.getElementById('lightboxContent').classList.remove('scale-95');
        document.getElementById('lightboxContent').classList.add('scale-100');
    });
    document.body.style.overflow = 'hidden'; // block scroll
}

function closeLightbox() {
    const lightbox = document.getElementById('portfolioLightbox');
    if(lightbox) {
        lightbox.classList.remove('opacity-100');
        document.getElementById('lightboxContent').classList.add('scale-95');
        document.getElementById('lightboxContent').classList.remove('scale-100');
        
        setTimeout(() => {
            lightbox.classList.add('pointer-events-none');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Funções de Lightbox para Experiência
function openExperienceLightbox(expId, imgIdx) {
    const data = portfolioData;
    const exp = data.experience.find(e => e.id === expId);
    if (!exp || !exp.gallery || !exp.gallery[imgIdx]) return;
    const img = exp.gallery[imgIdx];
    const totalImgs = exp.gallery.length;
    
    let lightbox = document.getElementById('experienceLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'experienceLightbox';
        lightbox.className = 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 lg:p-12 opacity-0 transition-opacity duration-300 pointer-events-none';
        document.body.appendChild(lightbox);
    }
    
    // Botões de Navegação (se houver mais de uma imagem)
    let navButtons = '';
    if (totalImgs > 1) {
        const prevIdx = (imgIdx - 1 + totalImgs) % totalImgs;
        const nextIdx = (imgIdx + 1) % totalImgs;
        navButtons = `
            <button onclick="openExperienceLightbox('${expId}', ${prevIdx})" class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-500 text-3xl bg-black/50 hover:bg-black/80 w-12 h-12 rounded-full flex items-center justify-center transition-all z-50">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button onclick="openExperienceLightbox('${expId}', ${nextIdx})" class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-500 text-3xl bg-black/50 hover:bg-black/80 w-12 h-12 rounded-full flex items-center justify-center transition-all z-50">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;
    }
    
    lightbox.innerHTML = `
        <button onclick="closeExperienceLightbox()" class="absolute top-6 right-6 text-white text-4xl hover:text-blue-500 transition-colors z-50"><i class="fa-solid fa-xmark"></i></button>
        ${navButtons}
        <div class="max-w-6xl w-full mx-auto relative transform scale-95 transition-transform duration-300" id="experienceLightboxContent">
            <div class="flex flex-col lg:flex-row gap-8 items-center h-full">
                <div class="w-full lg:w-2/3 h-[50vh] lg:h-[80vh] flex items-center justify-center bg-gray-900/50 rounded-2xl overflow-hidden p-2 relative">
                    <img src="${img.url}" class="max-h-full max-w-full object-contain drop-shadow-2xl" alt="${img.title}" onerror="this.src='https://placehold.co/1000x800/1f2937/fff?text=Image'">
                    ${totalImgs > 1 ? `
                    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-xs font-semibold text-gray-300 border border-gray-800">
                        ${imgIdx + 1} / ${totalImgs}
                    </div>
                    ` : ''}
                </div>
                <div class="w-full lg:w-1/3 text-white">
                    <span class="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">${exp.company}</span>
                    <h4 class="text-purple-400 text-sm font-semibold tracking-wide uppercase mb-1">${exp.project}</h4>
                    <h3 class="text-4xl md:text-5xl font-black font-space mb-4 leading-tight">${img.title}</h3>
                    <p class="text-gray-300 mb-8 text-lg leading-relaxed">${img.description}</p>
                </div>
            </div>
        </div>
    `;
    
    lightbox.classList.remove('pointer-events-none');
    requestAnimationFrame(() => {
        lightbox.classList.add('opacity-100');
        const content = document.getElementById('experienceLightboxContent');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    });
    document.body.style.overflow = 'hidden';
}

function closeExperienceLightbox() {
    const lightbox = document.getElementById('experienceLightbox');
    if(lightbox) {
        lightbox.classList.remove('opacity-100');
        const content = document.getElementById('experienceLightboxContent');
        if (content) {
            content.classList.add('scale-95');
            content.classList.remove('scale-100');
        }
        
        setTimeout(() => {
            lightbox.classList.add('pointer-events-none');
            document.body.style.overflow = '';
        }, 300);
    }
}
