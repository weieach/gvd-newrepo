<template>
  <span v-if="tagLabel && capitalizedTooltip" class="resulttag-container">
    <span
      class="resulttag label-with-tooltip"
      :class="`tooltip-${tooltipPosition}`"
      :data-tooltip="truncatedTooltip"
      :data-tooltip-long="isTooltipLong"
      :data-tooltip-expanded="tooltipExpanded"
      @click="addTagToQuery"
      @mouseenter="checkTooltipPosition"
    >
      {{ tagLabel }}
      <font-awesome-icon
        :icon="['fas', 'info-circle']"
        class="info-icon"
        @click.stop="handleInfoIconClick"
      />
    </span>
  </span>
  <span v-else-if="tagLabel" class="resulttag" @click="addTagToQuery">{{
    tagLabel
  }}</span>
</template>

<script>
import { computed, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "result-tag",
  components: {
    FontAwesomeIcon,
  },
  props: ["tagname"],
  setup(props) {
    const store = useStore();
    const tooltipExpanded = ref(false);
    const tooltipPosition = ref("top");
    let tooltipTimeout = null;

    const tagLabel = computed(() => {
      const jTag = store.getters.taglookup[props.tagname];
      return jTag && "label" in jTag ? jTag.label : "";
    });

    const capitalizedTooltip = computed(() => {
      const definition = store.getters.getTagDefinition(props.tagname);
      if (!definition) return "";
      const text = definition.trim();
      if (text.length === 0) return text;
      return text.charAt(0).toUpperCase() + text.slice(1);
    });

    const isTooltipLong = computed(() => {
      return capitalizedTooltip.value.length > 150;
    });

    const truncatedTooltip = computed(() => {
      if (!isTooltipLong.value || tooltipExpanded.value) {
        return capitalizedTooltip.value;
      }
      return capitalizedTooltip.value.substring(0, 150) + "...";
    });

    const toggleTooltip = () => {
      tooltipExpanded.value = !tooltipExpanded.value;

      // Clear any existing timeout
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }

      // If tooltip is now expanded, set timeout to auto-hide after 3 seconds
      if (tooltipExpanded.value) {
        tooltipTimeout = setTimeout(() => {
          tooltipExpanded.value = false;
          tooltipTimeout = null;
        }, 3000);
      }
    };

    const checkTooltipPosition = (event) => {
      const element = event.target;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top < viewportHeight / 3) {
        tooltipPosition.value = "bottom";
      } else {
        tooltipPosition.value = "top";
      }
    };

    const addTagToQuery = () => {
      const tagData = {
        tagname: props.tagname,
        label: tagLabel.value,
      };
      store.dispatch("addTag", tagData);
    };

    const handleTagClick = () => {
      if (isTooltipLong.value) {
        toggleTooltip();
      } else {
        addTagToQuery();
      }
    };

    const handleInfoIconClick = () => {
      toggleTooltip();
    };

    // Cleanup timeout on component unmount
    onUnmounted(() => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    });

    return {
      tagLabel,
      capitalizedTooltip,
      isTooltipLong,
      truncatedTooltip,
      tooltipExpanded,
      tooltipPosition,
      toggleTooltip,
      checkTooltipPosition,
      addTagToQuery,
      handleTagClick,
      handleInfoIconClick,
    };
  },
};
</script>

<style scoped>
.resulttag {
  display: inline-block;
  background-color: rgba(90, 54, 107, 0.08);
  color: var(--color-primary-600);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-base), transform var(--transition-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid transparent;
}

.resulttag:hover {
  background-color: rgba(90, 54, 107, 0.15);
  transform: translateY(-1px);
}

.label-with-tooltip {
  position: relative;
  cursor: pointer !important; /* Force pointer for clickability */
}

/* Tooltip positioning above (default) */
.label-with-tooltip.tooltip-top::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-5px);
  background-color: var(--color-background-dark);
  color: var(--color-text-inverse);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  white-space: pre-wrap;
  z-index: var(--z-tooltip);
  box-shadow: var(--shadow-md);
  width: 300px;
  max-width: 300px;
  word-wrap: break-word;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-base), visibility var(--transition-base);
  transition-delay: 0.8s;
  pointer-events: none; /* Prevent tooltip from blocking clicks */
}

.label-with-tooltip.tooltip-top::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  border: 5px solid transparent;
  border-top-color: #333;
  z-index: 99999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  transition-delay: 0.8s;
  pointer-events: none;
}

/* Tooltip positioning below */
.label-with-tooltip.tooltip-bottom::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  background-color: var(--color-background-dark);
  color: var(--color-text-inverse);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  white-space: pre-wrap;
  z-index: var(--z-tooltip);
  box-shadow: var(--shadow-md);
  width: 300px;
  max-width: 300px;
  word-wrap: break-word;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-base), visibility var(--transition-base);
  transition-delay: 0.8s;
  pointer-events: none;
}

.label-with-tooltip.tooltip-bottom::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  border: 5px solid transparent;
  border-bottom-color: #333;
  z-index: 99999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  transition-delay: 0.8s;
  pointer-events: none;
}

.label-with-tooltip.tooltip-top:hover::after,
.label-with-tooltip.tooltip-top:hover::before,
.label-with-tooltip.tooltip-bottom:hover::after,
.label-with-tooltip.tooltip-bottom:hover::before {
  opacity: 1;
  visibility: visible;
}

.info-icon {
  margin-left: 6px;
  font-size: 0.8em;
  opacity: 0.6;
  color: inherit;
  cursor: help; /* Info icon gets help cursor */
}

.info-icon:hover {
  opacity: 1;
}
</style>
