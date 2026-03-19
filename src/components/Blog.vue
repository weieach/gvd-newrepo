<template>
  <div
    class="blogs-page pt-[calc(25px+5vh)] max-w-[1600px] mx-auto pb-20 flex items-start relative gap-8 lg:gap-12 px-5 md:px-8 lg:px-11 flex-col lg:flex-row"
  >
    <div
      class="sidebar lg:sticky lg:top-[calc(108px+5vh)] w-full lg:w-[320px] self-start shrink-0"
    >
      <h1
        class="page-title text-black"
      >
        Blogs
      </h1>
    </div>

    <!-- <div class="blogs-page-content flex flex-col gap-8"> -->
    <div v-if="error" class="text-red-500 text-center text-xl">
      Failed to load posts: {{ error }}
    </div>

    <!-- Dynamic Intro/Full Article from Store -->
    <div class="main-content flex-1 max-w-[960px] min-w-0">
      <div v-if="loading" class="text-center text-gray-500 text-xl py-10">
        Loading blogs...
      </div>

      <div v-else class="cards-blog-lg flex flex-col gap-12">
        <div
          v-if="fullArticle"
          class="intro-text max-w-[800px] body-copy-lg text-black"
        >
          <h2 class="text-2xl font-serif font-medium">
            {{ fullArticle.title }}
          </h2>
          <div v-html="fullArticle.body" class=""></div>
        </div>
        <div
          v-else
          class="intro-text max-w-[800px] body-copy-lg text-black"
        >
          <p>Loading introduction...</p>
        </div>
        <!-- Iterate over sections -->
        <section
          v-for="section in postsBySection"
          :key="section.name"
          class="blog-section"
        >
          <!-- Section Header -->
          <!-- <h2
            class="text-[2rem] font-serif font-medium text-primary-color mb-8 pb-3 border-b-2 border-border-color"
          >
            {{ section.name }}
          </h2> -->

          <!-- Posts in this section -->
          <div class="flex flex-col gap-12">
            <div
              v-for="post in section.posts"
              :key="getPostNid(post)"
              @click="navigateToPost(post)"
              class="card-blog-lg group cursor-pointer flex rounded-[1rem] overflow-hidden bg-white border border-border-color-light hover:shadow-lg transition-shadow duration-300 min-h-[320px]"
            >
              <!-- Thumbnail -->
              <div
                class="blog-thumbnail w-[35%] bg-cover bg-center min-h-full"
                :style="{ backgroundImage: `url(${getPostImage(post)})` }"
              ></div>

              <!-- Content -->
              <div
                class="card-text p-6 md:p-10 flex flex-col gap-4 w-[65%] justify-start min-w-0"
              >
                <div
                  class="blog-header flex items-center justify-between text-dark-bg"
                >
                  <h3
                    class="flex items-center gap-2 text-[1.1rem] font-serif font-medium"
                  >
                    <i class="ph ph-book-bookmark text-primary-color"></i>
                    {{ getPostCategory(post) || "Blog Post" }}
                  </h3>
                  <p class="font-sans text-[0.95rem] opacity-70">
                    by {{ getPostAuthor(post) }}
                  </p>
                </div>

                <h2
                  class="blog-title text-[1.6rem] font-serif font-medium leading-tight group-hover:text-primary-color transition-colors"
                >
                  {{ getPostTitle(post) }}
                </h2>

                <hr class="border-[.1rem] border-border-color" />

                <p
                  class="blog-description body-copy-sm text-[#333] line-clamp-4"
                >
                  {{ truncateText(getPostBody(post), 300) }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { usePostHelpers } from "@/composables/usePostHelpers";
import { useImageHelpers } from "@/composables/useImageHelpers";
import defaultThumbnail from "@/assets/gvd/blog-thumbnail-placeholder.png";

export default {
  name: "Blog",
  setup() {
    const {
      getPostNid,
      getPostUuid,
      getPostTitle,
      getPostBody,
      getPostTagName,
      getPostAuthor,
      getPostCategory,
      truncateText,
    } = usePostHelpers();

    const {
      postImageMap,
      prefetchPostImages: prefetchImages,
      getPostImage: getImage,
    } = useImageHelpers(defaultThumbnail);

    return {
      // Post helpers
      getPostNid,
      getPostUuid,
      getPostTitle,
      getPostBody,
      getPostTagName,
      getPostAuthor,
      getPostCategory,
      truncateText,
      // Image helpers
      postImageMap,
      prefetchImages,
      getImage,
    };
  },
  data() {
    return {
      error: null,
      loading: false,
    };
  },
  computed: {
    imageMap() {
      return this.postImageMap.value;
    },
    ...mapState(["cachedPosts", "cachedSections", "cachedFullArticle"]),
    fullArticle() {
      return this.cachedFullArticle;
    },
    allPosts() {
      if (!this.cachedPosts || !this.cachedSections) return [];

      const validTagNames = new Set(
        this.cachedSections.map((section) => section.name),
      );

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

      return this.cachedPosts.filter((post) => {
        // Filter by title first
        const title = this.getPostTitle(post);
        if (excludedTitles.includes(title)) return false;

        // Skip posts without any tags
        if (!post.field_tags) return false;

        // Handle array format (old structure)
        if (Array.isArray(post.field_tags)) {
          return post.field_tags.some(
            (tag) => tag && tag.name && validTagNames.has(tag.name),
          );
        }

        // Handle HTML string format (new flat structure from Drupal)
        if (typeof post.field_tags === "string" && post.field_tags.trim()) {
          // Extract tag name from HTML by parsing it
          const tmp = document.createElement("DIV");
          tmp.innerHTML = post.field_tags;
          const tagName = tmp.textContent || tmp.innerText || "";

          return validTagNames.has(tagName.trim());
        }

        return false;
      });
    },
    postsBySection() {
      if (!this.cachedSections) return [];

      return this.cachedSections
        .map((section) => {
          const posts = this.allPosts.filter((post) => {
            const tagName = this.getPostTagName(post);
            return tagName === section.name;
          });

          return {
            name: section.name,
            posts: posts,
          };
        })
        .filter((section) => section.posts.length > 0);
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await this.initializeData();
      await this.prefetchSectionPostImages();
    } catch (error) {
      console.error("Error in mounted:", error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions([
      "fetchAndCacheData",
      "loadCachedData",
      "fetchAndCacheFullArticle",
      "loadCachedFullArticle",
    ]),

    async initializeData() {
      await this.loadCachedData();
      await this.loadCachedFullArticle();

      if (!this.cachedPosts || this.cachedPosts.length === 0) {
        await this.fetchAndCacheData();
      }
      if (!this.cachedFullArticle) {
        await this.fetchAndCacheFullArticle();
      }
    },

    async prefetchSectionPostImages() {
      if (
        !Array.isArray(this.postsBySection) ||
        this.postsBySection.length === 0
      ) {
        return;
      }

      const posts = this.postsBySection.reduce((acc, section) => {
        if (section && Array.isArray(section.posts)) {
          return acc.concat(section.posts);
        }
        return acc;
      }, []);

      await this.prefetchImages(posts, this.getPostUuid);
    },

    navigateToPost(post) {
      this.$router.push({
        name: "ArticleDetail",
        params: { id: this.getPostUuid(post) },
      });
    },

    getPostImage(post) {
      return this.getImage(post, this.getPostUuid);
    },
  },
  watch: {
    postsBySection: {
      immediate: true,
      handler() {
        this.prefetchSectionPostImages();
      },
    },
  },
};
</script>

<style scoped>
@media (max-width: 1024px) {
  .card-blog-lg {
    min-height: 0;
  }

  .blog-thumbnail {
    width: 40%;
  }

  .card-text {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .card-blog-lg {
    flex-direction: column;
  }

  .blog-thumbnail {
    width: 100%;
    min-height: 180px;
    aspect-ratio: 16 / 9;
  }

  .card-text {
    width: 100%;
  }

  .blog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .blog-title {
    font-size: 1.3rem;
  }
}
</style>
