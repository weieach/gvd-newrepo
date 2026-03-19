<template>
  <div class="pagecomponent content-page">
    <page-header />
    <section class="content-hero" aria-labelledby="faq-title">
      <div class="hero-copy">
        <h1 id="faq-title">Using the Gender Violence Database</h1>
        <p>
          These FAQs cover how to navigate the schema, combine tags, and locate
          full-text articles.
        </p>
      </div>
    </section>

    <section class="content-section" aria-labelledby="tutorial-title">
      <div class="content-card">
        <div class="section-header">
          <h2 id="tutorial-title">Video tutorial</h2>
          <p>Walk through the search interface in a short demonstration.</p>
        </div>
        <video controls class="faq-video">
          <source type="video/webm" src="static/GVD_SearchTutorial.webm" />
          <source type="video/mp4" src="static/GVD_SearchTutorial.mov" />
          <p>
            It appears this video will not play in your browser.
            <a href="static/GVD_SearchTutorial.mov">Download the tutorial</a> to
            watch locally.
          </p>
        </video>
      </div>
    </section>

    <section class="content-section" aria-labelledby="schema-title">
      <div class="content-card">
        <div class="section-header">
          <h2 id="schema-title">Understanding the schema</h2>
          <p>
            The database organizes content across four primary dimensions:
            population, issues, responses, and source type.
          </p>
        </div>
        <ul class="bullet-list">
          <li>
            The schema is hierarchical and expandable—select tags as broadly or
            specifically as you need to refine your search.
          </li>
          <li>
            Clickable (teal) tags show the number of articles available; grey
            labels provide structure but are not selectable.
          </li>
          <li>
            Combine multiple tags to create intersectional searches reflecting
            real-world contexts and populations.
          </li>
        </ul>
        <figure class="diagram">
          <img src="../assets/faq1.png" alt="The collapsed schema" />
          <figcaption>The collapsed schema</figcaption>
        </figure>
        <figure class="diagram">
          <img src="../assets/faq2.png" alt="The expanded schema" />
          <figcaption>The expanded schema</figcaption>
        </figure>
      </div>
    </section>

    <section class="content-section" aria-labelledby="search-title">
      <div class="content-card">
        <div class="section-header">
          <h2 id="search-title">Combining tags and keywords</h2>
          <p>
            Use the central search box to build AND/OR groups or pair keyword
            searches with schema tags.
          </p>
        </div>
        <ul class="bullet-list">
          <li>
            Full-text search scans titles and abstracts, but the richest results
            come from selecting schema tags.
          </li>
          <li>
            The AND/OR button lets you emphasize intersections or broaden your
            query with parallel tags.
          </li>
          <li>
            Combine tags to reflect intersecting identities and issues in line
            with the database’s intersectional design principles.
          </li>
        </ul>
        <figure class="diagram">
          <img src="../assets/faq3.png" alt="Results for OR search" />
          <figcaption>
            Results for items tagged with “Drug and alcohol facilitated
            violence” OR “Stigma”
          </figcaption>
        </figure>
        <figure class="diagram">
          <img src="../assets/faq4.png" alt="Results for AND search" />
          <figcaption>
            Results for items tagged with both “Drug and alcohol facilitated
            violence” AND “Stigma”
          </figcaption>
        </figure>
        <figure class="diagram">
          <img src="../assets/faq5.png" alt="Combined AND/OR search" />
          <figcaption>
            Combining AND/OR logic to broaden results while keeping a focused
            intersection
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="content-section" aria-labelledby="access-tips-title">
      <div class="content-card">
        <div class="section-header">
          <h2 id="access-tips-title">When sources aren’t available</h2>
          <p>
            Try these steps if you encounter a citation without direct access to
            the article.
          </p>
        </div>
        <ul class="bullet-list">
          <li>
            Contact your institutional librarian for interlibrary loan or
            database support.
          </li>
          <li>
            Search for the author or title via larger indexes such as
            <a href="http://scholar.google.com/" target="_blank" rel="noopener"
              >Google Scholar</a
            >.
          </li>
          <li>
            Check the journal’s website for purchase, subscription, or open
            access options.
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import PageHeader from "./PageHeader.vue";

export default {
  name: "Faq",
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

.hero-copy h1 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: clamp(2rem, 2.6vw + 1rem, 3rem);
  color: var(--color-primary-600);
}

.hero-copy p {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 68ch;
}

.content-section {
  padding: 0 var(--spacing-8) var(--spacing-10);
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
}

.section-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-primary-600);
}

.section-header p {
  margin: 0;
  color: var(--color-text-secondary);
}

.faq-video {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 40px rgba(20, 30, 60, 0.12);
}

.bullet-list {
  margin: 0;
  padding-left: var(--spacing-5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.diagram {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  align-items: flex-start;
}

.diagram img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 28px rgba(20, 30, 60, 0.12);
}

.diagram figcaption {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .content-hero {
    padding: var(--spacing-8) var(--spacing-5) var(--spacing-4);
  }

  .content-section {
    padding: 0 var(--spacing-5) var(--spacing-8);
  }
}
</style>
