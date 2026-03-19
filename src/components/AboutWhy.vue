<template>
  <div
    id="aboutwhy"
    class="pagecomponent about-page pt-[calc(25px+5vh)] max-w-[1600px] mx-auto pb-20 flex items-start relative gap-8 lg:gap-12 px-5 md:px-8 lg:px-11 flex-col lg:flex-row"
  >
    <!-- Sidebar -->
    <div
      class="sidebar lg:sticky lg:top-[calc(108px+5vh)] w-full lg:w-[320px] self-start shrink-0 flex flex-col gap-4"
    >
      <h1
        class="page-title text-black"
      >
        About Us
      </h1>
    </div>

    <!-- Main Content -->
    <div class="main-content flex-1 max-w-[960px] min-w-0 flex flex-col gap-16">
      <!-- Overview Section (Dynamic) -->
      <section class="overview-section">
        <div
          v-if="overviewIntroHtml && !overviewLoading && !overviewError"
          class="body-copy-lg text-black space-y-4"
        >
          <div v-html="overviewIntroHtml"></div>
        </div>
        <div v-else-if="overviewLoading" class="text-gray-500">
          Loading overview...
        </div>
        <div v-else-if="overviewError" class="text-red-500">
          Error: {{ overviewError }}
        </div>

        <!-- Optional: Extra details from Drupal if present -->
        <div
          v-if="overviewDetailsHtml && !overviewLoading && !overviewError"
          class="mt-8 body-copy text-[#333] space-y-4"
        >
          <div v-html="overviewDetailsHtml"></div>
        </div>
      </section>

      <!-- Quick Links (Static match to redesign) -->
      <section class="quick-links-section">
        <h2
          class="section-title text-primary-black mb-6 pb-2 border-b border-border-color"
        >
          Quick links
        </h2>
        <ul class="quick-links-list">
          <li>
            <router-link to="/#scope-screen">
              What is gender-based violence?
              <i class="ph ph-arrow-up-right"></i>
            </router-link>
          </li>
          <li>
            <router-link to="/#approach-screen">
              What is the Gender Violence Database?
              <i class="ph ph-arrow-up-right"></i>
            </router-link>
          </li>
          <li>
            <a href="/static/GVD_video_tutorial_22.mp4" target="_blank">
              How do I use the Gender Violence Database? (video tutorial)
              <i class="ph ph-arrow-up-right"></i>
            </a>
          </li>
        </ul>
      </section>

      <!-- Timeline (Interactive Component) -->
      <section class="timeline-section" v-if="timelineSections.length > 0">
        <h2
          class="section-title text-primary-black mb-6 pb-2 border-b border-border-color"
        >
          Timeline
        </h2>

        <div @click="handleImageClick">
          <div
            v-for="(section, index) in timelineSections"
            :key="index"
            class="mb-8"
          >
            <p
              v-if="section.title"
              class="text-lg font-normal text-dark-bg mb-4 mt-8"
            >
              {{ section.title }}
            </p>
            <project-timeline
              class="about-timeline w-full"
              :events="section.events"
            />
          </div>
        </div>
      </section>

      <!-- Contributors Section (Dynamic Cards) -->
      <section
        class="about-section contributors-section"
        aria-labelledby="contributors-title"
      >
        <div class="section-header mb-8">
          <h2
            id="contributors-title"
            class="section-title text-black border-b border-border-color pb-2"
          >
            Team Members & Contributors
          </h2>
        </div>

        <div v-if="contributorsLoading" class="text-gray-500">
          Loading contributors...
        </div>
        <div v-else-if="contributorsError" class="text-red-500">
          Error: {{ contributorsError }}
        </div>

        <ul
          v-else
          class="contributors contributors-list list-none p-0 m-0"
        >
          <li
            v-for="contributor in contributors"
            :key="contributor.id"
            class="contributor-row"
          >
            <img
              v-if="contributor.attributes.field_photo"
              :src="contributor.attributes.field_photo.url"
              alt="Contributor photo"
              class="contributor-avatar"
            />
            <div class="contributor-text">
              <strong class="contributor-name">{{ contributor.attributes.title }}</strong>
              <span
                v-if="contributor.attributes.field_role"
                class="contributor-role"
              >
                {{ contributor.attributes.field_role }}
              </span>
              <p
                v-if="contributor.attributes.field_bio"
                class="contributor-bio"
              >
                {{ contributor.attributes.field_bio }}
              </p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Image Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
        @click.self="closeModal"
      >
        <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
          <button
            class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            @click="closeModal"
            aria-label="Close modal"
          >
            <i class="ph ph-x text-3xl"></i>
          </button>
          <img
            :src="modalImageSrc"
            :alt="modalImageAlt"
            class="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProjectTimeline from "./ProjectTimeline.vue";

export default {
  name: "AboutWhy",
  components: { ProjectTimeline },
  data() {
    return {
      isModalOpen: false,
      modalImageSrc: "",
      modalImageAlt: "",
    };
  },
  computed: {
    ...mapState([
      "contributors",
      "contributorsLoading",
      "contributorsError",
      "overview",
      "overviewLoading",
      "overviewError",
      "landingArticles",
    ]),
    overviewSections() {
      if (!this.overview) {
        return [];
      }
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.overview, "text/html");
        const nodes = Array.from(doc.body.childNodes).filter((node) => {
          return !(
            node.nodeType === Node.TEXT_NODE && !node.textContent.trim()
          );
        });

        const sections = [];
        let current = [];

        nodes.forEach((node) => {
          const isHeading =
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName.toLowerCase() === "h2";

          if (isHeading && current.length) {
            sections.push(current);
            current = [node];
          } else {
            current.push(node);
          }
        });

        if (current.length) {
          sections.push(current);
        }

        return sections;
      } catch (error) {
        console.error("Error parsing overview content", error);
        return [];
      }
    },
    overviewIntroHtml() {
      if (!this.overviewSections.length) {
        return null;
      }
      return this.nodesToHtml(this.overviewSections[0]);
    },
    overviewDetailsHtml() {
      if (this.overviewSections.length <= 1) {
        return null;
      }
      // Assuming Overview article no longer contains Timeline, render all remaining sections
      const remaining = this.overviewSections.slice(1).flat();
      return this.nodesToHtml(remaining);
    },
    timelineSections() {
      const article = this.landingArticles.timeline;
      if (!article) return [];

      const body =
        article.attributes?.body?.processed ||
        article.attributes?.body?.value ||
        article.body?.[0]?.value ||
        "";
      if (!body) return [];

      const parser = new DOMParser();
      const doc = parser.parseFromString(body, "text/html");

      // Fix image paths
      const drupalBaseUrl = "https://gvd.research-stage.artsci.wustl.edu";
      doc.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("/")) {
          img.setAttribute("src", drupalBaseUrl + src);
        }
      });

      const sections = [];
      let currentSection = { title: null, events: [] };
      sections.push(currentSection);

      const processList = (list) => {
        Array.from(list.children).forEach((li) => {
          const clone = li.cloneNode(true);
          const highlights = [];

          const nestedLists = Array.from(clone.children).filter(
            (c) => c.tagName === "UL" || c.tagName === "OL",
          );

          nestedLists.forEach((nl) => {
            Array.from(nl.children).forEach((nli) => {
              highlights.push(nli.innerHTML);
            });
            nl.remove();
          });

          const text = clone.textContent.trim();
          const parts = text.split(/[—–-]/);
          const date = parts[0] ? parts[0].trim() : "";
          const title = parts.slice(1).join("—").trim() || text;

          const event = {
            id: `evt-${sections.length}-${currentSection.events.length}`,
            date: date,
            title: title,
            summary: "",
            highlights: highlights,
          };
          currentSection.events.push(event);
        });
      };

      Array.from(doc.body.childNodes).forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const tagName = node.tagName.toLowerCase();

        if (tagName === "h3") {
          // Start new section (or set title if current is empty)
          if (currentSection.events.length > 0) {
            currentSection = { title: node.textContent, events: [] };
            sections.push(currentSection);
          } else {
            currentSection.title = node.textContent;
          }
        } else if (tagName === "ul" || tagName === "ol") {
          processList(node);
        } else if (tagName === "h2") {
          // Ignore main title
        } else {
          // Append other content (p, img) to the last event of the current section
          if (currentSection.events.length > 0) {
            const lastEvent =
              currentSection.events[currentSection.events.length - 1];
            lastEvent.summary += node.outerHTML;
          }
        }
      });

      return sections.filter((s) => s.events.length > 0);
    },
  },
  methods: {
    ...mapActions([
      "fetchContributors",
      "fetchOverview",
      "fetchLandingArticles",
    ]),
    nodesToHtml(nodes) {
      if (!nodes || !nodes.length) {
        return null;
      }
      const container = document.createElement("div");
      const drupalBaseUrl = "https://gvd.research-stage.artsci.wustl.edu";

      nodes.forEach((node) => {
        const clone = node.cloneNode(true);
        if (clone.nodeType === Node.ELEMENT_NODE) {
          // Fix images in the clone
          if (clone.tagName.toLowerCase() === "img") {
            const src = clone.getAttribute("src");
            if (src && src.startsWith("/")) {
              clone.setAttribute("src", drupalBaseUrl + src);
            }
          }
          // Fix nested images
          clone.querySelectorAll?.("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (src && src.startsWith("/")) {
              img.setAttribute("src", drupalBaseUrl + src);
            }
          });
        }
        container.appendChild(clone);
      });
      return container.innerHTML;
    },
    handleImageClick(event) {
      if (event.target.tagName === "IMG") {
        event.preventDefault();
        this.modalImageSrc = event.target.src;
        this.modalImageAlt = event.target.alt || "Timeline image";
        this.isModalOpen = true;
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.modalImageSrc = "";
      this.modalImageAlt = "";
    },
  },
  mounted() {
    this.fetchLandingArticles();
    if (!this.contributors.length) {
      this.fetchContributors();
    }
    if (!this.overview) {
      this.fetchOverview();
    }
  },
};
</script>

<style scoped>
/* Specific overrides if needed */
:deep(.timeline-section img) {
  max-width: 400px;
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: zoom-in;
  transition: transform 0.2s ease-in-out;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

:deep(.timeline-section img:hover) {
  transform: scale(1.02);
}

:deep(.overview-section h2) {
  font-family: "larken", serif;
  font-size: var(--type-section-title);
  font-weight: 500;
  color: black;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
  line-height: var(--leading-tight);
}

:deep(.overview-section h3) {
  font-family: "larken", serif;
  font-size: var(--type-subtitle);
  font-weight: 500;
  color: var(--dark-bg);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: var(--leading-tight);
}

.quick-links-list {
  background-color: #f5f1f5;
  background-image: url("~@/assets/gvd/gvd-logo.png");
  padding: 1rem 2.2rem;
  list-style: none;
  color: var(--primary-color);
  border-radius: 1.2rem;
  background-size: 220px;
  background-repeat: no-repeat;
  background-position: bottom -80px right -80px;
  margin-top: 0;
  /* margin-bottom: 2rem; */
}

.quick-links-list li {
  margin-bottom: 0.2rem;
}

.quick-links-list a {
  text-decoration: none;
  color: var(--primary-color);
  font-size: 1rem; /* 18px approx */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-links-list a:hover {
  text-decoration: underline;
}

.quick-links-list i {
  font-size: 1rem;
}

.contributors-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 1.5rem;
}

.contributor-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.9rem 0.25rem;
  border-bottom: 1px solid var(--border-color-light);
}

.contributor-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.contributor-text {
  min-width: 0;
}

.contributor-name {
  display: block;
  font-size: var(--type-body);
  line-height: 1.35;
  font-weight: 600;
  color: var(--dark-bg);
}

.contributor-role {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.74rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.contributor-bio {
  margin-top: 0.45rem;
  font-size: var(--type-body-sm);
  color: #4b5563;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .contributors-list {
    grid-template-columns: 1fr;
  }

  .quick-links-list {
    padding: 1.1rem 1rem;
    background-size: 160px;
    background-position: bottom -55px right -55px;
  }

  .quick-links-list a {
    font-size: 1rem;
    line-height: 1.45;
    align-items: flex-start;
  }
}
</style>
