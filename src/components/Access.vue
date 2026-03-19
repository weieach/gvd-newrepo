<template>
  <div class="pagecomponent content-page">
    <page-header />
    <section class="content-hero" aria-labelledby="access-title">
      <div class="hero-copy">
        <h1 id="access-title">Accessing full-text research</h1>
        <p>
          The database highlights citation data. Use the tips below to find
          openly available versions of articles when PDFs are not provided.
        </p>
      </div>
    </section>
    <section class="content-section" aria-label="Open access guidance">
      <div class="content-card">
        <p>
          Some strategies for locating open-access scholarship are available in
          this
          <a href="https://libguides.wustl.edu/openaccess/find" target="_blank" rel="noopener"
            >open access guide from Olin Library</a
          >
          at Washington University in St. Louis. The guide includes tools for
          checking institutional repositories, preprint servers, and author
          archives.
        </p>
        <p>
          If you have trouble accessing an article, note the citation and reach
          out to your institutional librarian or the GVD team—we are happy to
          help troubleshoot access pathways.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import PageHeader from "./PageHeader.vue";

export default {
  name: "Access",
  components: { PageHeader },
};
</script>

<style scoped>
.content-page {
  background: transparent;
}

.content-hero {
  padding: var(--spacing-10) var(--spacing-8) var(--spacing-6);
}

.hero-copy {
  max-width: 70ch;
}

.hero-copy h1 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: clamp(2rem, 2.6vw + 1rem, 3rem);
  color: var(--color-primary-600);
}

.hero-copy p {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.content-section {
  padding: 0 var(--spacing-8) var(--spacing-12);
}

.content-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(90, 54, 107, 0.12);
  box-shadow: 0 24px 60px rgba(20, 30, 60, 0.08);
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.content-card a {
  color: var(--color-accent-600);
}

@media (max-width: 768px) {
  .content-hero {
    padding: var(--spacing-8) var(--spacing-5) var(--spacing-4);
  }

  .content-section {
    padding: 0 var(--spacing-5) var(--spacing-10);
  }
}
</style>
