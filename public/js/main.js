document.addEventListener("DOMContentLoaded", function () {
  const addProductForm = document.getElementById("addProductForm");
  const productTable = document.getElementById("productTable");

  // Function to close the edit modal
  function openEditModal() {
    const editProductModal = document.getElementById("editProductModal");
    editProductModal.style.display = "block";
  }

  // Handle edit form submission
  const editProductForm = document.getElementById("editProductForm");
  editProductForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const productId = document.getElementById("editProductId").value;
    const name = document.getElementById("editName").value;
    const price = parseFloat(document.getElementById("editPrice").value);
    const description = document.getElementById("editDescription").value;

    const productData = { name, price, description };
    console.log(productData);
    fetch(`/products/edit/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Close the edit modal
          closeEditModal();
          // Fetch and display updated product list
          fetchProducts();
        } else {
          console.error("Error editing product: " + data.message);
        }
      })
      .catch((error) => console.error("Error editing product: " + error));
  });

  // Function to add a product
  addProductForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("submit pressed");
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const popular = document.getElementById("popular").checked;
    const productData = { name, price, description,popular };
    console.log(productData)
    fetch("/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Clear the form
          addProductForm.reset();
          // Fetch and display updated product list
          fetchProducts();
        } else {
          console.error("Error adding product: " + data.message);
        }
      })
      .catch((error) => console.error("Error adding product: " + error));
  });

  // Fetch and display initial product list
  fetchProducts();
});
// Function to close the edit modal
function closeEditModal() {
  const editProductModal = document.getElementById("editProductModal");
  editProductModal.style.display = "none";
}
// Function to delete a product
function deleteProduct(productId) {
  fetch(`/products/remove/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Fetch and display updated product list
        fetchProducts();
      } else {
        console.error("Error deleting product: " + data.message);
      }
    })
    .catch((error) => console.error("Error deleting product: " + error));
}
function fetchProductById(productId) {
  fetch(`/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((productData) => {
      // Handle the product data here
      if (productData) {
        // Populate the edit form fields with product data
        document.getElementById("editName").value = productData.name;
        document.getElementById("editPrice").value = productData.price;
        document.getElementById("editDescription").value =
          productData.description;
        document.getElementById("editProductId").value = productId;
        console.log(productId);
        // Display the edit modal
        const editProductModal = document.getElementById("editProductModal");
        editProductModal.style.display = "block";
      }

      // You can update your UI or perform other actions with the product data
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
    });
}
// Function to edit a product by ID
function editProduct(productId) {
  // Implement edit functionality here (e.g., open a modal)
  const product = fetchProductById(productId);
  console.log(product);
  // const product = {
  //   name: "abcd",
  //   price: "55",
  //   description: "sonething to add",
  //   productId: productId,
  // };
}

// Function to fetch and display products
function fetchProducts() {
  fetch("/products")
    .then((response) => response.json())
    .then((data) => {
      // Clear existing rows
      productTable.innerHTML =
        "<tr><th>Name</th><th>Price</th><th>Description</th><th>Action</th></tr>";

      // Iterate through products and add them to the table
      data.products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${product.name}</td>
                        <td>₹ ${product.price.toFixed(2)}</td>
                        <td class="img_url">${product.description}</td>
                        <td>
                            <button class="edit_btn" onclick="editProduct('${
                              product._id
                            }')">Edit</button>
                            <button class="delete_button" onclick="deleteProduct('${
                              product._id
                            }')">Delete</button>
                        </td>
                    `;
        productTable.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching products: " + error));
}
