document.addEventListener("DOMContentLoaded", () => {
  const showroomWrapper = document.getElementById("showroom-wrapper");
  const contentWrapper = document.getElementById("content-wrapper");
  const productGrid = document.querySelector(".product-grid");
  const itemWrapper = document.getElementById("item-wrapper");
  const navProductBtn = document.getElementById("nav-product");

  // Show only one wrapper
  function showWrapper(id) {
    document.querySelectorAll(".wrapper").forEach(w => w.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  // Load showroom on page load
  fetch("showroom.json")
    .then(res => res.json())
    .then(data => {
      const grid = document.querySelector(".showroom-grid");
      grid.innerHTML = "";
      data.forEach(item => {
        const div = document.createElement("div");
        div.className = "showroom-item";
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
        `;
        grid.appendChild(div);
      });
    });

  // Handle clicking "EDGE精選"
  navProductBtn.addEventListener("click", () => {
    fetch("items.json")
      .then(res => res.json())
      .then(data => {
        productGrid.innerHTML = "";
        data.forEach(item => {
          const div = document.createElement("div");
          div.className = "product-card";
          div.dataset.id = item.id;
          div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p class="price">$${item.price}</p>
          `;
          productGrid.appendChild(div);
        });

        // Click handler for each product card
        document.querySelectorAll(".product-card").forEach(card => {
          card.addEventListener("click", () => {
            const id = card.dataset.id;
            showItemDetails(id);
          });
        });

        showWrapper("content-wrapper");
      });
  });

  // Show item details
  function showItemDetails(id) {
    fetch("items.json")
      .then(res => res.json())
      .then(data => {
        const item = data.find(i => i.id === id);
        if (!item) return;

        itemWrapper.innerHTML = `
          <div class="item-detail">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-info">
              <h2>${item.name}</h2>
              <p><strong>價格：</strong>$${item.price}</p>
              <p><strong>描述：</strong>${item.description}</p>
              <p><strong>規格：</strong>${item.specs}</p>
              <p><strong>尺寸：</strong>${item.sizes.join(", ")}</p>
              <p><strong>顏色：</strong>${item.colors.join(", ")}</p>
              <button id="back-to-products">← 回商品列表</button>
            </div>
          </div>
        `;

        document.getElementById("back-to-products").addEventListener("click", () => {
          showWrapper("content-wrapper");
        });

        showWrapper("item-wrapper");
      });
  }
});