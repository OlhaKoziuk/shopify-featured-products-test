document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".featured-products__btn");
  function hideProductsInCart() {
    fetch("/cart.js")
      .then(response => response.json())
      .then(cart => {
        const cartProductIds = cart.items.map(item => item.product_id);
        document.querySelectorAll(".featured-products__item").forEach(item => {
          const productId = parseInt(item.getAttribute("data-product-id"), 10);

          if (cartProductIds.includes(productId)) {
            item.style.display = "none";
          }
        });
      })
      .catch(error => console.error(error));
  }

  hideProductsInCart();

  buttons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const productId = button.getAttribute("data-id");

      if (!productId) return;

      button.disabled = true;
      button.textContent = "Adding...";

      try {
        await addToCart(productId);
        button.textContent = "Added!";

        await updateCartDrawer();
        hideProductsInCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
        button.textContent = "Error!";
      }

      setTimeout(() => {
        button.textContent = "Add to cart";
        button.disabled = false;
      }, 1500);
    });
  });
});

function hideProductsInCart() {
  fetch("/cart.js")
    .then(response => response.json())
    .then(cart => {
      if (!cart.items || cart.items.length === 0) return;

      const cartProductIds = cart.items.map(item => item.product_id);

      document.querySelectorAll(".featured-products__item").forEach(item => {
        const productId = parseInt(item.getAttribute("data-product-id"), 10);

        if (cartProductIds.includes(productId)) {
          item.style.display = "none";
        }
      });
    })
    .catch(error => console.error("Error fetching cart:", error));
}


async function addToCart(productId) {
  const response = await fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: productId,
      quantity: 1,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item");
  }

  const cartData = await response.json();
  document.dispatchEvent(new CustomEvent("cart:refresh", { detail: cartData }));

  await updateCartDrawer();
  return cartData;
}


async function updateCartDrawer() {
  try {
    const response = await fetch("/cart.js");
    const cartData = await response.json();

    document.dispatchEvent(new CustomEvent("cart:refresh", { detail: cartData }));

    updateCartCounter(cartData.item_count);
  } catch (error) {
    console.error("Error updating cart:", error);
  }
}

function updateCartCounter(count) {
  const cartCounter = document.querySelector(".cart-count-bubble");

  if (cartCounter) {
    if (count > 0) {
      cartCounter.textContent = count;
      cartCounter.style.display = "flex";
      cartCounter.setAttribute("aria-hidden", "false");
    } else {
      cartCounter.textContent = "";
      cartCounter.style.display = "none";
      cartCounter.setAttribute("aria-hidden", "true");
    }
  }
};

async function fetchCartData() {
  try {
    const response = await fetch("/cart.js");
    const cartData = await response.json();
    updateCartCounter(cartData.item_count);
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};








