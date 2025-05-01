const gallery = document.querySelector(".gallery");
const viewer = document.querySelector(".image-viewer");
const viewerImg = document.querySelector(".viewer-image");
const topHint = document.querySelector(".top-hint");
const bottomHint = document.querySelector(".bottom-hint");
const magazine = document.querySelector("#magazine");
const portfolioSection = document.querySelector("#portfolio");

let currentImages = [];
let currentIndex = 0;
let currentCategory = "";
let subCategories = [];
let currentSubIndex = 0;

// 點擊分類按鈕
document.querySelectorAll(".category-list button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    currentCategory = category;

    if (category === "刊仔頂漁市雜誌專刊") {
      magazine.classList.remove("hidden");
      portfolioSection.classList.add("hidden");
    } else {
      magazine.classList.add("hidden");
      portfolioSection.classList.remove("hidden");
      loadGallery(category);
    }
  });
});

function loadGallery(category) {
  gallery.innerHTML = "";
  currentImages = [];

  if (category === "人像" && window.photoData["人像"]) {
    subCategories = Object.keys(window.photoData["人像"]);
    currentSubIndex = 0;
    currentImages = window.photoData["人像"][subCategories[currentSubIndex]];
  } else if (window.photoData[category]) {
    currentImages = window.photoData[category];
    subCategories = [];
  }

  currentImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.addEventListener("click", () => openViewer(currentImages, index));
    gallery.appendChild(img);
  });
}

function openViewer(images, index) {
  currentImages = images;
  currentIndex = index;
  viewer.classList.remove("hidden");
  updateViewerImage();
}

function updateViewerImage() {
  viewerImg.src = currentImages[currentIndex];
  topHint.style.visibility = currentIndex > 0 ? "visible" : "hidden";
  bottomHint.style.visibility =
    currentIndex < currentImages.length - 1 ? "visible" : "hidden";
}

viewer.addEventListener("click", (e) => {
  if (e.target === viewer || e.target.classList.contains("viewer-overlay")) {
    viewer.classList.add("hidden");
  }
});

document.addEventListener("keydown", (e) => {
  if (!viewer.classList.contains("hidden")) {
    if (e.key === "ArrowUp" && currentIndex > 0) {
      currentIndex--;
      updateViewerImage();
    } else if (e.key === "ArrowDown" && currentIndex < currentImages.length - 1) {
      currentIndex++;
      updateViewerImage();
    } else if (
      currentCategory === "人像" &&
      (e.key === "ArrowLeft" || e.key === "ArrowRight")
    ) {
      // 切換子分類
      const direction = e.key === "ArrowRight" ? 1 : -1;
      currentSubIndex = (currentSubIndex + direction + subCategories.length) % subCategories.length;
      const sub = subCategories[currentSubIndex];
      currentImages = window.photoData["人像"][sub];
      currentIndex = 0;
      updateViewerImage();
    }
  }
});

viewer.addEventListener("wheel", (e) => {
  if (e.deltaY > 0 && currentIndex < currentImages.length - 1) {
    currentIndex++;
    updateViewerImage();
  } else if (e.deltaY < 0 && currentIndex > 0) {
    currentIndex--;
    updateViewerImage();
  }
});

console.log("相片資料：", photoData);
