<template>
  <div v-if="journals.length > 0" class="journal-display">
    <span 
      v-for="(journal, index) in journals" 
      :key="index"
      class="journal-chip"
      @click="removeJournal(journal)"
    >
      <span class="journal-text">{{ journal }}</span>
      <span class="remove-journal">×</span>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'JournalDisplay',
  computed: {
    ...mapState({
      journals: state => state.query.journalSearches || []
    })
  },
  methods: {
    removeJournal(journalName) {
      this.$store.dispatch('removeJournal', journalName);
    }
  }
};
</script>

<style scoped>
.journal-display {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin: var(--spacing-2) 0 var(--spacing-3) 0;
}

.journal-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  background: rgba(45, 154, 170, 0.12);
  color: var(--color-accent-600);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-base), transform var(--transition-base);
}

.journal-chip:hover {
  background: rgba(45, 154, 170, 0.2);
  transform: translateY(-1px);
}

.journal-text {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-journal {
  font-size: var(--font-size-base);
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
