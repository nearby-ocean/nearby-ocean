const gallery = document.querySelector(".gallery");
const viewer = document.querySelector(".image-viewer");
const viewerImg = document.querySelector(".viewer-image");
const topHint = document.querySelector(".top-hint");
const bottomHint = document.querySelector(".bottom-hint");
let currentImages = [];
let currentIndex = 0;

// 點擊分類按鈕
document.querySelectorAll('.category-list button').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    loadGallery(category);
  });
});

function loadGallery(category) {
  gallery.innerHTML = '';

  let images = [];

  if (category === "人像" && window.photoData["人像"]) {
    const subfolders = window.photoData["人像"];
    for (let sub in subfolders) {
      images = images.concat(subfolders[sub]);
    }
  } else if (window.photoData[category]) {
    images = window.photoData[category];
  }

  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', () => openViewer(images, index));
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
  topHint.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
  bottomHint.style.visibility = currentIndex < currentImages.length - 1 ? 'visible' : 'hidden';
}

viewer.addEventListener('click', (e) => {
  if (e.target === viewer || e.target.classList.contains('viewer-overlay')) {
    viewer.classList.add("hidden");
  }
});

document.addEventListener('keydown', (e) => {
  if (!viewer.classList.contains("hidden")) {
    if (e.key === 'ArrowUp' && currentIndex > 0) {
      currentIndex--;
      updateViewerImage();
    } else if (e.key === 'ArrowDown' && currentIndex < currentImages.length - 1) {
      currentIndex++;
      updateViewerImage();
    }
  }
});

viewer.addEventListener('wheel', (e) => {
  if (e.deltaY > 0 && currentIndex < currentImages.length - 1) {
    currentIndex++;
  } else if (e.deltaY < 0 && currentIndex > 0) {
    currentIndex--;
  }
  updateViewerImage();
});
console.log(photoData);
