// Aguarda o HTML ser completamente carregado antes de executar o script
document.addEventListener("DOMContentLoaded", function () {
  //================================================
  // --- LÓGICA DO MENU MOBILE ---
  //================================================

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }

  // --- LÓGICA DA GALERIA DE IMAGENS (VERSÃO CORRIGIDA E FINAL) ---
  // ======================================================
  const mainImage = document.querySelector(".main-image img");
  const thumbnails = document.querySelectorAll(".thumbnail-images .thumbnail");

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        const thumbnailSrc = this.getAttribute("src");

        // LÓGICA CORRIGIDA: Troca a palavra 'thumb' por 'grande'
        // Isso transforma "sabonete-thumb2.png" em "sabonete-grande2.png" corretamente!
        const mainImageSrc = thumbnailSrc.replace("thumb", "grande");

        mainImage.setAttribute("src", mainImageSrc);

        thumbnails.forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  //================================================
  // --- LÓGICA COMPLETA DO CARRINHO (VERSÃO COM QUANTIDADE) ---
  //================================================

  // --- Seleção de Elementos do DOM ---
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartBody = document.getElementById("cart-drawer-body");
  const cartItemCount = document.getElementById("cart-item-count");
  const subtotalElement = document.getElementById("cart-subtotal");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const whatsappCheckoutBtn = document.getElementById("whatsapp-checkout-btn");
  const plusBtn = document.getElementById("plus-btn");
  const minusBtn = document.getElementById("minus-btn");
  const quantityInput = document.getElementById("quantity");

  // --- Estado do Carrinho ---
  let cart = [];

  // --- Funções de Gerenciamento do Carrinho ---
  function loadCart() {
    const savedCart = localStorage.getItem("shoppingCart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    renderCart();
  }

  function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    renderCart();
  }

  function updateSubtotal() {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const formattedSubtotal = subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    subtotalElement.innerText = formattedSubtotal;
  }

  function renderCart() {
    cartBody.innerHTML = "";
    if (cart.length === 0) {
      cartBody.innerHTML =
        '<p class="cart-empty-message">Seu carrinho está vazio.</p>';
    } else {
      cart.forEach((item) => {
        const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${
          item.name
        }" class="cart-item-image">
                    <div class="cart-item-details">
                        <p class="cart-item-title">${item.name}</p>
                        <p class="cart-item-price">R$ ${parseFloat(item.price)
                          .toFixed(2)
                          .replace(".", ",")}</p>
                        <div class="cart-item-quantity">
                            <p>Qtd: ${item.quantity}</p>
                            <button class="remove-item-btn">Remover</button>
                        </div>
                    </div>
                </div>
              `;
        cartBody.innerHTML += cartItemHTML;
      });
    }
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.innerText = totalItems;
    updateSubtotal();
    addRemoveListeners();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function addToCart() {
    const productTitleElement = document.getElementById("product-title");
    const quantityInput = document.getElementById("quantity");
    const productPriceElement = document.querySelector(".product-price-detail");
    const productImageElement = document.querySelector(".main-image img");

    if (
      !productTitleElement ||
      !quantityInput ||
      !productPriceElement ||
      !productImageElement
    )
      return;

    const name = productTitleElement.innerText;
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(
      productPriceElement.innerText.replace("R$", "").replace(",", ".")
    );
    const image = productImageElement.getAttribute("src");
    const id = name; // O ID agora é apenas o nome do produto

    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id, name, price, image, quantity });
    }
    alert(`${quantity}x "${name}" foram adicionados ao carrinho!`);
    saveCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
  }

  function addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".remove-item-btn");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.closest(".cart-item").dataset.id;
        removeFromCart(productId);
      });
    });
  }

  function checkoutToWhatsapp() {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let orderSummary =
      "Olá, Flor de Girassol! Gostaria de fazer o seguinte pedido:\n\n";
    cart.forEach((item) => {
      orderSummary += `- *${item.quantity}x* ${item.name}\n`;
    });
    const subtotalText = subtotalElement.innerText;
    orderSummary += `\n*Subtotal: ${subtotalText}*`;
    orderSummary +=
      "\n\nAguardo as informações para pagamento e entrega. Obrigada!";

    const phoneNumber = "5592982529894"; // SEU NÚMERO JÁ ESTÁ AQUI
    const encodedMessage = encodeURIComponent(orderSummary);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
  }

  // --- Event Listeners ---
  if (openCartBtn) {
    openCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cartDrawer.classList.add("active");
      cartOverlay.classList.add("active");
    });
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartDrawer.classList.remove("active");
      cartOverlay.classList.remove("active");
    });
  }
  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
      cartDrawer.classList.remove("active");
      cartOverlay.classList.remove("active");
    });
  }
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart();
    });
  }
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener("click", function (event) {
      event.preventDefault();
      checkoutToWhatsapp();
    });
  }

  // Funcionalidade dos botões de quantidade
  if (plusBtn && minusBtn && quantityInput) {
    plusBtn.addEventListener("click", () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    minusBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }

  // --- Inicialização ---
  loadCart();
});
