
const products = [
    {
        id: 1,
        name: "DROPP Gunung Premium",
        price: 2500000,
        category: "gunung",
        image: "images/sepeda1.jpg", 
        description: "Sepeda gunung dengan frame aluminium berkualitas tinggi, cocok untuk medan berbatu dan tanjakan."
    },
    {
        id: 2,
        name: "TREK Gunung Pro",
        price: 5500000,
        category: "gunung",
        image: "images/sepeda2.jpg", 
        description: "Sepeda gunung profesional dengan sistem suspensi canggih untuk petualangan ekstrim."
    },
    {
        id: 3,
        name: "KYKLOS CM Sport",
        price: 1999000,
        category: "gunung",
        image: "images/sepeda3.jpg", 
        description: "Sepeda gunung entry-level dengan performa handal untuk pemula."
    },
    {
        id: 4,
        name: "RIOSOUTH Lipat Compact",
        price: 4500000,
        category: "lipat",
        image: "images/sepeda4.jpg", 
        description: "Sepeda lipat premium dengan desain kompak dan mudah dibawa ke mana saja."
    },
    {
        id: 5,
        name: "United Roar 16",
        price: 1800000,
        category: "lipat",
        image: "images/sepeda5.jpg", 
        description: "Sepeda lipat dengan roda 16 inci, ringan dan praktis untuk perjalanan sehari-hari."
    },
    {
        id: 6,
        name: "BTWIN Anak 14 Inch",
        price: 1200000,
        category: "anak",
        image: "images/sepeda6.jpg", 
        description: "Sepeda anak dengan desain 2-in-1, dilengkapi roda bantu yang dapat dilepas."
    },
    {
        id: 7,
        name: "WIM CYCLE NEO BMX",
        price: 2200000,
        category: "anak",
        image: "images/sepeda7.jpg", 
        description: "Sepeda BMX untuk anak dengan frame kuat dan desain yang menarik."
    },
    {
        id: 8,
        name: "Cube Cubie 160",
        price: 2800000,
        category: "anak",
        image: "images/sepeda8.jpg", 
        description: "Sepeda anak premium dengan teknologi terdepan dan desain yang ergonomis."     
    },
    {
        id: 9,
        name: "DARKSIDE 400 CF Aero Drop Bar",
        price: 8500000,
        category: "road",
        image: "images/sepeda9.jpg", 
        description: "Sepeda road bike profesional dengan frame carbon fiber dan komponen balap berkualitas tinggi untuk kecepatan maksimal."
    }
    

];


let cart = [];


document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartCount();
    addNotificationStyles();
});


function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .simple-notification {
            position: fixed;
            top: 20px;
            right: -350px;
            width: 320px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            transition: all 0.3s ease;
            border-left: 4px solid #28a745;
        }

        .simple-notification.show {
            right: 20px;
        }

        .notification-content {
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .notification-icon {
            color: #28a745;
            font-size: 1.5rem;
        }

        .notification-text {
            flex: 1;
        }

        .notification-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 3px;
            font-size: 0.9rem;
        }

        .notification-message {
            color: #6c757d;
            font-size: 0.8rem;
        }

        .notification-close {
            color: #999;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 5px;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .notification-close:hover {
            color: #666;
            background: #f8f9fa;
        }

        .btn-success-pulse {
            animation: successPulse 0.6s ease;
        }

        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); background: #28a745; }
            100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
            .simple-notification {
                width: calc(100% - 40px);
                right: -100%;
            }
            .simple-notification.show {
                right: 20px;
            }
        }

        /* Enhanced product image styles */
        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s ease;
            border-radius: 10px 10px 0 0;
        }

        .product-card:hover .product-image {
            transform: scale(1.02);
        }

        /* Loading state for images */
        .product-image-loading {
            background: linear-gradient(90deg, #f0f4f8 25%, #e3e8ef 50%, #f0f4f8 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
}


function showNotification(title, message, type = 'success') {
   
    const existing = document.querySelector('.simple-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'simple-notification';
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 
                     type === 'warning' ? 'fa-exclamation-triangle' : 
                     'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconClass} notification-icon"></i>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <i class="fas fa-times notification-close" onclick="closeNotification()"></i>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    
    setTimeout(() => {
        closeNotification();
    }, 3000);
}


function closeNotification() {
    const notification = document.querySelector('.simple-notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}


function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        
        const fallbackSVG = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect fill='%23f0f4f8' width='400' height='300'/><circle fill='%23667eea' cx='200' cy='150' r='80'/><text x='200' y='155' text-anchor='middle' fill='white' font-size='16'>Sepeda</text></svg>`;
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image" 
                     onload="this.classList.remove('product-image-loading')"
                     onerror="this.src='${fallbackSVG}'; this.classList.remove('product-image-loading');"
                     onloadstart="this.classList.add('product-image-loading')">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}


function filterProducts(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('Berhasil!', `${product.name} jumlahnya ditambah di keranjang`);
    } else {
        cart.push({...product, quantity: 1});
        showNotification('Ditambahkan!', `${product.name} berhasil ditambah ke keranjang`);
    }

    updateCartCount();
    
    const button = event.target.closest('.btn-primary');
    if (button) {
        button.classList.add('btn-success-pulse');
        setTimeout(() => {
            button.classList.remove('btn-success-pulse');
        }, 600);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}


function openCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Keranjang kosong</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                    </div>
                    <div>
                        <button onclick="removeFromCart(${item.id})" class="btn-secondary">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    cartTotal.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
    modal.style.display = 'block';
}


function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}


function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    openCart(); 
    showNotification('Dihapus!', `${product.name} dihapus dari keranjang`, 'warning');
}


function checkout() {
    if (cart.length === 0) {
        showNotification('Perhatian!', 'Keranjang masih kosong', 'warning');
        return;
    }

   
    const cartData = encodeURIComponent(JSON.stringify(cart));
    
  
    window.location.href = `transaksi.html?cart=${cartData}`;
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
}