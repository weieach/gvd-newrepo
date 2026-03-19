<template>
  <div
    class="landing-page px-5 md:px-8 lg:px-11 -mt-[calc(50px+5vh)] overflow-x-clip"
  >
    <div class="smooth-wrapper">
      <div class="smooth-content">
        <!-- Opening Screen -->
        <section
          class="h-screen relative flex flex-col items-center justify-center bg-bg-color"
        >
          <div
            class="homescreen-center-ui flex flex-col items-center gap-3 w-full"
          >
            <img src="@/assets/gvd/gvd-logo.png" class="w-20" alt="logo" />
            <h1
              class="page-title text-black text-center px-2"
            >
              Gender Violence Database
            </h1>

            <div
              ref="landingSearchBox"
              class="input-bar bg-white border-[0.5px] border-[#BDA7BF] rounded-[20px] w-full max-w-[900px] flex justify-between overflow-visible relative"
            >
              <div
                class="input-bar-controls pl-[30px] pr-[20px] py-[20px] flex-1 flex justify-between items-center"
              >
                <input
                  v-model="searchQuery"
                  @focus="handleFocus"
                  @input="handleInput"
                  @keyup.enter="handleEnter"
                  placeholder="Try a keyword, journal, or tag"
                  type="text"
                  class="landing-search-input border-none text-base text-[#5B2960] flex-1 bg-white focus:outline-none"
                />
              </div>
              <button
                @click="performSearch"
                type="submit"
                class="primary-btn-search bg-primary-color text-white px-[34px] py-[10px] text-[1.4rem] border-none cursor-pointer hover:bg-dark-bg transition-colors duration-200"
              >
                <i class="ph-bold ph-magnifying-glass"></i>
              </button>

              <div
                v-if="showSuggestions && suggestions.length"
                class="landing-suggestions-menu"
              >
                <div class="landing-suggestions-header">Suggestions</div>
                <button
                  v-for="suggestion in suggestions"
                  :key="suggestion.id"
                  type="button"
                  class="landing-suggestion-item"
                  @mousedown.prevent="selectSuggestion(suggestion)"
                >
                  <span
                    class="landing-suggestion-type"
                    :class="`landing-suggestion-type-${suggestion.type.toLowerCase()}`"
                  >
                    {{ suggestion.type }}
                  </span>
                  <span class="landing-suggestion-text">{{
                    suggestion.text
                  }}</span>
                </button>
              </div>
            </div>

            <p
              class="text-center max-w-[55ch] body-copy-sm pt-2 text-black px-2"
            >
              An ongoing project to collect interdisciplinary academic research
              related to gender-based violence.
            </p>
          </div>

          <div
            class="msg-scrolldown absolute bottom-8 left-0 right-0 w-full text-center text-[#946897]"
          >
            <p>Scroll down to learn more</p>
            <p>
              <i
                class="ph-bold ph-caret-down text-[1.7rem] inline-block mt-2"
              ></i>
            </p>
          </div>
        </section>

        <!-- Scope Screen -->
        <section
          v-if="scopeArticle"
          class="feature-screen py-16 lg:py-24 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-16"
          id="scope-screen"
        >
          <img
            :src="getArticleImage(scopeArticle, scopePlaceholder)"
            alt="Scope Image"
            class="feature-image w-full max-w-[500px] mx-auto md:mx-0 md:w-[40%] md:max-w-none h-auto lg:w-auto lg:max-w-[450px] lg:h-[470px] object-cover rounded-lg flex-shrink-0"
          />
          <div
            class="div-text-feature flex flex-col w-full md:flex-1 lg:max-w-[46ch] gap-1"
          >
            <div class="headings flex flex-col gap-1">
              <h3
                class="text-[1.25rem] leading-[1.25] text-[#5B2960] font-normal font-serif order-[-1]"
              >
                {{ getArticleTitle(scopeArticle) }}
              </h3>
            </div>
            <div
              class="text-black leading-relaxed drupal-content"
              v-html="getArticleBody(scopeArticle)"
            ></div>
          </div>
        </section>

        <!-- Approach Screen -->

        <section
          v-if="approachArticle"
          class="feature-screen py-16 lg:py-24 lg:px-11 flex flex-col-reverse md:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-16"
          id="approach-screen"
        >
          <div class="div-text-feature flex flex-col w-full md:flex-1 lg:max-w-[46ch] gap-1">
            <div class="headings flex flex-col gap-1">
              <h3
                class="text-[1.25rem] leading-[1.25] text-[#5B2960] font-normal font-serif order-[-1]"
              >
                {{ getArticleTitle(approachArticle) }}
              </h3>
            </div>
            <div
              class="text-black leading-relaxed drupal-content"
              v-html="getArticleBody(approachArticle)"
            ></div>
          </div>
          <img
            :src="getArticleImage(approachArticle, approachPlaceholder)"
            alt="Approach Image"
            class="feature-image w-full max-w-[500px] mx-auto md:mx-0 md:w-[40%] md:max-w-none h-auto lg:w-auto lg:max-w-[450px] lg:h-[470px] object-cover rounded-lg flex-shrink-0"
          />
        </section>

        <!-- Workflow Screen -->
        <section
          v-if="workflowArticle"
          class="feature-screen py-16 lg:py-24 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-16"
        >
          <img
            :src="getArticleImage(workflowArticle, workflowPlaceholder)"
            alt="Workflow Illustration"
            class="workflow-image w-full h-auto max-w-[280px] md:w-[35%] md:max-w-none lg:w-auto lg:max-w-[350px] lg:h-[350px] object-contain flex-shrink-0"
          />
          <div class="div-text-feature flex flex-col w-full md:flex-1 lg:max-w-[46ch] gap-1">
            <div class="headings flex flex-col gap-1">
              <h3
                class="text-[1.25rem] leading-[1.25] text-[#5B2960] font-normal font-serif order-[-1]"
              >
                {{ getArticleTitle(workflowArticle) }}
              </h3>
            </div>
            <div
              class="text-black leading-relaxed drupal-content"
              v-html="getArticleBody(workflowArticle)"
            ></div>
          </div>
        </section>

        <!-- Documentation Screen -->
        <section
          class="py-16 lg:py-24 flex flex-col items-center justify-center gap-10 lg:gap-16"
        >
          <div class="flex flex-col gap-6 w-full max-w-[1000px]">
            <div
              class="headings docs-header flex flex-row items-end justify-between mb-2"
            >
              <h2
                class="section-title text-black"
              >
                Documentation: Glossary &amp; Blogs
              </h2>
              <router-link
                to="/blogs"
                class="text-black hover:underline hover:text-primary-color"
                >More blogs</router-link
              >
            </div>

            <div class="cards-doc flex gap-8">
              <!-- Glossary Card -->
              <router-link
                to="/glossary"
                class="card-glossary flex flex-col border-[0.8px] border-border-color-light rounded-[1rem] w-full max-w-[384px] overflow-hidden bg-contain bg-no-repeat justify-end h-[400px]"
                style="
                  background-image: url('/static/gvd/CHSDM-0F0A7D42177D2-000001.jpg');
                "
              >
                <div
                  class="bg-cover bg-center w-full h-full absolute z-0"
                  :style="{ backgroundImage: `url(${glossaryBg})` }"
                ></div>
                <div
                  class="card-text bg-white p-[1.75rem_2rem_1.5rem] justify-self-center z-10 relative m-0 w-full"
                >
                  <h3
                    class="text-[1.25rem] font-serif font-normal text-[#5B2960] mb-2"
                  >
                    Gender Violence Glossary
                  </h3>
                  <p class="text-sm text-[#333]">
                    This glossary defines terms used in the schema which guides
                    the tagging process.
                  </p>
                </div>
              </router-link>

              <!-- Blogs Column -->
              <div class="cards-blog flex flex-col gap-4 flex-1">
                <!-- Loading State -->
                <div
                  v-if="loading"
                  class="text-center text-gray-700 py-10 flex-1 flex items-center justify-center"
                >
                  Loading blogs...
                </div>

                <div
                  v-else-if="recentBlogs.length === 0"
                  class="text-center text-gray-700 py-10 flex-1 flex items-center justify-center"
                >
                  No blog posts found.
                </div>

                <!-- Dynamic Blog Cards -->
                <router-link
                  v-for="post in recentBlogs"
                  :key="getPostUuid(post)"
                  :to="{
                    name: 'ArticleDetail',
                    params: { id: getPostUuid(post) },
                  }"
                  class="card-blog flex rounded-[1rem] overflow-hidden h-[192px] w-full max-w-[580px] border-[0.8px] border-border-color-light bg-white hover:shadow-md transition-shadow"
                >
                  <div
                    class="card-blog-image min-w-[170px] w-[170px] bg-cover bg-center h-full"
                    :style="{ backgroundImage: `url(${getPostImage(post)})` }"
                  ></div>
                  <div
                    class="card-text px-[1.75rem] self-center flex flex-col gap-2.5 flex-1 min-w-0"
                  >
                    <h3
                      class="text-[1rem] font-serif font-medium text-dark-bg flex items-center gap-2"
                    >
                      <i class="ph ph-book-open-text"></i>
                      {{ getPostCategory(post) }}
                    </h3>
                    <h4
                      class="capitalize text-[1.2rem] text-black leading-snug break-words"
                    >
                      {{ getPostTitle(post) }}
                    </h4>
                    <span class="text-black font-sans font-normal opacity-70"
                      >by {{ getPostAuthor(post) }}</span
                    >
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { usePostHelpers } from "@/composables/usePostHelpers";
import { useImageHelpers } from "@/composables/useImageHelpers";
import glossaryBg from "@/assets/gvd/CHSDM-0F0A7D42177D2-000001.jpg";
import defaultThumbnail from "@/assets/gvd/blog-thumbnail-placeholder.png";
import scopePlaceholder from "@/assets/gvd/scope-img-placeholder.png";
import approachPlaceholder from "@/assets/gvd/approach-img-placeholder.png";
import workflowPlaceholder from "@/assets/gvd/asterisk.png";

export default {
  name: "Landing",
  setup() {
    const { getPostUuid, getPostTitle, getPostAuthor, getPostCategory } =
      usePostHelpers();

    const {
      postImageMap,
      getPostImage: getImage,
      prefetchPostImages: prefetchImages,
    } = useImageHelpers(defaultThumbnail);

    return {
      // Post helpers
      getPostUuid,
      getPostTitle,
      getPostAuthor,
      getPostCategory,
      // Image helpers
      postImageMap,
      getImage,
      prefetchImages,
    };
  },
  data() {
    return {
      searchQuery: "",
      showSuggestions: false,
      suggestions: [],
      suggestionDebounceTimeout: null,
      glossaryBg,
      loading: false,
      scopePlaceholder,
      approachPlaceholder,
      workflowPlaceholder,
    };
  },
  computed: {
    imageMap() {
      return this.postImageMap.value;
    },
    ...mapState(["cachedPosts", "landingArticles"]),
    recentBlogs() {
      const posts = this.cachedPosts || [];
      const excludedTitles = [
        "Our Scope",
        "Our Approach",
        "Tagging Workflow",
        "Resources",
        "Project Timeline",
        "Overview",
        "Gender Violence Glossary",
        "Glossary",
        "Contributors",
      ];
      const filteredPosts = posts.filter((post) => {
        const title = this.getArticleTitle(post);
        return !excludedTitles.includes(title);
      });

      return filteredPosts.slice(0, 2);
    },
    scopeArticle() {
      return this.landingArticles.scope;
    },
    approachArticle() {
      return this.landingArticles.approach;
    },
    workflowArticle() {
      return this.landingArticles.workflow;
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.initializeData();
  },
  beforeUnmount() {
    if (this.suggestionDebounceTimeout) {
      clearTimeout(this.suggestionDebounceTimeout);
    }
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    ...mapActions([
      "fetchAndCacheData",
      "loadCachedData",
      "fetchLandingArticles",
    ]),

    async initializeData() {
      this.loading = true;
      try {
        this.fetchLandingArticles();
        await this.loadCachedData();
        if (!this.cachedPosts || this.cachedPosts.length === 0) {
          await this.fetchAndCacheData();
        }
        await this.prefetchImages(this.recentBlogs, this.getPostUuid);
      } catch (error) {
        console.error("Failed to load content for landing page:", error);
      } finally {
        this.loading = false;
      }
    },

    getArticleBody(article) {
      // Handle JSON:API structure (attributes.body.value)
      if (article && article.attributes && article.attributes.body) {
        return (
          article.attributes.body.value ||
          article.attributes.body.processed ||
          ""
        );
      }
      if (article && article.body && article.body[0]) {
        return article.body[0].value || article.body[0].summary || "";
      }
      return "";
    },

    getArticleTitle(article) {
      if (article && article.attributes) {
        return article.attributes.title;
      }
      const title = article?.title?.[0]?.value || article?.title || "";
      // Strip HTML tags if present
      const tmp = document.createElement("DIV");
      tmp.innerHTML = title;
      const cleanTitle = tmp.textContent || tmp.innerText || title;
      return cleanTitle.trim();
    },

    getArticleImage(article, fallback) {
      if (
        article &&
        article.field_image &&
        article.field_image[0] &&
        article.field_image[0].url
      ) {
        return article.field_image[0].url;
      }
      return fallback;
    },

    performSearch() {
      if (this.searchQuery.trim()) {
        this.showSuggestions = false;
        this.suggestions = [];
        this.$router.push({
          path: "/search",
          query: { text: this.searchQuery },
        });
      }
    },
    handleFocus() {
      this.showSuggestions = true;
      this.generateSuggestions();
    },
    handleInput() {
      this.showSuggestions = true;
      this.generateSuggestions();
    },
    handleEnter() {
      this.showSuggestions = false;
      this.suggestions = [];
      this.performSearch();
    },
    async generateSuggestions() {
      if (this.suggestionDebounceTimeout) {
        clearTimeout(this.suggestionDebounceTimeout);
      }

      this.suggestionDebounceTimeout = setTimeout(async () => {
        const input = this.searchQuery.trim().toLowerCase();
        if (input.length < 2) {
          this.suggestions = [];
          this.showSuggestions = false;
          return;
        }

        const newSuggestions = [];
        const tags = this.$store.getters.schemataglist || [];
        const matchingTags = tags
          .filter((tag) => tag.label && tag.label.toLowerCase().includes(input))
          .slice(0, 5);

        newSuggestions.push({
          id: `keyword-${input}`,
          type: "Keyword",
          text: this.searchQuery.trim(),
          data: { text: this.searchQuery.trim() },
        });

        matchingTags.forEach((tag) => {
          newSuggestions.push({
            id: `tag-${tag.tagname}`,
            type: "Tag",
            text: tag.label,
            data: tag,
          });
        });

        try {
          const matchingJournals = await this.$store.dispatch(
            "fetchJournalSuggestions",
            input,
          );
          matchingJournals.slice(0, 5).forEach((journal) => {
            newSuggestions.push({
              id: `journal-${journal}`,
              type: "Journal",
              text: journal,
              data: { name: journal },
            });
          });
        } catch (error) {
          console.error("Error fetching landing suggestions:", error);
        }

        this.suggestions = newSuggestions;
        this.showSuggestions = newSuggestions.length > 0;
      }, 240);
    },
    selectSuggestion(suggestion) {
      this.showSuggestions = false;
      this.suggestions = [];

      if (suggestion.type === "Keyword") {
        this.searchQuery = suggestion.text;
        this.performSearch();
      } else if (suggestion.type === "Tag") {
        this.$router.push({
          path: "/search",
          query: { tags: suggestion.data.tagname },
        });
      } else if (suggestion.type === "Journal") {
        this.$router.push({
          path: "/search",
          query: { journals: suggestion.data.name },
        });
      }
    },
    handleClickOutside(event) {
      const box = this.$refs.landingSearchBox;
      if (box && !box.contains(event.target)) {
        this.showSuggestions = false;
      }
    },

    getPostImage(post) {
      return this.getImage(post, this.getPostUuid);
    },
  },
  watch: {
    recentBlogs: {
      immediate: true,
      handler(posts) {
        this.prefetchImages(posts, this.getPostUuid);
      },
    },
  },
};
</script>

<style>
/* Global styles for dynamic Drupal content */
.drupal-content h2,
.drupal-content h3 {
  font-size: var(--type-section-title);
  font-family: "larken", serif;
  font-weight: 500;
  line-height: var(--leading-tight);
  color: black;
  margin-bottom: 0.5rem;
}

.drupal-content p {
  font-size: var(--type-body);
  line-height: var(--leading-body);
  margin-bottom: 1rem;
}

.drupal-content strong {
  font-weight: 700;
}
</style>

<style scoped>
.card-glossary {
  position: relative;
}

.input-bar {
  border: 1px solid #bda7bf;
  border-radius: 999px;
  min-height: 46px;
}

.input-bar:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(136, 63, 143, 0.12);
}

.landing-search-input {
  color: #5b2960;
}

.landing-search-input::placeholder {
  color: #7a6a7c;
  opacity: 1;
}

.primary-btn-search {
  align-self: stretch;
  min-width: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(189, 167, 191, 0.5);
  border-radius: 0 999px 999px 0;
  line-height: 1;
}

.primary-btn-search i {
  font-size: 1.25rem;
}

.landing-suggestions-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.45rem);
  background: #fff;
  border: 1px solid #e0d5e1;
  border-radius: 0.9rem;
  box-shadow: 0 10px 24px rgba(20, 30, 60, 0.13);
  z-index: 40;
  overflow: hidden;
}

.landing-suggestions-header {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a7a8c;
  padding: 0.52rem 0.85rem 0.35rem;
}

.landing-suggestion-item {
  width: 100%;
  border: none;
  background: #faf8fa;
  color: #4a2c58;
  text-align: left;
  padding: 0.55rem 0.8rem;
  font-size: var(--type-body-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-top: 1px solid #f0ebf1;
}

.landing-suggestion-item:hover {
  background: #f3edf5;
}

.landing-suggestion-type {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #6f2f74;
}

.landing-suggestion-type-journal {
  color: #0f8da5;
}

.landing-suggestion-text {
  color: #5b2960;
  line-height: 1.45;
}

.homescreen-center-ui {
  padding-inline: 0.5rem;
}

@media (max-width: 1023px) {
  .cards-doc {
    flex-direction: column;
  }

  .cards-blog {
    width: 100%;
  }

  .card-blog {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .landing-page {
    padding-inline: 1rem;
  }

  .input-bar-controls {
    padding: 0.75rem 0.875rem 0.75rem 1rem;
  }

  .primary-btn-search {
    padding-inline: 1.1rem;
    font-size: 1.125rem;
  }

  .msg-scrolldown {
    bottom: 1rem;
  }

  .docs-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.65rem;
  }

  .card-glossary {
    max-width: 100%;
    height: 320px;
  }

  .card-blog {
    flex-direction: column;
    height: auto;
  }

  .card-blog-image {
    width: 100%;
    min-width: 100%;
    height: 180px;
  }

  .card-text {
    padding: 1rem;
  }
}
</style>
