// Product information is kept in one array so the shop and RoomFit use the same data.
const products = [
  {
    id: "luna-chair",
    name: "Luna Accent Chair",
    price: 8499,
    category: "Living Room",
    image: "images/luna-chair.jpg",
    description: "A softly curved silhouette, tactile upholstery and a solid wood frame make this an inviting little corner of calm.",
    fullDescription: "Make room for a slower moment. The Luna Accent Chair pairs a gently curved back with beautifully textured upholstery and sturdy natural wood legs. Its thoughtful proportions make it an easy fit beside a bookshelf, in a reading nook or as a welcoming extra seat in the living room.",
    rooms: ["Living Room", "Bedroom", "Study Room"],
    styles: ["Modern", "Minimalist", "Natural/Wooden"],
    sizes: ["Medium", "Large"]
  },
  {
    id: "oakwood-table",
    name: "Oakwood Coffee Table",
    price: 5999,
    category: "Living Room",
    image: "images/oakwood-table.jpg",
    description: "Warm wood grain and clean lines bring an easy, grounded feel to your everyday gathering place.",
    fullDescription: "Designed to anchor a room without weighing it down, the Oakwood Coffee Table celebrates natural-looking grain, a generous tabletop and pared-back lines. There is space for your coffee, favourite book and all those small things that make a living room feel lived in.",
    rooms: ["Living Room", "Dining Room"],
    styles: ["Modern", "Minimalist", "Traditional", "Natural/Wooden"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "cloud-sofa",
    name: "Cloud Comfort Sofa",
    price: 24999,
    category: "Living Room",
    image: "images/cloud-sofa.jpg",
    description: "Sink into generous cushions and a soft, relaxed shape made for long conversations and longer naps.",
    fullDescription: "The Cloud Comfort Sofa is the welcoming centre of a home. Deep, supportive cushions and a softly tailored profile invite you to settle in, while its versatile neutral finish makes it easy to style with colour, texture and the seasons.",
    rooms: ["Living Room"],
    styles: ["Modern", "Traditional"],
    sizes: ["Large"]
  },
  {
    id: "bedside-table",
    name: "Serenity Bedside Table",
    price: 3499,
    category: "Bedroom",
    image: "images/bedside-table.jpg",
    description: "A compact bedside companion with a calm finish and just enough room for your nightly essentials.",
    fullDescription: "Keep the end of the day feeling serene with a tidy surface for your favourite book, a glass of water and soft lamplight. The Serenity Bedside Table has a simple, timeless profile that sits beautifully beside a bed or tucked into a small reading corner.",
    rooms: ["Bedroom", "Study Room"],
    styles: ["Minimalist", "Traditional", "Natural/Wooden"],
    sizes: ["Small", "Medium"]
  },
  {
    id: "glow-lamp",
    name: "Glow Table Lamp",
    price: 1799,
    category: "Lighting",
    image: "images/glow-lamp.jpg",
    description: "A warm, soft glow and sculptural shape turn a quiet corner into your favourite evening spot.",
    fullDescription: "Bring a little warmth to your wind-down ritual. The Glow Table Lamp combines a sculptural base with a softly diffused shade, creating gentle ambient light for a bedside table, reading nook or living-room side table.",
    rooms: ["Living Room", "Bedroom", "Study Room"],
    styles: ["Modern", "Minimalist", "Traditional"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "aura-vase",
    name: "Aura Ceramic Vase",
    price: 899,
    category: "Home Décor",
    image: "images/aura-vase.jpg",
    description: "A quietly sculptural ceramic accent, lovely with a few stems or simply just as it is.",
    fullDescription: "The Aura Ceramic Vase brings a considered finishing touch to a shelf, dining table or console. Its organic shape and tactile finish feel at home with fresh branches, dried flowers or nothing at all.",
    rooms: ["Living Room", "Bedroom", "Study Room", "Dining Room"],
    styles: ["Minimalist", "Traditional", "Natural/Wooden"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "nordic-wall-art",
    name: "Nordic Wall Art",
    price: 1499,
    category: "Home Décor",
    image: "images/nordic-wall-art.jpg",
    description: "An expressive, easy-to-place art print that gives a blank wall a more personal point of view.",
    fullDescription: "Give your walls a story of their own. Nordic Wall Art offers a balanced composition and a soothing palette that layers naturally with favourite furnishings, whether it hangs over a sofa, desk or bedside nook.",
    rooms: ["Living Room", "Bedroom", "Study Room", "Dining Room"],
    styles: ["Modern", "Minimalist", "Traditional"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "haven-floor-lamp",
    name: "Haven Floor Lamp",
    price: 3299,
    category: "Lighting",
    image: "images/haven-floor-lamp.jpg",
    description: "A slender floor lamp that layers a welcoming pool of light into a favourite reading corner.",
    fullDescription: "The Haven Floor Lamp brings a relaxed layer of light wherever the day winds down. Its tall, clean silhouette tucks beside a sofa or reading chair, helping a room feel warm and inviting without taking over the space.",
    rooms: ["Living Room", "Bedroom", "Study Room"],
    styles: ["Modern", "Traditional", "Natural/Wooden"],
    sizes: ["Medium", "Large"]
  }
];

const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const storageFeedback = document.querySelector("#storage-feedback");
const toast = document.querySelector("#toast");
const roomFitForm = document.querySelector("#roomfit-form");
const recommendations = document.querySelector("#recommendations");
let activeFilter = "All";
let toastTimer;

function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Load the cart saved by the previous visit.
function loadCart() {
  try {
    const savedCart = localStorage.getItem("decorDreamsCart");
    if (!savedCart) return [];
    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart)) throw new Error("Saved cart has an unexpected format.");
    return parsedCart.filter((item) =>
      products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    storageFeedback.textContent = "Your saved cart could not be read. Starting with an empty cart.";
    console.error("Could not load the saved cart:", error);
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem("decorDreamsCart", JSON.stringify(cart));
    storageFeedback.textContent = "";
  } catch (error) {
    storageFeedback.textContent = "Your cart is available for this visit, but could not be saved in this browser.";
    console.error("Could not save the cart:", error);
  }
}

// Display all products or only products in the selected category.
function renderProducts() {
  const visibleProducts = activeFilter === "All"
    ? products
    : products.filter((product) => product.category === activeFilter);

  productGrid.innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-tag">${product.category}</span>
        </div>
        <div class="product-info">
          <div class="product-title-row"><h3>${product.name}</h3><span class="product-price">${formatPrice(product.price)}</span></div>
          <p class="product-description">${product.description}</p>
          <div class="product-actions">
            <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
            <button class="details-button" type="button" data-details="${product.id}">View Details</button>
          </div>
        </div>
      </article>`).join("")
    : `<p class="empty-filter">There are no products in this category just yet.</p>`;
}

function setFilter(category) {
  activeFilter = category;
  document.querySelectorAll(".filter-chip").forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) cartItem.quantity += 1;
  else cart.push({ id: productId, quantity: 1 });
  renderCart();
  saveCart();
  showToast(`${product.name} added to your cart.`);
}

// Change an item's quantity. Decrease to zero to remove it.
function updateQuantity(productId, change) {
  const cartItem = cart.find((item) => item.id === productId);
  if (!cartItem) return;
  cartItem.quantity += change;
  if (cartItem.quantity <= 0) cart = cart.filter((item) => item.id !== productId);
  renderCart();
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
  saveCart();
}

function renderCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  document.querySelector("#nav-cart-count").textContent = totalItems;
  document.querySelector("#cart-title-count").textContent = `(${totalItems})`;
  document.querySelector("#summary-items").textContent = totalItems;
  document.querySelector("#cart-total").textContent = formatPrice(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is waiting for something lovely. Add a piece to get started.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return "";
    return `
      <article class="cart-row">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div><h3 class="cart-product-name">${product.name}</h3><span class="cart-unit-price">${formatPrice(product.price)} each</span></div>
        <div class="quantity-control" aria-label="Quantity for ${product.name}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button>
        </div>
        <span class="cart-subtotal">${formatPrice(product.price * item.quantity)}</span>
        <button class="remove-button" type="button" data-remove="${product.id}" aria-label="Remove ${product.name} from cart">×</button>
      </article>`;
  }).join("");
}

// Put the selected product's information in the details popup.
function openProductDetails(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const modal = document.querySelector("#product-modal");
  document.querySelector("#modal-content").innerHTML = `
    <div class="modal-product-layout">
      <img src="${product.image}" alt="${product.name}">
      <div class="modal-product-info">
        <p class="eyebrow">${product.category}</p>
        <h2 id="modal-product-name">${product.name}</h2>
        <p class="modal-price">${formatPrice(product.price)}</p>
        <p class="modal-description">${product.fullDescription}</p>
        <p class="modal-category">Category: ${product.category}</p>
        <button class="button button-sage" type="button" data-add="${product.id}">Add to Cart <span aria-hidden="true">↗</span></button>
        <br><button class="modal-back" type="button" id="modal-back">Back to Products</button>
      </div>
    </div>`;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  document.querySelector("#modal-close").focus();
}

function closeProductDetails() {
  document.querySelector("#product-modal").hidden = true;
  document.body.classList.remove("no-scroll");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function budgetMatches(price, budget) {
  if (budget === "under-2000") return price < 2000;
  if (budget === "2000-10000") return price >= 2000 && price <= 10000;
  if (budget === "10000-25000") return price > 10000 && price <= 25000;
  return budget === "above-25000" && price > 25000;
}

// Return products matching the room, size, style and budget choices.
function findRecommendations(formValues) {
  return products.filter((product) =>
    product.rooms.includes(formValues.room) &&
    product.sizes.includes(formValues.size) &&
    product.styles.includes(formValues.style) &&
    budgetMatches(product.price, formValues.budget)
  );
}

function renderRecommendations(matches) {
  if (!matches.length) {
    recommendations.innerHTML = '<p class="recommendation-empty">We couldn’t find a piece matching every choice just yet. Try another room size, style or budget to explore more options.</p>';
    return;
  }
  recommendations.innerHTML = `
    <p class="recommendation-message">Your room deserves a style of its own! Here are our recommendations for your space.</p>
    <div class="recommendation-grid">${matches.map((product) => `
      <article class="recommendation-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div><h3>${product.name}</h3><p>${formatPrice(product.price)}</p></div>
        <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to cart">Add</button>
      </article>`).join("")}
    </div>`;
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const detailButton = event.target.closest("[data-details]");
  if (addButton) addToCart(addButton.dataset.add);
  if (detailButton) openProductDetails(detailButton.dataset.details);
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    setFilter(button.dataset.category);
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#view-all-link").addEventListener("click", () => setFilter("All"));

document.querySelectorAll("[data-footer-filter]").forEach((link) => {
  link.addEventListener("click", () => setFilter(link.dataset.footerFilter));
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) updateQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

document.querySelector("#product-modal").addEventListener("click", (event) => {
  if (event.target.id === "product-modal" || event.target.closest("#modal-close") || event.target.closest("#modal-back")) {
    closeProductDetails();
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("#product-modal").hidden) closeProductDetails();
});

roomFitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!roomFitForm.reportValidity()) {
    document.querySelector("#roomfit-feedback").textContent = "Please choose an option for each field to get your recommendations.";
    return;
  }
  document.querySelector("#roomfit-feedback").textContent = "";
  const values = {
    room: document.querySelector("#room-type").value,
    size: document.querySelector("#room-size").value,
    style: document.querySelector("#room-style").value,
    budget: document.querySelector("#room-budget").value
  };
  renderRecommendations(findRecommendations(values));
});

recommendations.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  const feedback = document.querySelector("#checkout-feedback");
  feedback.textContent = cart.length
    ? "This is a demo checkout. No payment details are collected."
    : "Your cart is empty. Add a product before checking out.";
});

const menuToggle = document.querySelector("#menu-toggle");
const primaryLinks = document.querySelector("#primary-links");
menuToggle.addEventListener("click", () => {
  const isOpen = primaryLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
primaryLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    primaryLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
