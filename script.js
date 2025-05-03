document.addEventListener("DOMContentLoaded", () => {
  const sections = ["landscape", "sunshine", "shadowless", "multi", "dark", "street", "music", "wedding", "event", "commercial", "feature"];
  sections.forEach(id => {
    const container = document.getElementById(id);
    const photos = photoData[id];
    if (container && photos) {
      photos.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${id} photo ${index + 1}`;
        img.addEventListener("click", () => {
          const nextIndex = (index + 1) % photos.length;
          img.src = photos[nextIndex];
        });
        container.appendChild(img);
      });
    }
  });

  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 500 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
