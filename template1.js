// The native <details> element opens the menu. Add convenient ways to close it.
const menu = document.querySelector(".header details.links");

if (menu) {
    const menuButton = menu.querySelector("summary");

    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", () => {
            menu.open = false;
        });
    });

    document.addEventListener("click", (event) => {
        if (menu.open && !menu.contains(event.target)) {
            menu.open = false;
        }
    });

    document.addEventListener("keydown", (event) => {
        if (menu.open && event.key === "Escape") {
            menu.open = false;
            menuButton.focus();
        }
    });
}

// Build filter buttons from the categories already listed on the portfolio cards.
const portfolioGrid = document.querySelector(".portfolio-content");
const cards = [...document.querySelectorAll(".portfolio-content .card[data-category]")];

if (cards.length > 0) {
    const categories = [...new Set(cards.map((card) => card.dataset.category))];
    const controls = document.createElement("div");
    controls.className = "portfolio-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Filter sample projects");

    const status = document.createElement("span");
    status.setAttribute("role", "status");

    const filters = [null, ...categories].map((category) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = category ?? "All";
        button.setAttribute("aria-pressed", String(category === null));
        controls.append(button);
        return { category, button };
    });

    filters.forEach(({ category, button }) => {
        button.addEventListener("click", () => {
            filters.forEach((filter) => {
                filter.button.setAttribute("aria-pressed", String(filter.button === button));
            });

            let visibleCount = 0;
            cards.forEach((card) => {
                card.hidden = category !== null && card.dataset.category !== category;
                if (!card.hidden) {
                    visibleCount++;
                }
            });

            const label = visibleCount === 1 ? "project" : "projects";
            status.textContent = `Showing ${visibleCount} ${label}.`;
        });
    });

    controls.append(document.createElement("br"), status);
    portfolioGrid.before(controls);
}

// Keep the original image paths. Show a text tile if an image cannot load.
document.querySelectorAll("img[data-fallback]").forEach((img) => {
    function showImageFallback() {
        const tile = document.createElement("div");
        tile.className = "visual";
        tile.textContent = img.dataset.fallback;
        tile.setAttribute("aria-hidden", "true");
        img.replaceWith(tile);
    }

    img.addEventListener("error", showImageFallback, { once: true });

    if (img.complete && img.naturalWidth === 0) {
        showImageFallback();
    }
});