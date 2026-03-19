<template>
  <div class="pagecomponent resources-page min-h-screen bg-bg-color">
    <div
      class="about-us-page-content pt-[calc(25px+5vh)] max-w-[1600px] mx-auto pb-20 px-5 md:px-8 lg:px-11 flex items-start gap-8 lg:gap-12 relative flex-col lg:flex-row"
    >
      <!-- Sticky Sidebar -->
      <div
        class="sidebar lg:sticky lg:top-[calc(108px+5vh)] w-full lg:w-[320px] self-start shrink-0"
      >
        <h1
          class="page-title text-black"
        >
          Support & Resources
        </h1>
      </div>

      <!-- Main Content -->

      <div class="main-content flex-1 max-w-[960px] min-w-0 w-full">
        <div v-if="loading" class="text-center text-gray-500 text-xl gap-2 py-10">
          Loading resources...
        </div>

        <div v-else-if="resourcesArticle" class="dynamic-content">
          <div
            v-html="getArticleBody(resourcesArticle)"
            class="resource-body"
          ></div>
        </div>

        <div v-else class="text-center text-gray-500 text-xl py-10">
          Resources content not found.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Help",

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(["landingArticles"]),
    resourcesArticle() {
      return this.landingArticles.resources;
    },
  },

  methods: {
    ...mapActions(["fetchLandingArticles"]),

    getArticleBody(article) {
      if (article && article.attributes && article.attributes.body) {
        return (
          article.attributes.body.value ||
          article.attributes.body.processed ||
          ""
        );
      }

      return "";
    },
  },

  async mounted() {
    if (!this.resourcesArticle) {
      this.loading = true;
      await this.fetchLandingArticles();
      this.loading = false;
    }
  },
};
</script>

<style>
/* Global styles for dynamic content */

.resource-body h2 {
  font-size: var(--type-section-title);
  font-family: "larken", serif;
  font-weight: 500;
  line-height: var(--leading-tight);
  color: black;
  margin-bottom: 1rem;
  /* border-bottom: 1px solid var(--border-color); */
  padding-bottom: 0.5rem;
  margin-top: 3.5rem;
}

.resource-body h2:first-child {
  margin-top: 0;
}

p:not(ul p) {
  margin-bottom: 1.4rem;
}

.resource-body p {
  font-size: var(--type-body);
  line-height: var(--leading-body);
  color: black;
}



.resource-body ul {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0;
  list-style: none;
}

.resource-body ul p{
  margin-bottom: 0.2rem;
  line-height: var(--leading-body-relaxed);
}

.resource-body li {
  background-color: white;
  padding: 1.2rem 1.5rem;
  border-radius: 1rem;
  /* border: 1px solid var(--border-color-light); */
  transition: box-shadow 0.2s ease;
}

/* .resource-body li:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
} */

.resource-body h3 {
  font-size: var(--type-subtitle);
  font-family: "larken", serif;
  font-weight: 500;
  line-height: var(--leading-tight);
  color: black;

  margin-bottom: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.resource-body img {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  object-fit: contain;
}

.resource-body address,
.resource-body .resource-details {
  font-style: normal;
  font-size: var(--type-body);
  line-height: var(--leading-body);
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resource-body a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.resource-body a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .resource-body h2 {
    font-size: 1.45rem;
    margin-top: 2rem;
  }

  .resource-body p {
    font-size: var(--type-body-sm);
    margin-bottom: 1rem;
  }

  .resource-body li {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .resource-body h3 {
    font-size: 1.1rem;
    gap: 0.5rem;
  }
}
</style>

<style scoped></style>
