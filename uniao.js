// Carrinho salvo localmente
let cart = JSON.parse(localStorage.getItem("pcmaster_cart")) || [];

// Lista de produtos para adicionar ao carrinho
const products = {
  1: { id: "1", name: "PC Gamer RTX 4070 Super", price: 4999, image: "/Speed-Electro/IMG2.png" },
  2: { id: "2", name: "Workstation Pro Creator", price: 7299, image: "/Speed-Electro/IMG.png" },
  3: { id: "3", name: "PC Entry Level Gamer", price: 1899, image: "/Speed-Electro/IMG4.png" },
  4: { id: "4", name: "PC Extreme Gaming 4K", price: 12999, image: "/Speed-Electro/IMG5.png" },
  5: { id: "5", name: "Working Pro Creator", price: 10599, image: "/Speed-Electro/IMG3.png" },
  6: { id: "6", name: "Workstation Compact", price: 3499, image: "/Speed-Electro/IMG6.png" },
};

/**
 * Adiciona um produto ao carrinho e salva no localStorage.
 * @param {string} productId O ID do produto a ser adicionado.
 */
function addToCart(productId) {
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

/**
 * Atualiza a exibição do contador de itens no carrinho.
 */
function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

/**
 * Exibe uma notificação pop-up para o usuário.
 * @param {string} productName O nome do produto adicionado.
 */
function showCartNotification(productName) {
  const notification = document.createElement("div");
  notification.classList.add("cart-notification");
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
      
      // Adiciona o produto ao carrinho
      addToCart(productId);

      // Exibe feedback visual e não redireciona
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

  const buyNowBtns = document.querySelectorAll(".buy-now");
  buyNowBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.previousElementSibling.getAttribute("data-product-id");
      addToCart(productId);
      // Redireciona para a página de checkout.html
      // Corrigindo o caminho para a página de checkout
      window.location.href = "/Paginas/checkout.html";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cartTableBody = document.getElementById("cartItems");
  const orderTotalSpan = document.getElementById("orderTotal");
  const clearCartBtn = document.getElementById("clearCartBtn");

  /**
   * Renderiza os itens do carrinho na tabela.
   */
  function renderCartItems() {
    if (!cartTableBody) return;

    cartTableBody.innerHTML = '';
    if (cart.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="5" class="empty-cart-message">Seu carrinho está vazio.</td></tr>';
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
        <td>${item.name}</td>
        <td>R$ ${item.price.toFixed(2)}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
        </td>
        <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button class="remove-item-btn" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      cartTableBody.appendChild(row);
    });
    
    // Adiciona os event listeners para os botões de remover e inputs de quantidade
    document.querySelectorAll('.remove-item-btn').forEach(button => {
      button.addEventListener('click', removeItem);
    });
    document.querySelectorAll('.item-quantity').forEach(input => {
      input.addEventListener('change', updateItemQuantity);
    });
    renderOrderSummary();
  }

  /**
   * Atualiza o resumo do pedido.
   */
  function renderOrderSummary() {
    if (!orderTotalSpan) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotalSpan.textContent = subtotal.toFixed(2);
  }

  /**
   * Remove um item do carrinho.
   * @param {Event} e O evento de clique.
   */
  function removeItem(e) {
    const itemId = e.currentTarget.getAttribute('data-id');
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem("pcmaster_cart", JSON.stringify(cart));
    renderCartItems();
  }

  /**
   * Atualiza a quantidade de um item no carrinho.
   * @param {Event} e O evento de alteração.
   */
  function updateItemQuantity(e) {
    const itemId = e.currentTarget.getAttribute('data-id');
    const newQuantity = parseInt(e.currentTarget.value);
    if (newQuantity < 1) return;

    const item = cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      localStorage.setItem("pcmaster_cart", JSON.stringify(cart));
      renderCartItems();
    }
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart = [];
      localStorage.setItem("pcmaster_cart", JSON.stringify(cart));
      renderCartItems();
    });
  }

  renderCartItems();
});
