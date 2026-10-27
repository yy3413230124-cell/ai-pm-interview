(() => {
  const body = document.body;
  const root = body.dataset.root || "";
  const index = Array.isArray(window.INTERVIEW_SEARCH_INDEX) ? window.INTERVIEW_SEARCH_INDEX : [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const normalize = (value = "") =>
    String(value)
      .toLocaleLowerCase("zh-CN")
      .replace(/[^\p{L}\p{N}]+/gu, "");

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const header = document.querySelector("[data-header]");
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    const backTop = document.querySelector("[data-back-top]");
    backTop?.classList.toggle("is-visible", window.scrollY > 700);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const drawer = document.querySelector("[data-mobile-drawer]");
  const openDrawer = () => {
    if (!drawer) return;
    drawer.hidden = false;
    document.body.classList.add("is-locked");
  };
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.hidden = true;
    document.body.classList.remove("is-locked");
  };
  document.querySelectorAll("[data-menu-open]").forEach((button) =>
    button.addEventListener("click", openDrawer),
  );
  document.querySelectorAll("[data-menu-close]").forEach((button) =>
    button.addEventListener("click", closeDrawer),
  );
  drawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDrawer));

  const searchDialog = document.querySelector("[data-search-dialog]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");
  let searchReturnFocus = null;

  const openSearch = () => {
    if (!searchDialog || typeof searchDialog.showModal !== "function") return;
    searchReturnFocus = document.activeElement;
    if (!searchDialog.open) searchDialog.showModal();
    document.body.classList.add("is-locked");
    window.setTimeout(() => searchInput?.focus(), 40);
    if (searchInput && !searchInput.value) renderSearchResults("");
  };

  const closeSearch = () => {
    if (!searchDialog?.open) return;
    searchDialog.close();
  };

  document.querySelectorAll("[data-search-open]").forEach((button) =>
    button.addEventListener("click", openSearch),
  );
  document.querySelectorAll("[data-search-close]").forEach((button) =>
    button.addEventListener("click", closeSearch),
  );
  searchDialog?.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    searchReturnFocus?.focus?.();
  });
  searchDialog?.addEventListener("click", (event) => {
    if (event.target === searchDialog) closeSearch();
  });

  function renderSearchResults(query) {
    if (!searchResults) return;
    const needle = normalize(query);
    const matched = index
      .map((item) => {
        const titleScore = needle && normalize(item.title).includes(needle) ? 2 : 0;
        const categoryScore = needle && normalize(item.category).includes(needle) ? 1 : 0;
        const bodyScore = needle && item.search.includes(needle) ? 1 : 0;
        return { item, score: titleScore + categoryScore + bodyScore };
      })
      .filter((entry) => !needle || entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);

    if (!needle) {
      searchResults.innerHTML = `
        <div class="search-empty search-empty-start">
          <span>QUICK START</span>
          <h3>试试这些关键词</h3>
          <div class="quick-searches">
            ${["Agent", "RAG", "MCP", "LoRA", "上下文", "LangGraph"]
              .map((term) => `<button type="button" data-search-term="${term}">${term}</button>`)
              .join("")}
          </div>
        </div>`;
    } else if (matched.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <span>?</span>
          <h3>没有找到“${escapeHtml(query)}”</h3>
          <p>试试工具名称、模型概念或更短的关键词。</p>
        </div>`;
    } else {
      searchResults.innerHTML = matched
        .map(
          ({ item }) => `
            <a class="search-result" href="${root}${escapeHtml(item.href)}">
              <span>${escapeHtml(item.category)}</span>
              <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.summary)}</p></div>
              <i>→</i>
            </a>`,
        )
        .join("");
    }
    searchResults.querySelectorAll("[data-search-term]").forEach((button) => {
      button.addEventListener("click", () => {
        searchInput.value = button.dataset.searchTerm;
        renderSearchResults(searchInput.value);
        searchInput.focus();
      });
    });
    searchResults.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        document.body.classList.remove("is-locked");
      }),
    );
  }

  searchInput?.addEventListener("input", () => renderSearchResults(searchInput.value));

  const libraryGrid = document.querySelector("[data-question-grid]");
  const cards = [...document.querySelectorAll("[data-question-card]")];
  const categoryButtons = [...document.querySelectorAll("[data-filter]")];
  const librarySearch = document.querySelector("[data-library-search]");
  const resultCount = document.querySelector("[data-result-count]");
  const emptyState = document.querySelector("[data-library-empty]");
  const loadMoreButton = document.querySelector("[data-load-more]");
  const loadMoreCount = document.querySelector("[data-load-more-count]");
  let activeCategory = "all";
  let visibleLimit = 16;

  function applyLibraryFilters(resetLimit = false) {
    if (!cards.length) return;
    if (resetLimit) visibleLimit = 16;
    const query = normalize(librarySearch?.value || "");
    const matched = cards.filter((card) => {
      const categoryMatch = activeCategory === "all" || card.dataset.category === activeCategory;
      const textMatch = !query || card.dataset.search.includes(query);
      return categoryMatch && textMatch;
    });

    let visibleItems = 0;
    cards.forEach((card) => {
      const matchingIndex = matched.indexOf(card);
      const shouldShow = matchingIndex >= 0 && matchingIndex < visibleLimit;
      card.hidden = !shouldShow;
      if (shouldShow) visibleItems += 1;
    });

    if (resultCount) resultCount.textContent = String(matched.length);
    if (emptyState) emptyState.hidden = matched.length !== 0;
    if (libraryGrid) libraryGrid.hidden = matched.length === 0;

    const remaining = Math.max(0, matched.length - visibleItems);
    if (loadMoreButton) loadMoreButton.hidden = remaining === 0;
    if (loadMoreCount) loadMoreCount.textContent = String(remaining);
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      categoryButtons.forEach((item) =>
        item.classList.toggle("is-active", item === button),
      );
      applyLibraryFilters(true);
    });
  });

  librarySearch?.addEventListener("input", () => applyLibraryFilters(true));
  loadMoreButton?.addEventListener("click", () => {
    visibleLimit += 16;
    applyLibraryFilters(false);
  });
  document.querySelector("[data-reset-filter]")?.addEventListener("click", () => {
    activeCategory = "all";
    if (librarySearch) librarySearch.value = "";
    categoryButtons.forEach((button) =>
      button.classList.toggle("is-active", button.dataset.filter === "all"),
    );
    applyLibraryFilters(true);
  });

  if (cards.length) applyLibraryFilters(false);

  const initialQuery = new URLSearchParams(window.location.search).get("q");
  if (initialQuery && librarySearch) {
    librarySearch.value = initialQuery;
    applyLibraryFilters(true);
  }

  document.querySelectorAll("[data-random]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!index.length) return;
      const randomIndex = Math.floor(Math.random() * index.length);
      window.location.href = `${root}${index[randomIndex].href}`;
    });
  });

  document.querySelectorAll("[data-back-top]").forEach((button) =>
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }),
  );

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;
    if (event.key === "/" && !isTyping && !searchDialog?.open) {
      if (librarySearch) {
        event.preventDefault();
        librarySearch.focus();
        librarySearch.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      } else {
        event.preventDefault();
        openSearch();
      }
    }
  });

  if (!reduceMotion) {
    requestAnimationFrame(() => document.body.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px" },
    );
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  }

  const progressBar = document.querySelector("[data-reading-progress]");
  const tocProgress = document.querySelector("[data-toc-progress]");
  const tocProgressBar = document.querySelector("[data-toc-progress-bar]");
  const article = document.querySelector(".article-paper");
  const articleEnd = document.querySelector("[data-article-feishu]");
  const updateReadingProgress = () => {
    if (!article) return;
    const start = article.offsetTop;
    const end = (articleEnd?.offsetTop || article.offsetHeight + start) + article.offsetHeight * 0.15;
    const distance = Math.max(1, end - start - window.innerHeight * 0.35);
    const progress = Math.min(1, Math.max(0, (window.scrollY - start + 100) / distance));
    const percent = Math.round(progress * 100);
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (tocProgress) tocProgress.textContent = `${percent}%`;
    if (tocProgressBar) tocProgressBar.style.width = `${percent}%`;
  };
  if (article) {
    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
  }

  const tocLinks = [...document.querySelectorAll("[data-toc] a")];
  if (tocLinks.length) {
    const headingMap = new Map(
      tocLinks
        .map((link) => [document.getElementById(link.hash.slice(1)), link])
        .filter(([heading]) => heading),
    );
    const tocObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        tocLinks.forEach((link) => link.classList.remove("is-active"));
        headingMap.get(visible[0].target)?.classList.add("is-active");
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 1] },
    );
    headingMap.forEach((_link, heading) => tocObserver.observe(heading));
  }

  document.querySelectorAll(".copy-code").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.closest(".code-shell")?.querySelector("code")?.textContent || "";
      const copied = await copyText(code);
      if (!copied) return;
      const original = button.textContent;
      button.textContent = "已复制";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 1500);
    });
  });

  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      const copied = await copyText(window.location.href);
      if (!copied) return;
      const original = button.innerHTML;
      button.textContent = "链接已复制";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.innerHTML = original;
        button.classList.remove("is-copied");
      }, 1600);
    });
  });

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    }
  }

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  document.querySelectorAll(".image-zoom").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      if (!image || !lightbox || !lightboxImage) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.showModal();
      document.body.classList.add("is-locked");
    });
  });
  document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
    lightbox?.close();
  });
  lightbox?.addEventListener("close", () => document.body.classList.remove("is-locked"));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
})();
