<template>
  <div
    class="glossary-page pt-[calc(25px+5vh)] max-w-[1600px] mx-auto pb-20 flex items-start relative gap-8 lg:gap-20 px-5 md:px-8 lg:px-11 flex-col lg:flex-row"
  >
    <!-- Sidebar -->
    <div
      class="sidebar lg:sticky lg:top-[calc(108px+5vh)] w-full lg:w-[320px] self-start shrink-0 lg:h-[calc(100vh-150px)] flex flex-col gap-4"
    >
      <div class="sidebar-header flex items-center gap-1.5 shrink-0">
        <h1
          class="page-title text-black"
        >
          Glossary
        </h1>
        <button
          @click="showInfoModal = true"
          type="button"
          class="icon-btn text-[1.6rem] p-1 rounded-lg hover:bg-[#F5F1F5] text-primary-color transition-colors"
          aria-label="Glossary information"
        >
          <i class="ph ph-info"></i>
        </button>
      </div>

      <div
        class="input-bar glossary-search-bar bg-white flex items-center gap-2 py-2 w-full overflow-hidden shrink-0"
      >
        <input
          v-model="searchQuery"
          @input="handleSearchInput"
          placeholder="Search glossary..."
          type="text"
          id="glossary-search"
          autocomplete="off"
          class="flex-1 p-2 body-copy-sm border-none outline-none min-w-0"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          type="button"
          class="glossary-search-btn text-primary-color text-[1.2rem] px-1 hover:bg-gray-100 rounded"
        >
          <i class="ph ph-x"></i>
        </button>
        <button
          v-else
          type="button"
          class="glossary-search-icon text-primary-color text-[1.2rem] pr-1"
        >
          <i class="ph-bold ph-magnifying-glass"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav
        class="glossary-nav relative p-0 px-2 flex flex-col w-full overflow-y-auto flex-1 custom-scrollbar"
      >
        <ul class="list-none p-0 m-0 flex flex-col gap-1">
          <li
            v-for="(section, index) in filteredGlossary"
            :key="index"
            class="glossary-nav-section"
          >
            <button
              class="w-full flex items-center justify-between text-left text-[0.95rem] font-serif font-medium border-border-color border-b text-dark-bg hover:text-primary-color py-2 px-2 hover:bg-gray-50 transition-colors"
              @click="toggleSectionNav(index)"
            >
              <span
                >{{ section.title }}
                <span class="text-xs text-gray-500 font-sans ml-0.5"
                  >({{ section.items.length }})</span
                ></span
              >
              <i
                :class="
                  section.navExpanded
                    ? 'ph-bold ph-caret-down'
                    : 'ph-bold ph-caret-right'
                "
                class="text-primary-color"
              ></i>
            </button>

            <!-- Sub-items in nav -->
            <ul
              v-show="section.navExpanded || searchQuery"
              class="pl-4 mt-1 border-l border-gray-200 ml-2"
            >
              <li
                v-for="(item, iIdx) in section.items"
                :key="iIdx"
                v-show="matchesSearch(item)"
              >
                <a
                  :href="`#item-${index}-${iIdx}`"
                  class="block body-copy-sm text-gray-600 hover:text-primary-color px-2 py-1 rounded truncate"
                  @click.prevent="scrollToItem(index, iIdx)"
                >
                  <span class="font-mono text-[0.78rem] text-primary-color mr-2"
                    >{{ iIdx + 1 }}.</span
                  >
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <p
          v-if="filteredGlossary.length === 0"
          class="text-sm text-gray-500 italic text-center mt-4"
        >
          No glossary terms match your search.
        </p>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="container-glossary-main-content flex-1 max-w-[960px] min-w-0">
      <div class="glossary-main-content w-full pb-16" ref="glossaryContent">
        <div
          v-if="loading"
          class="loading text-center text-2xl text-gray-400 mt-10"
        >
          Loading glossary...
        </div>

        <div
          v-else-if="filteredGlossary.length === 0"
          class="no-results text-center text-xl text-gray-500 mt-8"
        >
          No glossary items found.
        </div>

        <div v-else class="glossary-sections flex flex-col gap-16">
          <section
            v-for="(section, index) in filteredGlossary"
            :key="index"
            :id="`section-${index}`"
            class="glossary-section scroll-mt-[150px]"
          >
            <h2
              class="section-title text-dark-bg pb-2 border-b-2 border-border-color"
            >
              {{ section.title }}
            </h2>

            <div class="glossary-items flex flex-col gap-8">
              <div
                v-for="(item, iIdx) in section.items"
                :key="iIdx"
                v-show="matchesSearch(item)"
                class="glossary-item scroll-mt-[180px]"
                :id="`item-${index}-${iIdx}`"
              >
                <!-- Item Header (Level 1) -->
                <div class="glossary-item-level-1">
                  <h3
                    :id="`item-title-${index}-${iIdx}`"
                    :data-term-title="(item.title || '').toLowerCase()"
                    class="glossary-item-title text-[1.25rem] font-medium text-dark-bg m-0 flex items-baseline scroll-mt-[180px]"
                  >
                    <span
                      class="glossary-item-number font-mono text-primary-color font-semibold mr-2"
                      >{{ iIdx + 1 }}.</span
                    >
                    <span
                      class="glossary-item-title-text"
                      v-html="highlightText(item.title)"
                    ></span>
                  </h3>
                  <div
                    v-if="hasDescription(item.description)"
                    class="glossary-item-description body-copy-sm text-[#333]"
                    v-html="highlightText(item.description)"
                  ></div>
                </div>

                <!-- Nested Children (Level 2) -->
                <div
                  v-if="item.children && item.children.length > 0"
                  class="glossary-subitems mt-4 flex flex-col gap-6 pl-8 border-l border-border-color ml-2"
                >
                  <div
                    v-for="(child, cIdx) in item.children"
                    :key="cIdx"
                    class="glossary-item-level-2"
                  >
                    <h4
                      :id="`child-title-${index}-${iIdx}-${cIdx}`"
                      :data-term-title="(child.title || '').toLowerCase()"
                      class="glossary-item-title text-[1.15rem] font-medium text-dark-bg mb-1 flex items-baseline scroll-mt-[180px]"
                    >
                      <span
                        class="glossary-item-number font-mono text-primary-color font-semibold mr-2"
                        >{{ iIdx + 1 }}.{{ cIdx + 1 }}</span
                      >
                      <span v-html="highlightText(child.title)"></span>
                    </h4>
                    <div
                      v-if="hasDescription(child.description)"
                      class="glossary-item-description body-copy text-[#333]"
                      v-html="highlightText(child.description)"
                    ></div>

                    <!-- Level 3 -->
                    <div
                      v-if="child.children && child.children.length > 0"
                      class="glossary-subitems mt-3 flex flex-col gap-4 pl-6 border-l border-border-color ml-2"
                    >
                      <div
                        v-for="(grandchild, gIdx) in child.children"
                        :key="gIdx"
                        class="glossary-item-level-3"
                      >
                        <h5
                          :id="`grandchild-title-${index}-${iIdx}-${cIdx}-${gIdx}`"
                          :data-term-title="
                            (grandchild.title || '').toLowerCase()
                          "
                          class="glossary-item-title text-[1.05rem] font-medium text-dark-bg mb-1 flex items-baseline scroll-mt-[180px]"
                        >
                          <span
                            class="glossary-item-number font-mono text-primary-color font-semibold mr-2"
                            >{{ iIdx + 1 }}.{{ cIdx + 1 }}.{{ gIdx + 1 }}</span
                          >
                          <span v-html="highlightText(grandchild.title)"></span>
                        </h5>
                        <div
                          v-if="hasDescription(grandchild.description)"
                          class="glossary-item-description body-copy text-[#333]"
                          v-html="highlightText(grandchild.description)"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <div
      v-if="showInfoModal"
      class="modal fixed inset-0 bg-black/40 flex items-center justify-center z-[200]"
      @click.self="showInfoModal = false"
    >
      <div
        class="modal-content bg-bg-color border border-border-color rounded-[1rem] p-[1.25rem] sm:p-[2.2rem_2.5rem] max-w-[540px] w-[92vw] shadow-2xl relative"
      >
        <div class="modal-header flex items-center justify-between gap-4 mb-4">
          <h2 class="section-title leading-tight">
            About GVD Glossary
          </h2>
          <button
            @click="showInfoModal = false"
            class="modal-close text-primary-color text-2xl"
          >
            <i class="ph ph-x"></i>
          </button>
        </div>
        <p class="text-black body-copy mb-6">
          This glossary defines terms used in the schema which guides the
          tagging process. The glossary functions as a way to define terms
          outside of where they fall in the organizational structure of the
          schema as well as to provide more information about what topics
          specific terms are encompassing.
        </p>
        <div class="modal-actions flex justify-center">
          <button
            @click="showInfoModal = false"
            class="primary-btn bg-primary-color text-white px-20 py-2.5 rounded-full hover:bg-dark-bg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Glossary",
  data() {
    return {
      searchQuery: "",
      showInfoModal: false,
      loading: false,
      error: null,
      parsedGlossary: [],
      searchTimer: null,
    };
  },
  computed: {
    ...mapState(["cachedGlossaryArticles"]),

    filteredGlossary() {
      // Return parsed glossary directly but with visibility state
      // Real filtering logic if needed, but here we just pass it through
      // and use v-show in template for search matching.
      return this.parsedGlossary;
    },
  },
  methods: {
    ...mapActions([
      "fetchAndCacheGlossaryArticles",
      "loadCachedGlossaryArticles",
      "addTag",
    ]),

    async initializeGlossary() {
      this.loading = true;
      try {
        await this.loadCachedGlossaryArticles();
        let articles = this.cachedGlossaryArticles;

        if (!articles || articles.length === 0) {
          articles = await this.fetchAndCacheGlossaryArticles();
        }

        if (articles && articles.length > 0) {
          const glossaryHtml = articles[0].attributes.body.value;
          this.parseGlossaryHTML(glossaryHtml);
        }
      } catch (err) {
        this.error = "Failed to load glossary.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    parseGlossaryHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const sections = [];
      let currentSection = null;

      const bodyChildren = Array.from(doc.body.children);

      bodyChildren.forEach((el) => {
        const tagName = el.tagName;
        const textContent = el.textContent.trim();

        // Detect Section Header: H-tag or Paragraph with Strong Roman Numeral
        // Regex: Starts with Roman Numeral (I., II., III.) followed by text
        const isRomanHeader =
          /^[IVX]+\.\s/.test(textContent) &&
          (tagName === "P" || tagName === "DIV");

        if (
          ["H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName) ||
          isRomanHeader
        ) {
          const title = textContent;
          currentSection = {
            title: title,
            items: [],
            navExpanded: false, // Default collapsed
          };
          sections.push(currentSection);
        } else if ((tagName === "OL" || tagName === "UL") && currentSection) {
          const items = this.parseList(el);
          currentSection.items.push(...items);
        }
      });

      // Remove empty sections
      this.parsedGlossary = sections.filter((s) => s.items.length > 0);
    },

    parseList(olElement) {
      const items = [];
      const lis = Array.from(olElement.children).filter(
        (child) => child.tagName === "LI",
      );

      lis.forEach((li) => {
        const liClone = li.cloneNode(true);

        // Extract nested lists first to separate them from content
        const nestedList = liClone.querySelector("ol, ul");
        let children = [];
        if (nestedList) {
          children = this.parseList(nestedList);
          nestedList.remove();
        }

        // Extract Title
        let title = "";
        const strong = liClone.querySelector("strong");
        if (strong) {
          title = strong.textContent.trim().replace(/[:\-\.]\s*$/, "");
          strong.remove();
        } else {
          // Fallback: Split by colon if no bold tag
          const text = liClone.textContent;
          const colonIndex = text.indexOf(":");
          if (colonIndex > 0 && colonIndex < 50) {
            // Limit title length assumption
            title = text.substring(0, colonIndex).trim();
            liClone.textContent = text.substring(colonIndex + 1);
          } else {
            // Fallback 2: Just take the whole text if short, or first sentence?
            // Better to have no title and just description if unclear, or use entire text as title if very short.
            // For glossary, assuming Title is key. Let's use first few words if no delimiter? No, safer to leave blank or use full text.
            // Let's assume the first text node is the title if valid.
            title = text.split(/[:.]/)[0].trim(); // Try splitting by first sentence/colon
          }
        }

        // Extract Description
        let description = liClone.innerHTML.trim();
        // Clean up leading punctuation from description (like ": " or "- ")
        description = description.replace(/^[:\-\.]\s*/, "");

        // If description is empty and we split by colon, the remaining text might be in textContent
        if (!description && !strong) {
          // handled by split logic above implicitly modifying liClone or logic order
        }

        items.push({
          title,
          description,
          children,
          expanded: true,
        });
      });

      return items;
    },
    toggleSectionNav(index) {
      this.parsedGlossary[index].navExpanded =
        !this.parsedGlossary[index].navExpanded;
    },

    scrollToSection(index) {
      // Expand nav when clicking section
      this.parsedGlossary[index].navExpanded = true;
      const el = document.getElementById(`section-${index}`);
      if (el) this.scrollElementWithOffset(el, 180);
    },

    scrollToItem(secIndex, itemIndex) {
      const el = document.getElementById(`item-${secIndex}-${itemIndex}`);
      if (el) this.scrollElementWithOffset(el, 180);
    },

    normalizeQuery(query) {
      return (query || "").trim().toLowerCase();
    },

    matchesTitle(title) {
      const query = this.normalizeQuery(this.searchQuery);
      if (!query) return true;
      return (title || "").toLowerCase().includes(query);
    },

    matchesSearch(item) {
      if (!this.normalizeQuery(this.searchQuery)) return true;

      const selfMatch = this.matchesTitle(item.title);

      const childrenMatch = (item.children || []).some(
        (c) =>
          this.matchesTitle(c.title) ||
          (c.children || []).some((gc) => this.matchesTitle(gc.title)),
      );

      return selfMatch || childrenMatch;
    },

    findFirstMatchingTerm() {
      if (!this.normalizeQuery(this.searchQuery)) return null;

      for (
        let secIndex = 0;
        secIndex < this.parsedGlossary.length;
        secIndex++
      ) {
        const section = this.parsedGlossary[secIndex];
        if (!section || !Array.isArray(section.items)) continue;

        for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
          const item = section.items[itemIndex];
          if (this.matchesTitle(item.title)) {
            return { level: "item", secIndex, itemIndex };
          }

          const children = Array.isArray(item.children) ? item.children : [];
          for (let childIndex = 0; childIndex < children.length; childIndex++) {
            const child = children[childIndex];
            if (this.matchesTitle(child.title)) {
              return {
                level: "child",
                secIndex,
                itemIndex,
                childIndex,
              };
            }

            const grandchildren = Array.isArray(child.children)
              ? child.children
              : [];
            for (
              let grandchildIndex = 0;
              grandchildIndex < grandchildren.length;
              grandchildIndex++
            ) {
              const grandchild = grandchildren[grandchildIndex];
              if (this.matchesTitle(grandchild.title)) {
                return {
                  level: "grandchild",
                  secIndex,
                  itemIndex,
                  childIndex,
                  grandchildIndex,
                };
              }
            }
          }
        }
      }

      return null;
    },

    scrollElementWithOffset(el, headerOffset = 180) {
      if (!el) return;

      const root =
        document.scrollingElement || document.documentElement || document.body;
      const absoluteTop =
        el.getBoundingClientRect().top + (window.pageYOffset || root.scrollTop);
      const desiredTop = Math.max(absoluteTop - headerOffset, 0);

      window.scrollTo(0, desiredTop);
      root.scrollTop = desiredTop;
      document.documentElement.scrollTop = desiredTop;
      document.body.scrollTop = desiredTop;

      setTimeout(() => {
        window.scrollTo(0, desiredTop);
      }, 40);
    },

    async scrollToFirstMatch() {
      const query = this.normalizeQuery(this.searchQuery);
      if (!query) return;

      this.parsedGlossary.forEach((section) => {
        if (section) section.navExpanded = true;
      });

      await this.$nextTick();
      await this.$nextTick();

      const container = this.$refs.glossaryContent;
      if (!container || !container.querySelectorAll) return;

      const matchedId = this.getFirstMatchingHeadingId();
      if (matchedId) {
        const matchedNode = document.getElementById(matchedId);
        if (matchedNode) {
          this.scrollElementWithOffset(matchedNode, 180);
          return;
        }
      }

      const titleNodes = Array.from(
        container.querySelectorAll("[data-term-title]"),
      );

      const fallbackVisibleHeading = titleNodes.find((node) => {
        if (!node || node.offsetParent === null) return false;
        const title = (
          node.getAttribute("data-term-title") || ""
        ).toLowerCase();
        return title.includes(query);
      });

      if (fallbackVisibleHeading) {
        this.scrollElementWithOffset(fallbackVisibleHeading, 180);
        return;
      }

      const fallbackVisibleItem = Array.from(
        container.querySelectorAll(".glossary-item"),
      ).find((node) => node && node.offsetParent !== null);

      if (fallbackVisibleItem) {
        this.scrollElementWithOffset(fallbackVisibleItem, 180);
      }
    },

    handleSearchInput() {
      this.scheduleSearchScroll();
    },

    scheduleSearchScroll() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      if (!this.normalizeQuery(this.searchQuery)) {
        this.collapseAllSections();
        this.scrollToGlossaryTop();
        return;
      }
      this.searchTimer = setTimeout(() => {
        this.scrollToFirstMatch();
      }, 120);
    },

    collapseAllSections() {
      this.parsedGlossary.forEach((section) => {
        if (section) section.navExpanded = false;
      });
    },

    scrollToGlossaryTop() {
      this.$nextTick(() => {
        const topTarget =
          this.$refs.glossaryContent ||
          document.getElementById("section-0") ||
          document.querySelector(".glossary-page");
        if (topTarget) {
          this.scrollElementWithOffset(topTarget, 170);
        }
      });
    },

    getFirstMatchingHeadingId() {
      if (!this.normalizeQuery(this.searchQuery)) return null;

      for (
        let secIndex = 0;
        secIndex < this.parsedGlossary.length;
        secIndex++
      ) {
        const section = this.parsedGlossary[secIndex];
        if (!section || !Array.isArray(section.items)) continue;

        for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
          const item = section.items[itemIndex];
          if (this.matchesTitle(item.title)) {
            return `item-title-${secIndex}-${itemIndex}`;
          }

          const children = Array.isArray(item.children) ? item.children : [];
          for (let childIndex = 0; childIndex < children.length; childIndex++) {
            const child = children[childIndex];
            if (this.matchesTitle(child.title)) {
              return `child-title-${secIndex}-${itemIndex}-${childIndex}`;
            }

            const grandchildren = Array.isArray(child.children)
              ? child.children
              : [];
            for (
              let grandchildIndex = 0;
              grandchildIndex < grandchildren.length;
              grandchildIndex++
            ) {
              const grandchild = grandchildren[grandchildIndex];
              if (this.matchesTitle(grandchild.title)) {
                return `grandchild-title-${secIndex}-${itemIndex}-${childIndex}-${grandchildIndex}`;
              }
            }
          }
        }
      }

      return null;
    },

    hasDescription(desc) {
      if (!desc) return false;
      const tmp = document.createElement("div");
      tmp.innerHTML = desc;
      return (tmp.textContent || tmp.innerText || "").trim().length > 0;
    },

    highlightText(text) {
      if (!this.searchQuery) return text;
      const regex = new RegExp(
        `(${this.escapeRegExp(this.searchQuery)})`,
        "gi",
      );
      return text.replace(
        regex,
        '<span class="bg-[#00b8db80] rounded-[2px]">$1</span>',
      );
    },

    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
  },
  mounted() {
    this.initializeGlossary();
  },
  beforeUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  },
  watch: {
    searchQuery() {
      this.scheduleSearchScroll();
    },
  },
};
</script>

<style scoped>
.glossary-search-bar {
  min-height: 46px;
  border: var(--search-border);
  border-radius: var(--search-radius);
  padding-inline: var(--search-padding-inline);
}

.glossary-search-bar:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(136, 63, 143, 0.12);
}

#glossary-search {
  color: #5b2960;
}

#glossary-search::placeholder {
  color: #7a6a7c;
  opacity: 1;
}

.glossary-search-btn {
  border: 1px solid rgba(189, 167, 191, 0.65);
  background: #f5f1f5;
  color: #5b2960;
  border-radius: 999px;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.glossary-search-btn:hover {
  background: #eee7ee;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
.glossary-item-description :deep(p) {
  margin-bottom: 0.8em;
}
.glossary-item-description :deep(a) {
  color: var(--primary-color);
  text-decoration: underline;
}
.glossary-nav {
  width: calc(100% - 0.85rem);
  margin-inline: auto;
}

.glossary-item-title-text{
  margin-bottom: 1rem;
}

.glossary-item-level-1{
  margin-bottom: 0.5rem;
}

.glossary-item-level-2 > .glossary-item-title{
  margin-bottom: 0.5rem;
}

.glossary-section > .section-title {
  margin-bottom: 1.75rem;
}

.glossary-item-level-2 > .glossary-item-description {
  margin-bottom: 1.7rem;
}

.glossary-item-level-3 .glossary-item-description {
  margin-bottom: 0.2rem;
}
.glossary-item-level-2 + .glossary-item-level-2 {
  margin-bottom: 0.35rem;
}
.glossary-item-level-3 + .glossary-item-level-3 {
  margin-bottom: 0.5rem;
}

@media (max-width: 1024px) {
  .sidebar {
    height: auto;
    max-height: none;
  }

  .glossary-nav {
    max-height: 42vh;
  }
}

@media (max-width: 768px) {
  .glossary-nav {
    width: 100%;
  }

  .glossary-item-title {
    flex-wrap: wrap;
    row-gap: 0.35rem;
  }

  .glossary-subitems {
    padding-left: 0.85rem;
    margin-left: 0;
  }
}
</style>
