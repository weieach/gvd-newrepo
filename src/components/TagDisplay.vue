<template>
  <section
    v-if="selectedTags.length"
    class="selected-tags"
    aria-label="Selected filters"
  >
    <div class="tags-header">
      <h2>Active filters</h2>
      <div class="header-actions">
        <button
          v-if="selectedTags.length > 1"
          type="button"
          class="clear-all-button"
          @click="clearAllTags"
        >
          Clear all
        </button>
        <button type="button" class="toggle-button" @click="toggleCollapse">
          {{ collapsed ? "Show" : "Hide" }}
        </button>
      </div>
    </div>
    <transition name="tag-fade">
      <div v-if="!collapsed" class="tags-display">
        <button
          v-for="tag in selectedTags"
          :key="tag.tagname"
          type="button"
          class="tag-chip"
          @click.stop="removeTag(tag.tagname)"
        >
          <span class="tag-label">{{ tag.label }}</span>
          <span class="remove-tag" aria-hidden="true">×</span>
        </button>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TagDisplay",
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    ...mapState({
      selectedTags: (state) => state.query.tags,
    }),
  },
  methods: {
    removeTag(tagname) {
      this.$store.dispatch("removeTag", tagname);
    },
    clearAllTags() {
      this.$store.dispatch("removeMultipleTags", this.selectedTags);
    },
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style scoped>
.selected-tags {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
}

.clear-all-button {
  border: none;
  background: transparent;
  color: #6b7280;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: color var(--transition-base), background var(--transition-base);
}

.clear-all-button:hover {
  color: var(--color-primary-600);
  background: rgba(90, 54, 107, 0.08);
}

.tags-header h2 {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-primary-600);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.toggle-button {
  border: none;
  background: rgba(90, 54, 107, 0.12);
  color: var(--color-primary-600);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-base),
    transform var(--transition-base);
}

.toggle-button:hover {
  background: rgba(90, 54, 107, 0.18);
  transform: translateY(-1px);
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
  border: 1px solid rgba(90, 54, 107, 0.18);
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-primary-600);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-base),
    transform var(--transition-base);
}

.tag-chip:hover {
  background: rgba(90, 54, 107, 0.12);
  transform: translateY(-1px);
}

.remove-tag {
  font-size: var(--font-size-base);
  line-height: 1;
}

.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.tag-fade-enter-from,
.tag-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
