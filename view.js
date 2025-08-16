import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  updateDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== CONFIG FIREBASE (MESMA DO LOGIN/CADASTRO) =====
const firebaseConfig = {
  apiKey: "AIzaSyAwkDQfz5zSle0B7Lz0lEKZfT2-lk-3e3s",
  authDomain: "seedelectro.firebaseapp.com",
  projectId: "seedelectro",
  storageBucket: "seedelectro.firebasestorage.app",
  messagingSenderId: "275204209258",
  appId: "1:275204209258:web:aec29e2797350ac136e813",
  measurementId: "G-RQY204S4E0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Carrinho removido daqui – toda lógica está no uniao.js

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
      mobileMenuBtn.classList.toggle("active")
      document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : ""
    })

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll("a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        mobileMenuBtn.classList.remove("active")
        document.body.style.overflow = ""
      })
    })
  }
})

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = document.getElementById("header").offsetHeight
      const targetPosition = target.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })

      // Close mobile menu if open
      const mobileMenu = document.getElementById("mobileMenu")
      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active")
        document.getElementById("mobileMenuBtn").classList.remove("active")
        document.body.style.overflow = ""
      }
    }
  })
})

// Product Cards Hover Effects
document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const viewBtn = card.querySelector(".product-view-btn")

    if (viewBtn) {
      viewBtn.addEventListener("click", (e) => {
        e.preventDefault()
        alert("Visualização rápida do produto em desenvolvimento!")
      })
    }
  })
})

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

// ✅ Search Modal
const searchBtn = document.getElementById("searchBtn")
const searchModal = document.getElementById("searchModal")
const searchClose = document.getElementById("searchClose")
const searchInput = document.getElementById("searchInput")
const searchResults = document.getElementById("searchResults")
const suggestionTags = document.querySelectorAll(".suggestion-tag")

if (searchBtn && searchModal && searchClose && searchInput) {
  searchBtn.addEventListener("click", () => {
    searchModal.classList.add("active")
    document.body.style.overflow = "hidden"
    searchInput.focus()
  })

  searchClose.addEventListener("click", () => {
    searchModal.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Handle search suggestions
  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      searchInput.value = tag.textContent.trim()
      performSearch(tag.textContent.trim())
    })
  })

  // Real-time search
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value
    if (query.length > 2) {
      performSearch(query)
    } else {
      searchResults.innerHTML = "" // Clear results
    }
  })

  function performSearch(query) {
    // Dummy search function, replace with real logic
    const results = [
      "Placa de Vídeo RTX 4070",
      "Processador Ryzen 7 5700X",
      "SSD NVMe 1TB",
      "Memória RAM DDR4 16GB",
      "Gabinete Gamer RGB",
      "Mouse Gamer Logitech",
    ]

    const filteredResults = results.filter((result) => result.toLowerCase().includes(query.toLowerCase()))

    if (filteredResults.length > 0) {
      searchResults.innerHTML = `
        <h4>Resultados para "${query}":</h4>
        <ul>
          ${filteredResults.map((item) => `<li><a href="#">${item}</a></li>`).join("")}
        </ul>
      `
    } else {
      searchResults.innerHTML = `<p>Nenhum resultado encontrado para "${query}".</p>`
    }
  }
}

// ✅ Cart Sidebar (apenas abrir/fechar)
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

// ✅ Filter products based on button click
const filterButtons = document.querySelectorAll(".filter-btn")
const productsGrid = document.getElementById("productsGrid")
const productCards = document.querySelectorAll(".product-card")

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove 'active' class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    // Add 'active' class to the clicked button
    button.classList.add("active")

    const filter = button.getAttribute("data-filter")

    productCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  })
})
