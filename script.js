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
        if (target === 'portfolio') {
          showSection('portfolio');
          showPortfolioCategory('風景');
        } else if (
            target === '風景' || target === '人像' || target === '街拍' || target === '音樂活動' ||
            target === '婚禮' || target === '活動紀錄' || target === '商案' || target === '國家地區特輯' || target === 'magazine' ||
            target === '日本' || target === '史瓦帝尼' ||
            target === 'sunshine' || target === 'shadowless' || target === 'multi' || target === 'dark') {
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
    showPortfolioCategory('sunshine');
    return;
  }
  const cat = document.getElementById(category);
  if (cat) cat.style.display = 'block';
  // 人像子分類
  if (['sunshine','shadowless','multi','dark'].includes(category)) {
    document.getElementById('人像').style.display = 'flex';
    document.querySelectorAll('#人像 > .portfolio-category').forEach(sub => sub.style.display = 'none');
    const subcat = document.getElementById(category);
    if (subcat) subcat.style.display = 'block';
  } else if (document.getElementById('人像')) {
    document.getElementById('人像').style.display = 'none';
  }
  // 國家地區特輯子分類
  if (category === '國家地區特輯') {
    document.querySelectorAll('.portfolio-country').forEach(c => c.style.display = 'block');
  } else if (['日本','史瓦帝尼'].includes(category)) {
    document.getElementById('國家地區特輯').style.display = 'block';
    document.querySelectorAll('.portfolio-country').forEach(c => c.style.display = 'none');
    const subcat = document.getElementById(category);
    if (subcat) subcat.style.display = 'block';
  }
}

// 圖片點擊展示功能
let currentImageIndex = 0;
let currentCategory = "";

function openFullscreenModal(category, index) {
  currentCategory = category;
  currentImageIndex = index;
  const images = getImageArray(category);
  const modal = document.createElement("div");
  modal.id = "fullscreen-modal";
  modal.innerHTML = `
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-loading">載入中...</div>
      <img id="fullscreen-image" src="${images[index]}" onload="this.parentElement.querySelector('.modal-loading').style.display='none'" onerror="this.parentElement.querySelector('.modal-loading').textContent='圖片載入失敗'"/>
      <div class="modal-index-tip">第 ${index+1} 張／共 ${images.length} 張</div>
      <button id="prev-button">◀</button>
      <button id="next-button">▶</button>
      <button id="close-button">×</button>
    </div>
  `;
  
  // 點擊遮罩關閉
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  
  // 關閉按鈕
  const closeButton = modal.querySelector('#close-button');
  closeButton.addEventListener('click', closeModal);
  
  // 上一張/下一張按鈕
  modal.querySelector("#prev-button").addEventListener("click", e => { e.stopPropagation(); showPrevImage(); });
  modal.querySelector("#next-button").addEventListener("click", e => { e.stopPropagation(); showNextImage(); });
  
  // 鍵盤控制
  const handleKeyDown = e => {
    switch(e.key) {
      case 'ArrowLeft': showPrevImage(); break;
      case 'ArrowRight': showNextImage(); break;
      case 'Escape': closeModal(); break;
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  
  // 滑鼠滾輪控制
  modal.addEventListener('wheel', e => {
    e.preventDefault();
    if (e.deltaY > 0) showNextImage();
    else showPrevImage();
  });
  
  document.body.appendChild(modal);
  
  // 關閉模態框時清理事件監聽器
  function closeModal() {
    document.removeEventListener('keydown', handleKeyDown);
    modal.remove();
  }
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

function updateModalImage() {
  const images = getImageArray(currentCategory);
  const modalImg = document.getElementById("fullscreen-image");
  const loading = modalImg.parentElement.querySelector('.modal-loading');
  if (loading) loading.style.display = 'block';
  if (modalImg) {
    modalImg.src = images[currentImageIndex];
    modalImg.onload = () => loading.style.display = 'none';
    modalImg.onerror = () => loading.textContent = '圖片載入失敗';
  }
  const tip = document.querySelector('.modal-index-tip');
  if (tip) tip.textContent = `第 ${currentImageIndex+1} 張／共 ${images.length} 張`;
}

function showPrevImage() {
  const images = getImageArray(currentCategory);
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateModalImage();
}

function showNextImage() {
  const images = getImageArray(currentCategory);
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateModalImage();
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

// 圖片延遲載入
function lazyLoadImages() {
  const images = document.querySelectorAll('.photo-item img:not(.loaded)');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => {
          img.classList.add('loaded');
          observer.unobserve(img);
        };
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  images.forEach(img => imageObserver.observe(img));
}

// 優化動畫效能
function optimizeAnimations() {
  const photoItems = document.querySelectorAll('.photo-item');
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  photoItems.forEach(item => animationObserver.observe(item));
}

// 錯誤處理
function handleImageError(img) {
  img.onerror = function() {
    this.src = 'images/error.jpg';
    this.alt = '圖片載入失敗';
  };
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  optimizeAnimations();
  
  // 為所有圖片添加錯誤處理
  document.querySelectorAll('img').forEach(handleImageError);
});

// 防止圖片被拖曳
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// 防止右鍵選單
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// 防止複製
document.addEventListener('copy', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});
