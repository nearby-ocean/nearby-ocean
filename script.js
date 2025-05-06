// script.js

window.addEventListener("DOMContentLoaded", () => {
  if (typeof photoData === 'undefined') {
    console.error("photoData 未定義");
    return;
  }

  for (const [category, data] of Object.entries(photoData)) {
    // 檢查是否為「人像」子類
    if (typeof data === "object" && !Array.isArray(data)) {
      for (const [subCategory, images] of Object.entries(data)) {
        const section = document.getElementById(subCategory);
        if (!section) continue;

        const container = document.createElement("div");
        container.className = "image-gallery";

        images.forEach((src, index) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = `${subCategory}-${index}`;
          img.className = "gallery-image";
          img.dataset.index = index;
          img.dataset.category = subCategory;

          img.addEventListener("click", () => openFullscreenModal(subCategory, index));
          container.appendChild(img);
        });

        section.appendChild(container);
      }
    } else {
      // 非人像類別直接處理
      const section = document.getElementById(category);
      if (!section) continue;

      const container = document.createElement("div");
      container.className = "image-gallery";

      data.forEach((src, index) => {
        if (src.endsWith(".pdf")) {
          const iframe = document.createElement("iframe");
          iframe.src = src;
          iframe.width = "100%";
          iframe.height = "600px";
          container.appendChild(iframe);
        } else {
          const img = document.createElement("img");
          img.src = src;
          img.alt = `${category}-${index}`;
          img.className = "gallery-image";
          img.dataset.index = index;
          img.dataset.category = category;

          img.addEventListener("click", () => openFullscreenModal(category, index));
          container.appendChild(img);
        }
      });

      section.appendChild(container);
    }
  }
});

// 背景圖片設定
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
    bg.style.opacity = "0.6";
  }

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }
});

// 圖片點擊展示功能
let currentImageIndex = 0;
let currentCategory = "";

function openFullscreenModal(category, index) {
  currentCategory = category;
  currentImageIndex = index;

  const modal = document.createElement("div");
  modal.id = "fullscreen-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <img id="fullscreen-image" src="${getImageSrc(category, index)}" />
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

function getImageArray(category) {
  for (const [mainCategory, data] of Object.entries(photoData)) {
    if (typeof data === "object" && !Array.isArray(data)) {
      if (data[category]) return data[category];
    } else if (mainCategory === category) {
      return data;
    }
  }
  return [];
}

function getImageSrc(category, index) {
  const images = getImageArray(category);
  return images[index];
}

function showPrevImage() {
  const images = getImageArray(currentCategory);
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("fullscreen-image").src = images[currentImageIndex];
}

function showNextImage() {
  const images = getImageArray(currentCategory);
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
