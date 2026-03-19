<template>
  <div
    class="article-detail-page pt-[calc(25px+5vh)] max-w-[1600px] mx-auto pb-20 flex items-start relative gap-8 lg:gap-12 px-5 md:px-8 lg:px-11 flex-col lg:flex-row"
  >
    <!-- Sidebar -->
    <aside
      class="sidebar lg:sticky lg:top-[calc(108px+5vh)] w-full lg:w-[280px] self-start shrink-0 flex flex-col gap-5"
    >
      <router-link
        to="/blogs"
        class="back-link inline-flex items-center gap-2 text-sm font-medium text-[#5B2960] hover:text-primary-color transition-colors duration-150"
      >
        <i class="ph ph-arrow-left"></i>
        Back to blogs
      </router-link>

      <div v-if="articleData" class="flex flex-col gap-2.5">
        <span
          v-if="articleData.field_tags"
          class="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#5B2960]"
        >
          <i class="ph ph-book-open-text"></i>
          {{ articleData.field_tags }}
        </span>

        <p v-if="authorName" class="text-sm text-[#333] opacity-100">
          by {{ authorName }}
        </p>

        <p v-if="articleData.created" class="text-xs text-[#333] opacity-100">
          {{ formattedDate }}
        </p>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 max-w-[960px] min-w-0">
      <div v-if="articleData" class="flex flex-col gap-6">
        <h1 class="page-title text-black">
          {{ articleData.title }}
        </h1>

        <hr class="border-[0.1rem] border-border-color-light" />

        <div
          v-if="processedBody"
          v-html="processedBody"
          class="drupal-content"
        ></div>
        <div v-else class="drupal-content text-[#666]">
          No content available
        </div>
      </div>

      <div v-else class="text-center text-gray-500 text-xl py-10">
        Loading...
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "ArticleDetail",
  data() {
    return {
      articleData: null,
      articleAuthor: null,
    };
  },
  computed: {
    authorName() {
      return (
        this.articleData?.field_author ||
        this.articleAuthor?.display_name ||
        "GVD Team"
      );
    },
    formattedDate() {
      if (!this.articleData?.created) return "";
      return new Date(this.articleData.created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    processedBody() {
      if (!this.articleData?.body) return "";

      // Prefer the server-rendered processed HTML from Drupal
      const raw =
        this.articleData.body.processed || this.articleData.body.value || "";

      if (!raw) return "";

      // If the content already contains block-level HTML tags, use it as-is
      if (/<(p|div|h[1-6]|ul|ol|blockquote)\b/i.test(raw)) {
        return raw;
      }

      // Otherwise convert double newlines into paragraph tags
      const paragraphs = raw
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");

      return paragraphs || `<p>${raw}</p>`;
    },
  },
  async mounted() {
    await this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      const articleUuid = this.$route.params.id;
      const apiUrl = `${process.env.VUE_APP_JSONAPI_BASE_URL}/jsonapi/node/article/${articleUuid}`;

      try {
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/vnd.api+json" },
        });
        if (!response.ok) throw new Error("Failed to fetch the article");
        const articleJson = await response.json();

        this.articleData = articleJson.data.attributes;

        if (typeof this.articleData.body === "string") {
          this.articleData.body = { value: this.articleData.body };
        } else if (!this.articleData.body) {
          this.articleData.body = null;
        }

        if (
          articleJson.data.relationships.uid &&
          articleJson.data.relationships.uid.data
        ) {
          this.fetchAuthorDetails(articleJson.data.relationships.uid.data.id);
        }
      } catch (error) {
        console.error("Error fetching article details:", error);
      }
    },

    async fetchAuthorDetails(authorId) {
      try {
        const authorResponse = await fetch(
          `${process.env.VUE_APP_JSONAPI_BASE_URL}/jsonapi/user/user/${authorId}`,
          { headers: { Accept: "application/vnd.api+json" } },
        );
        if (authorResponse.ok) {
          const authorJson = await authorResponse.json();
          this.articleAuthor = {
            display_name: authorJson.data.attributes.display_name,
          };
        }
      } catch (error) {
        console.error("Failed to fetch author details:", error);
      }
    },
  },
};
</script>

<style scoped>
.back-link {
  width: fit-content;
}
</style>
