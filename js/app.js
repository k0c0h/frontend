let products = [];

// URLs backend (Render o Local)
const PRODUCTS_API =
  "https://backend-products.onrender.com/products"||
 "http://localhost:3008/products";

const EXPIRATION_API =
  "https://backend-expiration.onrender.com/expiration"||
  "http://localhost:3009/expiration";

fetch(PRODUCTS_API)
  .then(res => res.json())
  .then(data => {
    products = data;
  })
  .catch(err => console.error("Error loading products:", err));

function searchProduct() {
  const text = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="text-danger fw-bold text-center">
          No products found
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(p => {
    fetch(EXPIRATION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: p.year,
        month: p.month,
        day: p.day
      })
    })
      .then(res => res.json())
      .then(exp => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${p.name}</td>
          <td>$${p.price}</td>
          <td>${p.quantity}</td>
          <td>${p.day}/${p.month}/${p.year}</td>
          <td class="${
            exp.daysLeft < 0
              ? "text-danger fw-bold"
              : "text-success fw-bold"
          }">
            ${exp.daysLeft}
          </td>
        `;

        table.appendChild(row);
      })
      .catch(err =>
        console.error("Expiration error:", err)
      );
  });
}
