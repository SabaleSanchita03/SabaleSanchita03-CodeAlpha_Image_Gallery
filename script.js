// =========================
// DARK MODE
// =========================
function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
}


// =========================
// ELEMENTS
// =========================
const gallery = document.querySelector("main");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const uploadInput = document.getElementById("uploadInput");
const favBtn = document.getElementById("favBtn");

let currentImage = "";
let favorites = [];


// =========================
// GET ALL IMAGES (LIVE DOM)
// =========================
function getImages() {
    return Array.from(document.querySelectorAll("main .image img"));
}


// =========================
// OPEN LIGHTBOX
// =========================
function openLightbox(index) {
    const images = getImages();

    if (index < 0 || index >= images.length) return;

    currentImage = images[index].src;
    lightboxImg.src = currentImage;

    lightbox.dataset.index = index;

    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");

    updateFavButton();
}


// bind all images click
function bindImages() {
    const images = getImages();

    images.forEach((img, index) => {
        img.onclick = () => openLightbox(index);
    });
}

// initial bind
bindImages();


// =========================
// CLOSE LIGHTBOX
// =========================
function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    lightboxImg.classList.remove("zoom-active");
}

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});


// =========================
// NEXT / PREV
// =========================
nextBtn.addEventListener("click", () => {
    const images = getImages();
    let index = Number(lightbox.dataset.index || 0);

    index = (index + 1) % images.length;
    openLightbox(index);
});

prevBtn.addEventListener("click", () => {
    const images = getImages();
    let index = Number(lightbox.dataset.index || 0);

    index = (index - 1 + images.length) % images.length;
    openLightbox(index);
});


// =========================
// FILTER IMAGES
// =========================
function filterImages(category) {
    const items = document.querySelectorAll(".image");

    items.forEach((item) => {
        if (category === "all") {
            item.style.display = "block";
        } else {
            item.style.display = item.classList.contains(category)
                ? "block"
                : "none";
        }
    });
}


// =========================
// SHOW ALL
// =========================
function showAllImages() {
    const items = document.querySelectorAll(".image");
    items.forEach(item => item.style.display = "block");
}


// =========================
// FAVORITES FILTER (FIXED)
// =========================
function showFavorites() {
    const items = document.querySelectorAll(".image");

    items.forEach((item) => {
        const img = item.querySelector("img");

        if (favorites.includes(img.src)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}


// =========================
// FAVORITE TOGGLE
// =========================
function toggleFavorite() {

    if (!currentImage) return;

    if (favorites.includes(currentImage)) {
        favorites = favorites.filter(img => img !== currentImage);
    } else {
        favorites.push(currentImage);
    }

    updateFavButton();

    console.log("Favorites:", favorites);
}


// update heart icon
function updateFavButton() {
    if (!favBtn) return;

    if (favorites.includes(currentImage)) {
        favBtn.innerHTML = "❤️";
    } else {
        favBtn.innerHTML = "🤍";
    }
}


// =========================
// DOWNLOAD IMAGE
// =========================
function downloadImage() {
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = "gallery-image.jpg";
    link.click();
}


// =========================
// SHARE IMAGE
// =========================
function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: "Image from Gallery",
            url: currentImage
        });
    } else {
        alert("Sharing not supported");
    }
}


// =========================
// DELETE IMAGE (FIXED)
// =========================
function deleteImage() {

    const images = getImages();

    images.forEach((img) => {
        if (img.src === currentImage) {
            img.parentElement.remove();
        }
    });

    closeLightbox();
    bindImages();
}


// =========================
// ZOOM EFFECT (BLUE GLOW)
// =========================
lightboxImg.addEventListener("click", () => {
    lightboxImg.classList.toggle("zoom-active");
});


// =========================
// KEYBOARD CONTROLS
// =========================
document.addEventListener("keydown", (e) => {

    const isOpen = !lightbox.classList.contains("hidden");
    if (!isOpen) return;

    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "Escape") closeLightbox();
});


// =========================
// UPLOAD IMAGE
// =========================
uploadInput.addEventListener("change", function () {

    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const div = document.createElement("div");
        div.className = "image uploaded rounded-xl overflow-hidden shadow-lg";

        div.innerHTML = `
            <img src="${e.target.result}" 
                 class="w-full h-64 object-cover cursor-pointer hover:scale-105 transition">
        `;

        gallery.appendChild(div);

        bindImages();
    };

    reader.readAsDataURL(file);
});