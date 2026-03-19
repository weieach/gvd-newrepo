<template>
  <div :class="subquery.status">
    <div class="querytext" v-on:click.stop="removeQueryText()">
      {{ subquery.querytext }}
    </div>
    <drop @drop="handleDrop" class="droptarget">
      <div class="info" v-if="isEmpty">
        Select one or more tags from the outline below to filter the results.
      </div>
      <div
        v-for="tag in subquery.tags"
        class="tag"
        v-on:click.stop="removeQueryTag(tag.tagname)"
      >
        {{ tag.label }}
      </div>
    </drop>
  </div>
</template>

<script>
import { Drop } from "vue-drag-drop";

export default {
  name: "sub-query",
  computed: {
    isEmpty: function () {
      let notEmpty =
        (this.subquery.tags.length > 0) | (this.subquery.querytext > "");
      return !notEmpty;
    },
  },
  props: ["subquery"],
  components: { Drop },
  methods: {
    removeQueryTag: function (tagname) {
      const payload = { tagname: tagname };
      this.$store.commit("removeQueryTag", payload);
    },
    addQueryTag: function (tagname) {
      const label = this.$store.getters.taglookup[tagname].label;
      const payload = { label: label, tagname: tagname };
      this.$store.commit("addQueryTag", payload);
    },
    removeQueryText: function () {
      this.$store.commit("removeQueryText", {});
    },
    handleDrop: function (data) {
      this.addQueryTag(data);
    },
  },
};
</script>

<style scoped>
.subquery {
  min-height: 15px;
  margin: var(--spacing-4) 0;
  text-align: center;
  max-width: var(--container-md);
}

.subquery .tag {
  background: #265d7d;
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-2);
  margin: var(--spacing-2) var(--spacing-3);
  color: var(--color-text-inverse);
  cursor: crosshair;
  border: 2px solid var(--color-background);
  font-family: var(--font-family-primary);
}

.droptarget {
  background: #4f7c96;
  min-width: 30px;
  min-height: 50px;
}

.querytext {
  background: #b0b0b0;
  font-family: var(--font-family-primary);
  padding: var(--spacing-1) var(--spacing-3);
}

.querytext:empty {
  padding: 0;
}

.info {
  padding: var(--spacing-4);
  line-height: var(--line-height-normal);
  color: var(--color-text-inverse);
  font-size: var(--font-size-base);
}
</style>
