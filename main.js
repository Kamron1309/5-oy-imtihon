// API and state management
const API = "https://68a6b3c3639c6a54e99f8b80.mockapi.io/dustim/market1";
let card = document.getElementById("card");
let shop_cart = document.getElementById("shop_cart");
let shop = JSON.parse(localStorage.getItem("shop")) || [];
let likes = JSON.parse(localStorage.getItem("likes")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// DOM Elements
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const wishlistCount = document.getElementById("wishlistCount");
const wishlistBtn = document.getElementById("wishlistBtn");
const gridView = document.getElementById("gridView");
const listView = document.getElementById("listView");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const closeRegisterModal = document.getElementById("closeRegisterModal");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showLoginModal = document.getElementById("showLoginModal");

// Initialize
updateCartCount();
updateWishlistCount();

// Event Listeners
cartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("translate-x-full");
  cartOverlay.classList.remove("hidden");
});

closeCart.addEventListener("click", () => {
  cartSidebar.classList.add("translate-x-full");
  cartOverlay.classList.add("hidden");
});

cartOverlay.addEventListener("click", () => {
  cartSidebar.classList.add("translate-x-full");
  cartOverlay.classList.add("hidden");
});

gridView.addEventListener("click", () => {
  card.classList.remove("grid-cols-1");
  card.classList.add("products-grid");
});

listView.addEventListener("click", () => {
  card.classList.remove("products-grid");
  card.classList.add("grid-cols-1");
});

showLoginModal.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});

closeLoginModal.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

closeRegisterModal.addEventListener("click", () => {
  registerModal.classList.add("hidden");
});

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.classList.add("hidden");
  registerModal.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerModal.classList.add("hidden");
  loginModal.classList.remove("hidden");
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Simple validation (in a real app, you'd verify against a backend)
  if (email && password) {
    currentUser = { email, name: email.split('@')[0] };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    loginModal.classList.add("hidden");
    alert(`Xush kelibsiz, ${currentUser.name}!`);
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (name && email && password) {
    currentUser = { email, name };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    registerModal.classList.add("hidden");
    alert(`Xush kelibsiz, ${name}!`);
  }
});

wishlistBtn.addEventListener("click", () => {
  if (!currentUser) {
    loginModal.classList.remove("hidden");
    return;
  }
  alert("Sevimlilar ro'yxati ochiladi");
  // Implement wishlist view functionality
});

// Functions
function updateCartCount() {
  cartCount.textContent = shop.length;
  if (shop.length > 0) {
    cartCount.classList.remove("hidden");
  } else {
    cartCount.classList.add("hidden");
  }
}

function updateWishlistCount() {
  wishlistCount.textContent = likes.length;
  if (likes.length > 0) {
    wishlistCount.classList.remove("hidden");
  } else {
    wishlistCount.classList.add("hidden");
  }
}

function updateCartTotal() {
  const total = shop.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toLocaleString() + " so'm";
}

const getData = async () => {
  try {
    const res = await fetch(API);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Ma'lumotlarni olishda xatolik:", error);
    return [];
  }
};

getData().then((res) => addUI(res));

function addUI(data) {
  card.innerHTML = "";
  data.forEach((element) => {
    const isLiked = likes.includes(element.id);
    let div = document.createElement("div");
    div.className = "bg-white rounded-lg shadow-md overflow-hidden fade-in";
    div.innerHTML = `
      <div class="w-full relative">
        <img src="${element.img}" alt="${element.title}" class="w-full h-48 object-cover" />
        <div class="absolute top-2 right-2 flex flex-col gap-2">
          <button class="like-btn p-1 bg-white rounded-full shadow-md ${isLiked ? 'text-red-500' : 'text-gray-500'}" data-id="${element.id}">
            <i class="fas fa-heart"></i>
          </button>
          <button class="quick-view-btn p-1 bg-white rounded-full shadow-md text-gray-500" data-id="${element.id}">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-primary text-lg font-bold">${element.price.toLocaleString()} so'm</h3>
        <span class="bg-yellow-300 px-2 py-1 text-xs mt-2 inline-block rounded">${element.month.toLocaleString()} so'm/oyiga</span>
        <h2 class="text-sm my-2 font-semibold">${element.title}</h2>
        <p class="text-gray-600 text-xs">${element.description.slice(0, 50)}...</p>

        <div class="flex items-center gap-1 my-2">
          <i class="fas fa-star text-secondary"></i>
          <p class="text-xs">${element.rate}</p>
        </div>
        <button
          id="${element.id}"
          class="shop-btn w-full h-10 rounded-xl bg-primary text-white hover:bg-purple-800 transition-colors"
        >
          Savatga
        </button>
      </div>
    `;
    card.append(div);
  });

  // Add event listeners to like buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!currentUser) {
        loginModal.classList.remove("hidden");
        return;
      }

      const productId = e.currentTarget.getAttribute('data-id');
      if (likes.includes(productId)) {
        likes = likes.filter(id => id !== productId);
        e.currentTarget.classList.remove('text-red-500');
        e.currentTarget.classList.add('text-gray-500');
      } else {
        likes.push(productId);
        e.currentTarget.classList.remove('text-gray-500');
        e.currentTarget.classList.add('text-red-500');
      }
      localStorage.setItem("likes", JSON.stringify(likes));
      updateWishlistCount();
    });
  });

  // Add event listeners to quick view buttons
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('data-id');
      const product = data.find(item => item.id === productId);
      alert(`${product.title}\n\nNarxi: ${product.price.toLocaleString()} so'm\n\n${product.description}`);
    });
  });

  // Add event listeners to add to cart buttons
  document.querySelectorAll('.shop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const product = data.find(item => item.id === e.target.id);
      const existingItem = shop.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        product.quantity = 1;
        shop.push(product);
      }

      localStorage.setItem("shop", JSON.stringify(shop));
      updateCartCount();
      addUiShop(shop);
      updateCartTotal();

      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
      notification.textContent = `${product.title} savatga qo'shildi!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    });
  });
}

function addUiShop(data) {
  shop_cart.innerHTML = "";
  if (data.length === 0) {
    shop_cart.innerHTML = '<p class="text-center text-gray-500 py-8">Savatda mahsulot yoʻq</p>';
    return;
  }

  data.forEach((value) => {
    let div = document.createElement("div");
    div.className = "border rounded-lg p-4 bg-white";
    div.innerHTML = `
      <div class="flex items-center justify-between gap-4">
        <img src="${value.img}" alt="${value.title}" class="w-20 h-20 object-contain" />
        
        <div class="flex-1">
          <h3 class="font-semibold text-sm">${value.title}</h3>
          <p class="text-primary font-bold mt-1">${value.price.toLocaleString()} so'm</p>
          
          <div class="flex items-center mt-2">
            <button class="decrement-btn px-2 py-1 bg-gray-200 rounded-l" data-id="${value.id}">-</button>
            <span class="quantity px-3 py-1 bg-gray-100">${value.quantity}</span>
            <button class="increment-btn px-2 py-1 bg-gray-200 rounded-r" data-id="${value.id}">+</button>
            
            <button class="remove-btn ml-4 text-red-500 text-sm" data-id="${value.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    shop_cart.append(div);
  });

  // Add event listeners to quantity buttons
  document.querySelectorAll('.increment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      const product = shop.find(item => item.id === productId);
      product.quantity += 1;
      localStorage.setItem("shop", JSON.stringify(shop));
      addUiShop(shop);
      updateCartTotal();
    });
  });

  document.querySelectorAll('.decrement-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      const product = shop.find(item => item.id === productId);
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        shop = shop.filter(item => item.id !== productId);
      }
      localStorage.setItem("shop", JSON.stringify(shop));
      addUiShop(shop);
      updateCartCount();
      updateCartTotal();
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.closest('.remove-btn').getAttribute('data-id');
      shop = shop.filter(item => item.id !== productId);
      localStorage.setItem("shop", JSON.stringify(shop));
      addUiShop(shop);
      updateCartCount();
      updateCartTotal();
    });
  });

  updateCartTotal();
}

// Initialize shop view
addUiShop(shop);