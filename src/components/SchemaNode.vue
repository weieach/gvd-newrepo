<template>
  <li
    :class="{ 'has-children': haschildren }"
    role="treeitem"
    :aria-expanded="haschildren && !collapsed"
    class="list-unstyled"
  >
    <div
      v-if="haschildren"
      @click="handleLabelClick"
      class="label d-flex align-items-center justify-content-between bg-info"
      :class="`depth-level-${effectiveDepth}`"
    >
      <span class="expandButton">
        <i
          :class="
            collapsed ? 'ph-bold ph-caret-right' : 'ph-bold ph-caret-down'
          "
        ></i>
        <span
          v-if="capitalizedTooltip"
          class="label-with-tooltip"
          :data-tooltip="truncatedTooltip"
        >
          {{ node.label }}
          <font-awesome-icon :icon="['fas', 'info-circle']" class="info-icon" />
        </span>
        <span v-else>{{ node.label }}</span>
      </span>
      <!-- <span>
        <span v-if="isPenultimate">
          <button @click.stop="toggleAllChildren" class="action-button">
            {{ allChildrenSelected ? "Deselect All" : "Select All" }}
          </button>
        </span>
      </span> -->
    </div>
    <div
      v-else
      class="label d-flex align-items-center justify-content-between bg-light"
      :class="`depth-level-${effectiveDepth}`"
      @click="toggleTag"
    >
      <span class="label-content">
        <input
          type="checkbox"
          :checked="isSelected"
          class="form-check-input me-2"
          @click.stop="toggleTag"
        />
        <span
          v-if="capitalizedTooltip"
          class="label-with-tooltip"
          :data-tooltip="truncatedTooltip"
        >
          {{ node.label }}
          <font-awesome-icon :icon="['fas', 'info-circle']" class="info-icon" />
        </span>
        <span v-else>{{ node.label }}</span>
      </span>
      <span class="facet-count">
        ({{ facetcount && facetcount.toLocaleString() }})
      </span>
    </div>

    <ul v-if="haschildren && !collapsed" class="ps-3">
      <schema-node
        v-for="child in sortedChildren"
        :node="child"
        :depth="(depth || 0) + 1"
        :key="child.id"
        :expanded-nodes="expandedNodes"
      ></schema-node>
    </ul>
  </li>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "schema-node",
  components: {
    FontAwesomeIcon,
  },
  props: ["node", "depth", "expandedNodes"],
  data() {
    return {
      collapsed: true,
    };
  },
  computed: {
    ...mapState(["query"]),
    ...mapGetters(["isNodeSelected", "getTagDefinition", "getNodeDefinition"]),

    effectiveDepth() {
      if (
        (this.depth === 0 || this.depth === 1) &&
        this.node.tagname &&
        this.node.tagname.length > 0
      ) {
        return 2;
      }
      return this.depth || 0;
    },
    haschildren() {
      return this.node.children && this.node.children.length > 0;
    },
    allChildrenSelected() {
      return (
        this.haschildren &&
        this.node.children.every((child) => this.isNodeSelected(child.tagname))
      );
    },
    isPenultimate() {
      return (
        this.haschildren &&
        this.node.children.every(
          (child) => !child.children || child.children.length === 0,
        )
      );
    },
    facetcount() {
      const tagfacets = this.$store.getters.tagfacets;
      return tagfacets[this.node.tagname];
    },
    isSelected() {
      return this.isNodeSelected(this.node.tagname);
    },
    sortedChildren() {
      if (!this.node.children) return [];
      return [...this.node.children].sort((a, b) => {
        const aHasChildren = a.children && a.children.length > 0;
        const bHasChildren = b.children && b.children.length > 0;
        return bHasChildren - aHasChildren;
      });
    },
    capitalizedTooltip() {
      const definition = this.getNodeDefinition(this.node);
      if (!definition) return "";
      const text = definition.trim();
      if (text.length === 0) return text;
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    truncatedTooltip() {
      return this.capitalizedTooltip;
    },
    nodeKey() {
      return `${this.node.label || ""}-${this.node.tagname || ""}-${
        this.node.id || ""
      }`;
    },
    shouldBeExpanded() {
      return this.expandedNodes && this.expandedNodes.has(this.nodeKey);
    },
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    toggleAllChildren() {
      const action = this.allChildrenSelected
        ? "removeMultipleTags"
        : "addMultipleTags";
      const tags = this.node.children.map((child) => ({
        tagname: child.tagname,
        label: child.label,
      }));
      this.$store.dispatch(action, tags);
    },
    handleLabelClick() {
      if (this.haschildren) {
        this.toggleCollapsed();
      } else {
        this.toggleTag();
      }
    },
    toggleTag() {
      if (this.isSelected) {
        this.$store.dispatch("removeTag", this.node.tagname);
      } else {
        this.$store.dispatch("addTag", {
          tagname: this.node.tagname,
          label: this.node.label,
        });
      }
    },
  },
  watch: {
    shouldBeExpanded: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.collapsed = false;
        }
      },
    },
  },
};
</script>

<style scoped>
.label {
  cursor: pointer;
  padding: 0.5rem 1rem;
  /* background-color: #eee9ef; */
  margin-bottom: 0.25rem;
  transition: background-color 0.3s ease;
  border-radius: 0.5rem;
}

.label:hover {
  /* background-color: #eee9ef !important; */
}

.expandButton i {
  margin-right: 0.5rem;
}

/* Remove old tree line attempts */
li[role="treeitem"] {
  position: relative;
}

/* Clear default ul styles */
ul.ps-3 {
  list-style-type: none;
  padding-left: 16px;
  margin-left: 24px; /* Progressive indentation */
  margin-top: 4px;
  margin-bottom: 4px;
  border-left: 3px solid #F3EEF3;
  transition: border-color 0.2s ease;
}

/* Stronger border on hover */
ul.ps-3:hover {
  border-left-color: rgba(136, 63, 143, 0.35);
}

.label {
  position: relative;
  z-index: 1;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  border-left: 3px solid transparent;
}

/* Parent items (with children) get distinctive styling */
.has-children > .label {
  font-weight: 500;
  background-color: rgb(255, 255, 255);
}

.has-children > .label:hover {
  background-color: rgba(255, 255, 255, 0.85);
  border-left: 3px solid #C29CC5;
}

/* Leaf items (no children) are lighter */
li[role="treeitem"]:not(.has-children) > .label {
  background-color: rgba(255, 255, 255, 0.6);
}

li[role="treeitem"]:not(.has-children) > .label:hover {
  background-color: rgba(255, 255, 255, 0.7);
  border-left-color: rgba(136, 63, 143, 0.4);
}

/* Depth-based left accent colors */
.depth-level-0 > .label {
  border-left-width: 4px;
}

.depth-level-1 > .label {
  border-left-width: 3px;
}

.depth-level-2 > .label {
  border-left-width: 3px;
}

.depth-level-3 > .label {
  border-left-width: 2px;
}

.has-children[aria-expanded="true"] > .label {
  background-color: rgba(255, 255, 255, 0.7);
  border-left-color: #883f8f;
  margin-bottom: 0.5rem;
}

/* Add subtle top border to expanded sections */
.has-children[aria-expanded="true"] > ul.ps-3 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.expandButton i {
  margin-right: 0.5rem;
  color: #883f8f;
  transition: transform 0.2s ease;
}

.has-children[aria-expanded="true"] .expandButton i {
  transform: rotate(0deg);
}

.has-children[aria-expanded="false"] .expandButton i {
  transform: rotate(-90deg);
}

/* Depth-based background colors for tag containers */
/* .depth-level-0 {
  background-color: #eee9ef !important;
}

.depth-level-1 {
  background-color: #f5f2f7 !important;
}

.depth-level-2 {
  background-color: #e8ddf0 !important;
}

.depth-level-3 {
  background-color: #dbc8e9 !important;
}

.depth-level-4 {
  background-color: #ceb3e2 !important;
}

.depth-level-5 {
  background-color: #c19edb !important;
}

.depth-level-6 {
  background-color: #e6f5f5 !important;
}

.depth-level-7 {
  background-color: #d1ecec !important;
}

.depth-level-8,
.depth-level-9,
.depth-level-10 {
  background-color: #ffe5e3 !important;
} */

.has-children > .label {
  transition: background-color 0.3s ease;
}

[data-title]:hover::after {
  content: attr(data-title);
  padding: 0.25rem 0.5rem;
  color: #fff;
  position: absolute;
  left: 100%;
  top: 0;
  z-index: 20;
  white-space: nowrap;
  background-color: #eee9ef;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* .has-children > .label {
  background-color: #eee9ef !important;
} */

.action-button {
  padding: 2px 5px;
  font-size: 0.75rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.info-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  color: #007bff;
}

.info-button:hover {
  color: #0056b3;
}

.label-with-tooltip {
  position: relative;
  cursor: inherit;
}

.label-with-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 0;
  transform: translateY(-5px);
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
  z-index: 99999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  max-width: 300px;
  word-wrap: break-word;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  transition-delay: 0.8s;
}

.info-icon {
  margin-left: 4px;
  font-size: 0.62em;
  vertical-align: super;
  opacity: 0.7;
  color: #666;
  cursor: help;
  padding: 0;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: static;
  z-index: auto;
}

.info-icon:hover {
  opacity: 1;
  color: #4a4a4a;
  background-color: rgba(0, 0, 0, 0.1);
}

.label-with-tooltip::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 20px;
  transform: translateY(100%);
  border: 5px solid transparent;
  border-top-color: #333;
  z-index: 99999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  transition-delay: 0.8s;
}

.label-with-tooltip:hover::after,
.label-with-tooltip:hover::before {
  opacity: 1;
  visibility: visible;
}

.facet-count {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-weight: normal;
  color: #666;
  white-space: nowrap;
  pointer-events: none;
}

.label-content {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  padding-right: 4.25rem;
}
</style>
