// Carrinho salvo localmente
let cart = JSON.parse(localStorage.getItem("pcmaster_cart")) || [];

function addToCart(productId) {
  const products = {
    1: { id: "1", name: "PC Gamer RTX 4070 Super", price: 4999, image: "/IMG2.png" },
    2: { id: "2", name: "Workstation Pro Creator", price: 7299, image: "/IMG.png" },
    3: { id: "3", name: "PC Entry Level Gamer", price: 1899, image: "/IMG4.png" },
    4: { id: "4", name: "PC Extreme Gaming 4K", price: 12999, image: "/IMG5.png" },
    5: { id: "5", name: "Working Pro Creator", price: 10599, image: "/IMG3.png" },
    6: { id: "6", name: "Workstation Compact", price: 3499, image: "/IMG6.png" },
  };

  const product = products[productId];
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("pcmaster_cart", JSON.stringify(cart));
  updateCartDisplay();
  showCartNotification(product.name);
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? "block" : "none";
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem("pcmaster_cart", JSON.stringify(cart));
    updateCartDisplay();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("pcmaster_cart", JSON.stringify(cart));
  updateCartDisplay();
}

function showCartNotification(productName) {
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${productName} adicionado ao carrinho!</span>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Inicializar os botões "Adicionar ao Carrinho"
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtns = document.querySelectorAll(".add-to-cart");
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.getAttribute("data-product-id");
      addToCart(productId);

      // Feedback visual
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
      this.style.background = "#10b981";
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = "";
        this.disabled = false;
      }, 2000);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buyNowBtns = document.querySelectorAll(".buy-now");
  buyNowBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.previousElementSibling.getAttribute("data-product-id");
      addToCart(productId);
      window.location.href = "../Paginas/Carinho.html";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay(); // atualiza o contador logo que a página carrega
});

const firebaseConfig = {
  apiKey: "AIzaSyAwkDQfz5zSle0B7Lz0lEKZfT2-lk-3e3s",
  authDomain: "seedelectro.firebaseapp.com",
  projectId: "seedelectro",
  storageBucket: "seedelectro.firebasestorage.app",
  messagingSenderId: "275204209258",
  appId: "1:275204209258:web:aec29e2797350ac136e813",
  measurementId: "G-RQY204S4E0"
};


