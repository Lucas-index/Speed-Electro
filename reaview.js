// Products Page Functionality
class ProductsManager {
  constructor() {
    this.products = []
    this.filteredProducts = []
    this.currentFilters = {
      search: "",
      categories: [],
      brands: [],
      gpus: [],
      rams: [],
      storages: [],
      priceRange: 15000,
    }
    this.currentSort = "relevance"
    this.currentView = "grid"

    this.init()
  }

  init() {
    this.loadProducts()
    this.initializeFilters()
    this.initializeSort()
    this.initializeViewToggle()
    this.initializePriceRange()
    this.updateProductDisplay()
  }

  loadProducts() {
    // Get all product cards from DOM
    this.products = Array.from(document.querySelectorAll(".product-card")).map((card) => ({
      element: card,
      category: card.dataset.category,
      price: Number.parseInt(card.dataset.price),
      brand: card.dataset.brand,
      gpu: card.dataset.gpu,
      ram: card.dataset.ram,
      storage: card.dataset.storage,
      rating: Number.parseInt(card.dataset.rating),
      title: card.querySelector(".product-title").textContent.toLowerCase(),
      specs: card.querySelector(".product-specs").textContent.toLowerCase(),
    }))

    this.filteredProducts = [...this.products]
  }

  initializeFilters() {
    // Search filter
    const searchInput = document.getElementById("productSearch")
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        debounce((e) => {
          this.currentFilters.search = e.target.value.toLowerCase()
          this.applyFilters()
        }, 300),
      )
    }

    // Category filters
    const categoryFilters = document.querySelectorAll(".category-filter")
    categoryFilters.forEach((filter) => {
      filter.addEventListener("change", () => {
        this.updateFilterArray("categories", filter.value, filter.checked)
        this.applyFilters()
      })
    })

    // Brand filters
    const brandFilters = document.querySelectorAll(".brand-filter")
    brandFilters.forEach((filter) => {
      filter.addEventListener("change", () => {
        this.updateFilterArray("brands", filter.value, filter.checked)
        this.applyFilters()
      })
    })

    // GPU filters
    const gpuFilters = document.querySelectorAll(".gpu-filter")
    gpuFilters.forEach((filter) => {
      filter.addEventListener("change", () => {
        this.updateFilterArray("gpus", filter.value, filter.checked)
        this.applyFilters()
      })
    })

    // RAM filters
    const ramFilters = document.querySelectorAll(".ram-filter")
    ramFilters.forEach((filter) => {
      filter.addEventListener("change", () => {
        this.updateFilterArray("rams", filter.value, filter.checked)
        this.applyFilters()
      })
    })

    // Storage filters
    const storageFilters = document.querySelectorAll(".storage-filter")
    storageFilters.forEach((filter) => {
      filter.addEventListener("change", () => {
        this.updateFilterArray("storages", filter.value, filter.checked)
        this.applyFilters()
      })
    })

    // Initialize all filters as checked
    this.initializeDefaultFilters()
  }

  initializeDefaultFilters() {
    // Set all categories as selected by default
    this.currentFilters.categories = ["gaming", "workstation", "office", "premium"]
    this.currentFilters.brands = ["speedelectro", "custom"]
    this.currentFilters.gpus = ["rtx4090", "rtx4080", "rtx4070", "rtx4060"]
    this.currentFilters.rams = ["16gb", "32gb", "64gb"]
    this.currentFilters.storages = ["1tb", "2tb", "4tb"]
  }

  updateFilterArray(filterType, value, isChecked) {
    if (isChecked) {
      if (!this.currentFilters[filterType].includes(value)) {
        this.currentFilters[filterType].push(value)
      }
    } else {
      this.currentFilters[filterType] = this.currentFilters[filterType].filter((item) => item !== value)
    }
  }

  initializePriceRange() {
    const priceRange = document.getElementById("priceRange")
    const maxPriceDisplay = document.getElementById("maxPrice")

    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        const value = Number.parseInt(e.target.value)
        this.currentFilters.priceRange = value

        if (maxPriceDisplay) {
          maxPriceDisplay.textContent = `R$ ${value.toLocaleString("pt-BR")}`
        }

        this.applyFilters()
      })
    }
  }

  initializeSort() {
    const sortSelect = document.getElementById("sortSelect")
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value
        this.sortProducts()
        this.updateProductDisplay()
      })
    }
  }

  initializeViewToggle() {
    const viewBtns = document.querySelectorAll(".view-btn")
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        viewBtns.forEach((b) => b.classList.remove("active"))
        // Add active class to clicked button
        btn.classList.add("active")

        this.currentView = btn.dataset.view
        this.updateViewMode()
      })
    })
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      // Search filter
      if (
        this.currentFilters.search &&
        !product.title.includes(this.currentFilters.search) &&
        !product.specs.includes(this.currentFilters.search)
      ) {
        return false
      }

      // Category filter
      if (this.currentFilters.categories.length > 0 && !this.currentFilters.categories.includes(product.category)) {
        return false
      }

      // Brand filter
      if (this.currentFilters.brands.length > 0 && !this.currentFilters.brands.includes(product.brand)) {
        return false
      }

      // GPU filter
      if (this.currentFilters.gpus.length > 0 && !this.currentFilters.gpus.includes(product.gpu)) {
        return false
      }

      // RAM filter
      if (this.currentFilters.rams.length > 0 && !this.currentFilters.rams.includes(product.ram)) {
        return false
      }

      // Storage filter
      if (this.currentFilters.storages.length > 0 && !this.currentFilters.storages.includes(product.storage)) {
        return false
      }

      // Price filter
      if (product.price > this.currentFilters.priceRange) {
        return false
      }

      return true
    })

    this.sortProducts()
    this.updateProductDisplay()
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      switch (this.currentSort) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          // Would need date data in real implementation
          return 0
        case "relevance":
        default:
          return 0
      }
    })
  }

  updateProductDisplay() {
    // Hide all products first
    this.products.forEach((product) => {
      product.element.style.display = "none"
    })

    // Show filtered products
    this.filteredProducts.forEach((product, index) => {
      product.element.style.display = "block"

      // Add animation
      product.element.style.opacity = "0"
      product.element.style.transform = "translateY(20px)"

      setTimeout(() => {
        product.element.style.transition = "all 0.3s ease"
        product.element.style.opacity = "1"
        product.element.style.transform = "translateY(0)"
      }, index * 50)
    })

    // Update product count
    this.updateProductCount()
  }

  updateProductCount() {
    const productCount = document.getElementById("productCount")
    if (productCount) {
      productCount.textContent = this.filteredProducts.length
    }
  }

  updateViewMode() {
    const productsGrid = document.getElementById("productsGrid")
    if (productsGrid) {
      if (this.currentView === "list") {
        productsGrid.classList.add("list-view")
      } else {
        productsGrid.classList.remove("list-view")
      }
    }
  }

  clearAllFilters() {
    // Reset search
    const searchInput = document.getElementById("productSearch")
    if (searchInput) {
      searchInput.value = ""
    }

    // Reset price range
    const priceRange = document.getElementById("priceRange")
    const maxPriceDisplay = document.getElementById("maxPrice")
    if (priceRange) {
      priceRange.value = 15000
      if (maxPriceDisplay) {
        maxPriceDisplay.textContent = "R$ 15.000"
      }
    }

    // Check all checkboxes
    const allCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]')
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = true
    })

    // Reset filters
    this.currentFilters = {
      search: "",
      categories: ["gaming", "workstation", "office", "premium"],
      brands: ["speedelectro", "custom"],
      gpus: ["rtx4090", "rtx4080", "rtx4070", "rtx4060"],
      rams: ["16gb", "32gb", "64gb"],
      storages: ["1tb", "2tb", "4tb"],
      priceRange: 15000,
    }

    this.applyFilters()
  }
}

// Clear all filters function (global)
function clearAllFilters() {
  if (window.productsManager) {
    window.productsManager.clearAllFilters()
  }
}

// Debounce utility function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.productsManager = new ProductsManager()

  // Initialize add to cart functionality
  const addToCartBtns = document.querySelectorAll(".add-to-cart")
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()
      const productId = this.getAttribute("data-product-id")

      // Add visual feedback
      const originalText = this.innerHTML
      this.innerHTML = '<i class="fas fa-check"></i> Adicionado!'
      this.style.background = "#10b981"
      this.disabled = true

      setTimeout(() => {
        this.innerHTML = originalText
        this.style.background = ""
        this.disabled = false
      }, 2000)

      // Update cart count if main.js is loaded
      if (window.SpeedElectro && window.SpeedElectro.addToCart) {
        window.SpeedElectro.addToCart(productId)
      }
    })
  })

  // Initialize wishlist functionality
  const wishlistBtns = document.querySelectorAll(".add-wishlist")
  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()

      if (this.querySelector("i").classList.contains("far")) {
        this.querySelector("i").classList.remove("far")
        this.querySelector("i").classList.add("fas")
        this.style.color = "#ef4444"
      } else {
        this.querySelector("i").classList.remove("fas")
        this.querySelector("i").classList.add("far")
        this.style.color = ""
      }
    })
  })

  // Initialize buy now buttons
  const buyNowBtns = document.querySelectorAll(".buy-now")
  buyNowBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      // Redirect to checkout or show quick buy modal
      window.location.href = "../Paginas/checkout.html"
    })
  })
})


