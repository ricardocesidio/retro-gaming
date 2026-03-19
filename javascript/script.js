/* ============================================================
   MY RETRO ROOM - SCRIPT PRINCIPAL (VERSÃO FINAL - NADA DELETADO)
   ============================================================ */
let uploadedImages = [];

/* ====================== DOM CONTENT LOADED ====================== */
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Script carregado com sucesso!");

    initTheme();
    initAuth();
    initDropdown();
    initNotifications(); // ADICIONADO: Inicia o sistema de notificações
    loadProductsFromServer();
    syncLikes();
    setupTitleFormatting();
    setupPriceFormatting();
    setupDescriptionCounter();

    // Sell page
    const mainCatSelect = document.getElementById('main-category');
    if (mainCatSelect) {
        mainCatSelect.addEventListener('change', updateSubcategories);
        updateSubcategories();
    }
    const subCatSelect = document.getElementById('sub-category');
    if (subCatSelect) subCatSelect.addEventListener('change', () => subCatSelect.setCustomValidity(""));

    // Páginas específicas
    if (document.getElementById('listing-form')) initSellPage();
    if (document.getElementById('loginForm')) initLoginPage();
    if (document.getElementById('registerForm')) initRegisterPage();
    if (document.querySelector('.messages-wrapper')) initMessages(); // NOVO: Inicia a página de mensagens

    // REVIEWS SLIDER + MENU BURGER COM ÍCONE DE GEM
    initReviewsSlider();
    initFollowSystem();
});

// ====================== INICIAR SISTEMA DE NOTIFICAÇÕES (ATUALIZADO COM IMAGENS) ======================
function initNotifications() {
    const notifBtn = document.getElementById("notifBtn");
    const notifDropdown = document.getElementById("notifDropdown");

    if (!notifBtn || !notifDropdown) return;

    // Estrutura do dropdown com avatares dos usuários
    notifDropdown.innerHTML = `
        <div class="notif-drop-header" style="padding: 15px; border-bottom: 1px solid var(--border-color); font-weight: bold; color: white;">
            Notificações Recentes
        </div>
        <div class="notif-drop-body" style="max-height: 350px; overflow-y: auto;">
            
            <div class="notif-drop-item" style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 12px;">
                <img src="../images/profilepic.jpg" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-purple);">
                <div style="font-size: 0.85rem; color: #eee; line-height: 1.4;">
                    <strong style="color: var(--accent-purple);">João Gamer</strong> curtiu o seu item "Mega Drive".
                    <span style="display: block; font-size: 0.75rem; color: #888;">Há 2 min</span>
                </div>
            </div>

            <div class="notif-drop-item" style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 12px;">
                <img src="../images/profilepic.jpg" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-purple);">
                <div style="font-size: 0.85rem; color: #eee; line-height: 1.4;">
                    <strong style="color: var(--accent-purple);">Maria Retro</strong> enviou uma mensagem sobre "GameBoy Color".
                    <span style="display: block; font-size: 0.75rem; color: #888;">Há 1 hora</span>
                </div>
            </div>

            <div class="notif-drop-item" style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--accent-purple); display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fa-solid fa-check" style="font-size: 0.9rem;"></i>
                </div>
                <div style="font-size: 0.85rem; color: #eee; line-height: 1.4;">
                    <strong style="color: var(--accent-purple);">Sistema:</strong> O seu anúncio "PS1 Fat" foi aprovado!
                    <span style="display: block; font-size: 0.75rem; color: #888;">Há 3 horas</span>
                </div>
            </div>

        </div>
        <a href="../html/notifications.html" class="notif-view-all" style="display: block; text-align: center; padding: 12px; color: var(--accent-purple); text-decoration: none; font-weight: bold; font-size: 0.85rem; border-top: 1px solid var(--border-color); transition: 0.3s; background: rgba(0,0,0,0.2);">
            Ver todas as notificações
        </a>
    `;

    // Efeito hover no link "Ver notificações"
    const viewAllLink = notifDropdown.querySelector('.notif-view-all');
    viewAllLink.addEventListener('mouseover', () => viewAllLink.style.background = 'rgba(157, 80, 187, 0.1)');
    viewAllLink.addEventListener('mouseout', () => viewAllLink.style.background = 'rgba(0,0,0,0.2)');
}

// ====================== INICIAR SISTEMA DE MENSAGENS ======================
function initMessages() {

    const chatItems = document.querySelectorAll('.chat-item');
    const chatHistory = document.querySelector('.chat-history');

    const headerName = document.getElementById('header-prod-name');
    const headerPrice = document.getElementById('header-prod-price');
    const headerImg = document.getElementById('header-prod-img');

    chatItems.forEach(item => {

        item.addEventListener('click', function () {

            // remover active de todos
            chatItems.forEach(c => c.classList.remove('active'));

            // ativar o clicado
            this.classList.add('active');

            // dados do item
            const name = this.dataset.name || "";
            const product = this.dataset.product || "";
            const price = this.dataset.price || "";
            const img = this.dataset.img || "";

            // atualizar header
            if (headerName) headerName.innerText = product;
            if (headerPrice) headerPrice.innerText = price;
            if (headerImg) headerImg.src = img;

            // limpar histórico
            if (chatHistory) {
                chatHistory.innerHTML = `
                    <div class="message-bubble message-received">
                        Olá! Sou o ${name}. Ainda tens o ${product} disponível?
                        <span class="msg-time">Agora</span>
                    </div>
                `;
            }

        });

    });

}


// ====================== ENVIAR MENSAGEM ======================
function initSendMessage() {

    const sendBtn = document.querySelector('.btn-send');
    const chatInput = document.querySelector('.chat-input');
    const chatHistory = document.querySelector('.chat-history');

    if (!sendBtn || !chatInput || !chatHistory) return;

    function sendMessage() {

        const text = chatInput.value.trim();
        if (text === "") return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const time = `${hours}:${minutes}`;

        const message = document.createElement("div");
        message.className = "message-bubble message-sent";

        message.innerHTML = `
            ${text}
            <span class="msg-time">${time}</span>
        `;

        chatHistory.appendChild(message);

        chatHistory.scrollTop = chatHistory.scrollHeight;

        chatInput.value = "";

    }

    sendBtn.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

}


// ====================== INICIAR TUDO ======================
// SIDEBAR PERFEITA - ÚNICO E SEM CONFLITOS
document.addEventListener('DOMContentLoaded', function() {
    console.log('🟣 Sidebar ativa corrigida!');
    
    const sidebarItems = document.querySelectorAll('.sidebar .side-item');
    
    // 1. Remove active de TODOS ao clicar em qualquer item
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            console.log('🟣 Clicou:', this.href);
            
            // Remove active de TODOS
            sidebarItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Adiciona active APENAS no clicado
            this.classList.add('active');
        });
    });
    
    // 2. Ativa página atual baseado na URL
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('📄 Página atual:', currentPage);
        
        sidebarItems.forEach(item => {
            const itemPage = item.href.split('/').pop();
            if (itemPage === currentPage) {
                item.classList.add('active');
                console.log('✅ Ativado:', itemPage);
            }
        });
    }, 100);
});


/* ====================== AUTENTICAÇÃO ====================== */
function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const profileContainer = document.getElementById('userProfile');
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const currentUser = sessionStorage.getItem('currentUser');

    if (isLoggedIn && currentUser) {
        if (loginBtn) loginBtn.classList.add('is-hidden');
        if (profileContainer) profileContainer.classList.add('is-visible');
        if (userNameSpan) userNameSpan.textContent = currentUser;
    } else {
        if (loginBtn) loginBtn.classList.remove('is-hidden');
        if (profileContainer) profileContainer.classList.remove('is-visible');
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.reload();
        });
    }
}

/* ====================== DROPDOWN ====================== */
function initDropdown() {
    const trigger = document.getElementById('profileTrigger');
    const menu = document.getElementById('profileDropdown');

    if (trigger && menu) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    }
}

/* ====================== TEMA ====================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeBtn) {
        themeBtn.checked = (currentTheme === 'light');
        themeBtn.addEventListener('change', () => {
            let newTheme = themeBtn.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/* ====================== FORMATAÇÕES ====================== */
function setupTitleFormatting() {
    const titleInput = document.getElementById('title-input');
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
            }
            if (this.value.length >= 10) this.setCustomValidity("");
        });
    }
}

function setupPriceFormatting() {
    const priceInput = document.getElementById('price-input');
    if (priceInput) {
        priceInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value !== '') value = parseInt(value, 10).toLocaleString('pt-BR');
            e.target.value = value;
        });
    }
}

function setupDescriptionCounter() {
    const descInput = document.getElementById('desc-input');
    const descCount = document.getElementById('desc-char-count');
    if (descInput && descCount) {
        descInput.addEventListener('input', () => {
            descCount.innerText = descInput.value.length;
            descInput.setCustomValidity("");
        });
    }
}

/* ====================== SUBCATEGORIAS ====================== */
function updateSubcategories() {
    const mainCatElement = document.getElementById('main-category');
    const subCatWrapper = document.getElementById('subcategory-wrapper');
    const subCatSelect = document.getElementById('sub-category');

    if (!mainCatElement || !subCatWrapper || !subCatSelect) return;

    const mainCat = mainCatElement.value;
    subCatSelect.innerHTML = "";
    subCatSelect.setCustomValidity("");

    const subData = { 
        "Consoles": ["Atari 2600", "Dreamcast", "Game Boy / Color", "Game Boy Advance", "GameCube", "Master System", "Mega Drive / Genesis", "Nintendo 3DS / 2DS", "Nintendo 64", "Nintendo DS", "Nintendo Switch", "NES", "PlayStation 1", "PlayStation 2", "PlayStation 3", "PlayStation 4", "PlayStation 5", "PS Vita", "PSP", "Sega Saturn", "SNES", "Wii", "Wii U", "Xbox (Classic)", "Xbox 360", "Xbox One", "Xbox Series X/S"],
        "Games": ["Nintendo Switch Games", "PlayStation 5 Games", "PlayStation 4 Games", "PlayStation 3 Games", "PlayStation 2 Games", "PlayStation 1 Games", "Xbox Series X/S Games", "Xbox One Games", "Xbox 360 Games", "Super Nintendo Games", "Nintendo 64 Games", "GameCube Games", "Mega Drive Games", "Game Boy / GBA Games", "PC Games (Physical)"],
        "Accessories": ["Adapters", "Cables", "Controllers", "Cases/Bags", "Memory Cards"],
        "Apparel": ["Cosplay", "Graphic T-Shirts", "Hats", "Hoodies", "Pins & Badges"],
        "Arcade": ["Arcade Cabinets", "Arcade Sticks", "JAMMA Boards", "Pinball Machines"],
        "Books": ["Artbooks", "Comics/Graphic Novels", "Manga", "Retro Magazines", "Strategy Guides"],
        "Collectibles": ["Action Figures", "Funko Pop", "Posters", "Statues", "Keychains"],
        "PC Gaming": ["Big Box Games", "CD-ROM Games", "Graphic Cards (GPUs)", "Mechanical Keyboards", "Processors (CPUs)"],
        "Repair & Modding": ["Capacitor Kits", "Custom Shells", "IPS Screens", "Soldering Tools"],
        "Trading": ["Digimon", "Magic: The Gathering", "One Piece", "Pokémon", "Yu-Gi-Oh!"]
    };

    if (subData[mainCat] && mainCat !== "") {
        subCatWrapper.style.display = "block";
        subCatSelect.required = true;
        subCatSelect.innerHTML = `<option value="">Select Platform / Subcategory</option>`;
        subData[mainCat].sort().forEach(item => {
            let opt = document.createElement('option');
            opt.value = item;
            opt.innerHTML = item;
            subCatSelect.appendChild(opt);
        });
    } else {
        subCatWrapper.style.display = "none";
        subCatSelect.required = false;
        subCatSelect.value = "";
    }
}

/* ====================== GALERIA + VALIDAÇÃO + ENVIO ====================== */
const fileUpload = document.getElementById('file-upload');
const previewGrid = document.getElementById('preview-grid');
const countDisplay = document.getElementById('count');
const photoHelper = document.getElementById('photo-helper');

if (fileUpload && previewGrid) {
    fileUpload.addEventListener('change', function() {
        const files = Array.from(this.files);
        if (uploadedImages.length + files.length > 10) {
            alert("Maximum of 10 images allowed.");
            return;
        }
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Image = e.target.result;
                uploadedImages.push(base64Image);
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `<img src="${base64Image}"><button type="button" class="remove-btn" onclick="removePhoto(this, '${base64Image}')">×</button>`;
                previewGrid.appendChild(div);
                if(countDisplay) countDisplay.innerText = uploadedImages.length;
                if (photoHelper) photoHelper.setCustomValidity("");
            };
            reader.readAsDataURL(file);
        });
        this.value = "";
    });
}

window.removePhoto = function(btn, imgData) {
    btn.parentElement.remove();
    uploadedImages = uploadedImages.filter(img => img !== imgData);
    if(countDisplay) countDisplay.innerText = uploadedImages.length;
    if (uploadedImages.length === 0 && photoHelper) {
        photoHelper.setCustomValidity("Please upload at least one photo.");
    }
};

const listingForm = document.getElementById('listing-form');
if (listingForm) {
    listingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log("Formulário submetido! Iniciando validação...");

        const titleInput = document.getElementById('title-input');
        const subCatSelect = document.getElementById('sub-category');
        const subCatWrapper = document.getElementById('subcategory-wrapper');
        const mainCat = document.getElementById('main-category');
        const conditionSelect = document.getElementById('item-condition');
        const priceInput = document.getElementById('price-input');
        const descInput = document.getElementById('desc-input');

        [titleInput, subCatSelect, mainCat, conditionSelect, priceInput, descInput].forEach(el => el.setCustomValidity(""));
        if (photoHelper) photoHelper.setCustomValidity("");

        if (uploadedImages.length === 0) {
            if (photoHelper) photoHelper.setCustomValidity("Envie pelo menos 1 foto.");
            photoHelper.reportValidity();
            return;
        }
        if (titleInput.value.trim().length < 10) {
            titleInput.setCustomValidity("Título muito curto (mínimo 10 caracteres)");
            titleInput.reportValidity();
            return;
        }
        if (priceInput.value.trim() === "") {
            priceInput.setCustomValidity("Preço obrigatório");
            priceInput.reportValidity();
            return;
        }
        if (mainCat.value === "") {
            mainCat.setCustomValidity("Selecione uma categoria");
            mainCat.reportValidity();
            return;
        }
        if (subCatWrapper.style.display === "block" && subCatSelect.value === "") {
            subCatSelect.setCustomValidity("Selecione uma subcategoria");
            subCatSelect.reportValidity();
            return;
        }
        if (conditionSelect.value === "") {
            conditionSelect.setCustomValidity("Selecione a condição");
            conditionSelect.reportValidity();
            return;
        }
        if (descInput.value.trim() === "") {
            descInput.setCustomValidity("Descrição obrigatória");
            descInput.reportValidity();
            return;
        }

        const currentUser = sessionStorage.getItem('currentUser') || "Anônimo";

        const newProduct = {
            name: titleInput.value,
            price: `$${priceInput.value.replace(/\./g, ',')}`,
            img: uploadedImages[0] || "",
            category: mainCat.value,
            subcategory: subCatSelect.value || "",
            condition: conditionSelect.value,
            description: descInput.value,
            owner: currentUser
        };

        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                alert("Publicado com sucesso!");
                window.location.href = "index.html";
            } else {
                alert("Erro ao publicar (servidor respondeu " + response.status + ")");
            }
        } catch (err) {
            alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
        }
    });
}

/* ====================== CARREGAMENTO E LIKES ====================== */
async function loadProductsFromServer() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        const currentUser = sessionStorage.getItem('currentUser');

        grid.innerHTML = "";
        products.forEach(item => {
            const isOwner = currentUser && item.owner === currentUser;

            grid.innerHTML += `
                <div class="card ${isOwner ? 'owned' : ''}">
                    <div class="like-container"><i class="fa-regular fa-heart like-icon"></i></div>
                    ${isOwner ? `
                        <button class="edit-btn" onclick="editProduct(${item.id})">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    ` : ''}
                    <img src="${item.img}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price}</p>
                    <button class="btn-view" onclick="window.location.href='product.html?id=${item.id}'">View Item</button>
                </div>`;
        });
        syncLikes();
    } catch (error) { console.error(error); }
}

function syncLikes() {
    const favorites = JSON.parse(localStorage.getItem('myRetroLikes')) || [];
    document.querySelectorAll('.card').forEach(card => {
        const h3 = card.querySelector('h3');
        const icon = card.querySelector('.like-icon');
        if (h3 && icon && favorites.some(item => item.name === h3.innerText)) {
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.classList.add('liked');
        }
    });
}

document.addEventListener('click', (e) => {
    const likeContainer = e.target.closest('.like-container');
    if (likeContainer) {
        const icon = likeContainer.querySelector('.like-icon');
        const card = likeContainer.closest('.card');
        if (!card) return;
        const productData = {
            name: card.querySelector('h3').innerText,
            price: card.querySelector('.price').innerText,
            img: card.querySelector('img').src
        };
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('liked');
        let favs = JSON.parse(localStorage.getItem('myRetroLikes')) || [];
        if (icon.classList.contains('liked')) favs.push(productData);
        else favs = favs.filter(i => i.name !== productData.name);
        localStorage.setItem('myRetroLikes', JSON.stringify(favs));
    }
});

/* ====================== LOGIN PAGE ====================== */
function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;
        const stored = JSON.parse(localStorage.getItem('registeredUser'));
        if (stored && stored.email === email && stored.password === pass) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('currentUser', stored.username);
            window.location.href = "index.html";
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });
}

/* ====================== REGISTER PAGE ====================== */
function initRegisterPage() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const userData = {
            username: document.getElementById('regUser').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPass').value
        };
        localStorage.setItem('registeredUser', JSON.stringify(userData));
        document.getElementById('form-state').style.display = 'none';
        document.getElementById('success-state').style.display = 'block';
        document.getElementById('display-user').textContent = userData.username;
    });
}

/* ====================== SISTEMA DE FOLLOW ====================== */
function initFollowSystem() {
    const followBtn = document.getElementById('btnFollow');
    if (!followBtn) return;

    const currentUser = sessionStorage.getItem('currentUser') || "Ricardo C.";
    const profileUsername = document.getElementById('displayUsername').innerText;

    let followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || [];

    if (profileUsername === currentUser) {
        followBtn.textContent = "Edit Profile";
        followBtn.classList.add('edit');
        followBtn.disabled = true;
        return;
    }

    function updateFollowUI() {
        const isFollowing = followedUsers.includes(profileUsername);
        followBtn.textContent = isFollowing ? "Following" : "Follow";
        followBtn.classList.toggle('following', isFollowing);

        const followingCount = document.getElementById('following-count');
        const followingCountSmall = document.getElementById('following-count-small');
        if(followingCount) followingCount.textContent = followedUsers.length;
        if(followingCountSmall) followingCountSmall.textContent = followedUsers.length;

        const list = document.getElementById('following-list');
        if(list) {
            list.innerHTML = followedUsers.map(user => `
                <div class="follow-item">
                    <img src="../images/profilepic.jpg" style="width:24px;height:24px;border-radius:50%;">
                    <span>${user}</span>
                </div>
            `).join('');
        }
    }

    followBtn.addEventListener('click', () => {
        if (followedUsers.includes(profileUsername)) {
            followedUsers = followedUsers.filter(u => u !== profileUsername);
        } else {
            followedUsers.push(profileUsername);
        }
        localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
        updateFollowUI();
    });

    updateFollowUI();
}

/* ====================== REVIEWS SLIDER ====================== */
function initReviewsSlider() {
    const container = document.getElementById('sliderContainer');
    if (!container) return;

    let currentSlide = 0;
    const slides = container.querySelectorAll('.review-card');

    const ratings = [5, 4, 5];

    slides.forEach((card, index) => {
        const rating = ratings[index] || 5;
        card.dataset.rating = rating;

        const gemsDiv = document.createElement('div');
        gemsDiv.className = 'review-gems';
        gemsDiv.style.cssText = 'margin-top: 12px; display: flex; gap: 5px;';
        for (let i = 1; i <= 5; i++) {
            const gem = document.createElement('i');
            gem.className = `fa-solid fa-gem ${i <= rating ? 'filled' : ''}`;
            gem.style.fontSize = '1.15rem';
            gemsDiv.appendChild(gem);
        }
        card.appendChild(gemsDiv);
    });

    const sliderSection = document.querySelector('.reviews-slider');
    const burgerHTML = `
        <div class="review-filter-burger" style="margin-bottom:20px; display:flex; align-items:center; gap:10px;">
            <span style="font-weight:bold; color:var(--text-muted);">Filtrar reviews por nota:</span>
            
            <div class="burger-wrapper" style="position:relative;">
                <button id="gemBurgerBtn" style="background:none; border:none; font-size:1.5rem; cursor:pointer; padding:5px 10px; border-radius:8px; color:#00d4ff;">
                    <i class="fa-solid fa-gem"></i>
                </button>
                
                <div id="gemDropdown" style="display:none; position:absolute; top:300%; transform:translateY(-50%); left:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:6px; min-width:200px; box-shadow:0 8px 25px rgba(0,0,0,0.6); z-index:100;">
                    <div class="gem-option active" data-rating="all" style="padding:5px 10px; border-radius:6px; cursor:pointer; font-size:0.8rem;">Todas as notas</div>
                    ${[1,2,3,4,5].map(n => `
                        <div class="gem-option" data-rating="${n}" style="padding:6px 12px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:0.9rem;">
                            ${Array(n).fill('<i class="fa-solid fa-gem" style="color:#00d4ff; font-size:1rem;"></i>').join('')}
                            <span>${n} Gem${n > 1 ? 's' : ''}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    sliderSection.insertAdjacentHTML('afterbegin', burgerHTML);

    const burgerBtn = document.getElementById('gemBurgerBtn');
    const dropdown = document.getElementById('gemDropdown');

    burgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => dropdown.style.display = 'none');

    document.querySelectorAll('.gem-option').forEach(option => {
        option.addEventListener('click', () => {
            const selected = option.dataset.rating;
            document.querySelectorAll('.gem-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            slides.forEach(slide => {
                slide.style.display = (selected === "all" || parseInt(slide.dataset.rating) === parseInt(selected)) ? 'block' : 'none';
            });

            currentSlide = 0;
            showSlide();
            dropdown.style.display = 'none';
        });
    });

    function showSlide() {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    window.moveSlide = function(step) {
        currentSlide = (currentSlide + step + slides.length) % slides.length;
        showSlide();
    };

    const pauseBtn = document.getElementById('pauseBtn');
    let isPaused = false;
    let autoPlay = setInterval(() => {
        if (!isPaused) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide();
        }
    }, 5000);

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.innerHTML = isPaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
        });
    }
}

function editProduct(productId) {
    window.location.href = `edit-product.html?id=${productId}`;
}

function initChatOptions(){

    const infoBtn = document.querySelector(".info-btn");
    const menu = document.querySelector(".options-menu");

    if(!infoBtn || !menu) return;

    infoBtn.addEventListener("click", function(e){
        e.stopPropagation();
        menu.classList.toggle("active");
    });

    document.querySelectorAll(".option-item").forEach(option => {

        option.addEventListener("click", function(){

            const action = this.dataset.action;

            if(action === "report"){
                alert("User reported.");
            }

            if(action === "delete"){
                alert("Chat deleted.");
            }

            if(action === "block"){
                alert("User blocked.");
            }

            menu.classList.remove("active");

        });

    });

    document.addEventListener("click", function(){
        menu.classList.remove("active");
    });

}
const cameraBtn = document.querySelector(".camera-btn");
const imageInput = document.getElementById("imageInput");

if(cameraBtn && imageInput){

cameraBtn.addEventListener("click", () => {
imageInput.click();
});

imageInput.addEventListener("change", function(){

const file = this.files[0];

if(!file) return;

console.log("Imagem selecionada:", file.name);

});

}

document.addEventListener("DOMContentLoaded", function(){

const infoBtn = document.querySelector(".info-button");
const menu = document.querySelector(".chat-dropdown");

if(!infoBtn) return;

infoBtn.addEventListener("click", function(e){
e.stopPropagation();
menu.classList.toggle("active");
});

document.querySelectorAll(".chat-option").forEach(option=>{

option.addEventListener("click", function(){

const action = this.dataset.action;

if(action==="report"){
alert("User reported");
}

if(action==="block"){
alert("User blocked");
}

if(action==="delete"){
alert("Chat deleted");
}

menu.classList.remove("active");

});

});

document.addEventListener("click", function(){
menu.classList.remove("active");
});

});

// Seleciona botão e dropdown
const notifBtn = document.getElementById("notifBtn");
const notifDropdown = document.getElementById("notifDropdown");

// Abrir/fechar dropdown ao clicar no sino
notifBtn.addEventListener("click", (e) => {
    e.preventDefault();
    notifDropdown.classList.toggle("active");
});

// Fechar dropdown ao clicar fora
document.addEventListener("click", (e) => {
    if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
        notifDropdown.classList.remove("active");
    }

    
});

// SIDEBAR - CORRIGE O PROBLEMA DO BELL SEMPRE ATIVO (VERSÃO FINAL - AGORA PROFILE NÃO ATIVA O BELL)
document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar .side-item');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 1. REMOVE "active" DE TODOS os itens da sidebar
            sidebarItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // 2. ADICIONA "active" SÓ no item clicado
            this.classList.add('active');
        });
    });
    
    // 3. ATIVA o item da página atual (baseado na URL) - VERSÃO MAIS FORTE PARA EVITAR CONFLITO COM BELL
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        sidebarItems.forEach(item => {
            const itemPage = item.getAttribute('href').split('/').pop();
            
            if (itemPage === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');   // força limpeza extra
            }
        });
    }, 150);
});