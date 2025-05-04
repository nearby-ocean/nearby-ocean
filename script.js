// script.js

window.addEventListener("DOMContentLoaded", () => {
  if (typeof photoData === 'undefined') {
    console.error("photoData 未定義");
    return;
  }

  photoData.forEach(({ id, images }) => {
    const section = document.getElementById(id);
    if (!section) return;

    const container = document.createElement("div");
    container.className = "image-gallery";

    images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${id}-${index}`;
      img.className = "gallery-image";
      img.dataset.index = index;
      img.dataset.category = id;

      img.addEventListener("click", () => openFullscreenModal(id, index));
      container.appendChild(img);
    });

    section.appendChild(container);
  });
});

window.addEventListener("load", () => {
  const bg = document.getElementById("background");
  if (bg) {
    bg.style.backgroundImage = "url('images/background.jpg')";
    bg.style.backgroundSize = "cover";
    bg.style.backgroundPosition = "center";
    bg.style.position = "fixed";
    bg.style.top = 0;
    bg.style.left = 0;
    bg.style.width = "100%";
    bg.style.height = "100%";
    bg.style.zIndex = "-1";
  }

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }
});

let currentImageIndex = 0;
let currentCategory = "";

function openFullscreenModal(category, index) {
  currentCategory = category;
  currentImageIndex = index;

  const modal = document.createElement("div");
  modal.id = "fullscreen-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <img id="fullscreen-image" src="${photoData.find(d => d.id === category).images[index]}" />
      <button id="prev-button">◀</button>
      <button id="next-button">▶</button>
      <button id="close-button">✖</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("prev-button").addEventListener("click", showPrevImage);
  document.getElementById("next-button").addEventListener("click", showNextImage);
  document.getElementById("close-button").addEventListener("click", () => modal.remove());
}

function showPrevImage() {
  const images = photoData.find(d => d.id === currentCategory).images;
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("fullscreen-image").src = images[currentImageIndex];
}

function showNextImage() {
  const images = photoData.find(d => d.id === currentCategory).images;
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById("fullscreen-image").src = images[currentImageIndex];
}

// 手機滑動支援
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
}, false);

function handleSwipeGesture() {
  if (touchEndX < touchStartX - 50) showNextImage();
  if (touchEndX > touchStartX + 50) showPrevImage();
}
