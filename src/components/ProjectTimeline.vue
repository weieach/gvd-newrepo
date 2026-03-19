<template>
  <section class="timeline-container" aria-labelledby="timeline-title">
    <div class="timeline-list">
      <div
        v-for="(event, index) in displayEvents"
        :key="event.id"
        class="timeline-item group"
      >
        <div class="timeline-marker">
          <div class="marker-dot"></div>
          <div
            class="marker-line"
            v-if="index !== displayEvents.length - 1"
          ></div>
        </div>

        <div class="timeline-content pb-8">
          <div
            class="date-label text-sm text-primary-color uppercase tracking-wide mb-1"
          >
            {{ event.date }}
          </div>
          <h3 class="text-xl font-medium text-dark-bg mb-2">
            {{ event.title }}
          </h3>
          <div
            v-if="event.summary"
            class="text-gray-600 leading-relaxed text-sm"
            v-html="event.summary"
          ></div>
          <ul
            v-if="event.highlights && event.highlights.length"
            class="mt-2 pl-4 list-disc text-sm text-gray-500 space-y-1"
          >
            <li
              v-for="(item, idx) in event.highlights"
              :key="idx"
              v-html="item"
            ></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ProjectTimeline",
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    displayEvents() {
      return this.events.length > 0 ? this.events : this.defaultEvents;
    },
  },
};
</script>

<style scoped>
.timeline-list {
  position: relative;
  padding-left: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 16px;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--color-background);
  border: 3px solid var(--primary-color);
  z-index: 10;
  margin-top: 0.35rem; /* Align with title */
}

.marker-line {
  flex-grow: 1;
  width: 2px;
  background-color: #ebe4ea;
  margin-top: 4px;
  margin-bottom: 4px;
}

.timeline-content {
  flex: 1;
  font-weight: 500;
}
</style>
