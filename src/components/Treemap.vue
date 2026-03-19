<template>
  <div>
    <svg :viewBox="`0 0 ${width} ${height}`">
      <g>
        <g v-for="cell in treemap" v-bind:key="cell.data.id">
          <rect
            :x="cell.x0"
            :y="cell.y0"
            :fill="rgb(cell)"
            v-on:click="addQueryTag(cell)"
            :width="cell.x1 - cell.x0"
            :height="cell.y1 - cell.y0"
          >
            <title>{{ cell.data.label }}</title>
          </rect>

          <foreignObject
            v-if="cell.x1 - cell.x0 > 15 && cell.y1 - cell.y0 > 10"
            :x="cell.x0"
            :y="cell.y0"
            :width="cell.x1 - cell.x0"
            v-on:click="addQueryTag(cell)"
            :height="cell.y1 - cell.y0"
          >
            <div xmlns="http://www.w3.org/1999/xhtml" :title="cell.data.label">
              {{ cell.data.label }} ({{ cell.value }})
            </div>
          </foreignObject>
        </g>
      </g>
    </svg>
  </div>
</template>
<script>
/* eslint-disable vue/multi-word-component-names */
import * as d3 from "d3";

const colorfunc = d3.scaleOrdinal().range(
  d3.schemeCategory10.map((c) => {
    let cc = d3.rgb(c);
    cc.opacity = 0.8;
    return cc;
  })
);

export default {
  name: "treemap",
  data: function () {
    return { width: 800, height: 800 };
  },
  props: ["treemapdata"],
  computed: {
    treemap: function () {
      let treemapf = this.$d3
        .treemap()
        .tile(this.$d3.treemapResquarify) // treemapSquarify
        .size([this.width, this.height])
        .padding(1)
        .round(true);
      let root = this.$d3.hierarchy(
        JSON.parse(JSON.stringify(this.treemapdata))
      );
      let tm = treemapf(root.sum((d) => d.value));
      return tm.leaves();
    },
  },
  methods: {
    rgb: function (node) {
      let d = node;
      while (d.depth > 1) {
        d = d.parent;
      }
      let c = colorfunc(d.data.label);
      return `rgb(${c.r},${c.g},${c.b})`;
    },
    addQueryTag: function (cell) {
      var payload = { label: cell.data.label, tagname: cell.data.tagname };
      this.$store.commit("addQueryTag", payload);
    },
  },
};
</script>
<style scoped>
svg {
  width: 100%;
  height: auto;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 45px rgba(20, 30, 60, 0.08);
}

rect {
  opacity: 0.7;
  transition: opacity var(--transition-base), transform var(--transition-base);
  cursor: pointer;
}

rect:hover {
  opacity: 0.9;
  transform: translateZ(0);
}

foreignObject div {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-xs);
  text-align: center;
  color: var(--color-text-primary);
  padding: var(--spacing-1);
  line-height: 1.3;
  pointer-events: none;
}
</style>
