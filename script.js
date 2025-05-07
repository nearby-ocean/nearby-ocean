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

// 區塊切換功能
function showSection(sectionId) {
  document.querySelectorAll('.main-section').forEach(sec => sec.classList.remove('active'));
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
}

// 側欄選單點擊事件
window.addEventListener('DOMContentLoaded', () => {
  // 預設顯示首頁
  showSection('home');

  // 側欄選單綁定
  document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = href.replace('#', '');
        if (target === 'portfolio' ||
            target === '風景' || target === '人像' || target === '街拍' || target === '音樂活動' ||
            target === '婚禮' || target === '活動紀錄' || target === '商案' || target === '國家地區特輯' || target === 'magazine') {
          showSection('portfolio');
          showPortfolioCategory(target);
        } else {
          showSection(target);
        }
      }
    });
  });

  // 作品集分類預設顯示
  showPortfolioCategory('風景');
});

// 作品集分類切換
function showPortfolioCategory(category) {
  document.querySelectorAll('.portfolio-category').forEach(cat => cat.style.display = 'none');
  if (category === '人像') {
    // 預設顯示人像的第一個子分類
    showPortfolioCategory('sunshine');
    return;
  }
  const cat = document.getElementById(category);
  if (cat) cat.style.display = 'block';
  // 人像子分類
  if (['sunshine','shadowless','multi','dark'].includes(category)) {
    document.getElementById('人像').style.display = 'block';
    document.querySelectorAll('#人像 > .portfolio-category').forEach(sub => sub.style.display = 'none');
    const subcat = document.getElementById(category);
    if (subcat) subcat.style.display = 'block';
  } else if (document.getElementById('人像')) {
    document.getElementById('人像').style.display = 'none';
  }
}

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
      <div class="modal-index-tip">第 ${index+1} 張／共 ${getImageArray(category).length} 張</div>
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
