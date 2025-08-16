// ✅ Quick view modal
function openQuickView(productId) {
  const modal = document.getElementById("quickViewModal")
  const modalBody = document.getElementById("modalBody")
  const modalOverlay = document.getElementById("modalOverlay")
  const modalClose = document.getElementById("modalClose")
  if (!modal) return

  // Show loading
  modalBody.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div class="spinner"></div>
      <p style="margin-top: 16px; color: var(--gray-400);">Carregando produto...</p>
    </div>
  `
  modal.classList.add("active")
  document.body.style.overflow = "hidden"

  // Simulate loading
  setTimeout(() => {
    modalBody.innerHTML = `
      <div class="quick-view-content">
        <div class="quick-view-image">
          <img src="/placeholder.svg?height=400&width=400&text=Produto+${productId}" alt="Produto">
        </div>
        <div class="quick-view-info">
          <h2>Produto ${productId}</h2>
          <div class="product-rating">
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <span>(124 avaliações)</span>
          </div>
          <p>Descrição detalhada do produto com todas as especificações técnicas e características importantes.</p>
          <div class="product-price">
            <span class="current-price">R$ 4.999,00</span>
            <span class="original-price">R$ 5.499,00</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary btn-full">
              <i class="fas fa-shopping-cart"></i>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    `
  }, 1000)

  // Close handlers
  modalClose.addEventListener("click", closeQuickView)
  modalOverlay.addEventListener("click", closeQuickView)
}

function closeQuickView() {
  const modal = document.getElementById("quickViewModal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }
}

// ✅ Back to Top Button
window.addEventListener("scroll", () => {
  const backToTopBtn = document.getElementById("backToTop")
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show")
  } else {
    backToTopBtn.classList.remove("show")
  }
})

document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// ✅ Cart Sidebar (abrir/fechar apenas, sem lógica do carrinho)
const cartBtn = document.querySelector(".cart-btn")
const cartSidebar = document.getElementById("cartSidebar")
const cartClose = document.getElementById("cartClose")
const cartOverlay = document.getElementById("cartOverlay")

function openCartSidebar() {
  cartSidebar.classList.add("active")
  cartOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeCartSidebar() {
  cartSidebar.classList.remove("active")
  cartOverlay.classList.remove("active")
  document.body.style.overflow = ""
}

cartBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  openCartSidebar()
})

cartClose?.addEventListener("click", closeCartSidebar)
cartOverlay?.addEventListener("click", closeCartSidebar)
