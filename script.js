document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Dummy image loading (you should load real image URLs)
  const sections = ["landscape", "sunshine", "shadowless", "multi", "dark", "street", "music", "wedding", "event", "commercial", "feature"];
  sections.forEach(id => {
    const container = document.getElementById(id);
    for (let i = 1; i <= 6; i++) {
      const img = document.createElement("img");
      img.src = `assets/${id}${i}.jpg`; // replace with real paths
      img.alt = `${id} ${i}`;
      img.addEventListener("click", () => {
        const next = img.nextElementSibling || container.firstElementChild;
        next.scrollIntoView({ behavior: "smooth" });
      });
      container.appendChild(img);
    }
  });
});
