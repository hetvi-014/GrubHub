document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send a POST request to your Express.js server
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        if (data.success) {
          // Successful login, you can redirect or perform other actions here
          console.log("Login successful");
        } else {
          // Login failed, display an error message or take appropriate action
          console.error("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
