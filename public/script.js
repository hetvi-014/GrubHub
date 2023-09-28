let menu = document.querySelector("#menu-bars");
let navbar = document.querySelector(".navbar");
// dropdownlist
menu.onclick = () => {
    menu
        .classList
        .toggle("fa-times");
    navbar
        .classList
        .toggle("active");
};

let section = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header .navbar a");
// search
window.onscroll = () => {
    menu
        .classList
        .remove("fa-times");
    navbar
        .classList
        .remove("active");

    section.forEach((sec) => {
        let top = window.scrollY;
        let height = sec.offsetHeight;
        let offset = sec.offsetTop - 150;
        let id = sec.getAttribute("id");

        if ((top) => offset && top < offset + height) {
            navLinks.forEach((links) => {
                links
                    .classList
                    .remove("active");
                document
                    .querySelectorAll("header .navbar a[ href*=" + id + "]")
                    .classList
                    .add("active");
            });
        }
    });
};

document.addEventListener("DOMContentLoaded", function () {
    // Replace with your API endpoint
    const apiUrl = "/products";
    // Make a GET request to the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process the product data and add it to the div
            console.log(data.products)
            data.products.forEach(product => {
                const productContainer = document.getElementById(product.popular == 'true'? "popular_dishes":"all_dishes");
                const productElement = document.createElement("div");
                productElement
                    .classList
                    .add("box");
                productElement.innerHTML = `
              <div class="image">
              <img src="${product.description}" alt="">
              <a href="#" class="fas fa-heart"></a>
              </div>
              <div class="content">
              <div class="stars">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star-half-alt" aria-hidden="true"></i>
              </div>
              <h3>${product.name}</h3>
              <p></p>
              <a href="#" class="btn">add to cart</a>
              <span class="price">₹${product.price}</span>
            </div>
              `;
                productContainer.appendChild(productElement);
            });
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });
});

document
    .querySelector("#search-icon")
    .onclick = () => {
        document
            .querySelector("#search-form")
            .classList
            .toggle("active");
    };

document
    .querySelector("#close")
    .onclick = () => {
        document
            .querySelector("#search-form")
            .classList
            .remove("active");
    };

var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: false,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false
    },
    // watchSlidesVisibility: false, centeredSlidesBounds: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },
    loop: true
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false
    },
    // watchSlidesVisibility: false, centeredSlidesBounds: true,
    loop: true,
    breakpoints: {
        0: {
            slidesPerview: 1
        },
        640: {
            slidesPerview: 2
        },
        768: {
            slidesPerview: 2
        },
        768: {
            slidesPerview: 3
        }
    }
});

function loader() {
    document
        .querySelector(".loader-container")
        .classList
        .add("fade-out");
}

function fadeOut() {
    setInterval(loader, 3000);
}

window.onload = fadeOut;
