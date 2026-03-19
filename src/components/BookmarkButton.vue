<template>
  <i
    class="bookmark-button material-icons"
    :class="{ 'is-bookmarked': isBookmarked }"
    @click.stop="toggleBookmark"
    @click="$emit('bookmark-updated')"
  >
    {{ isBookmarked ? "bookmark" : "bookmark_border" }}
  </i>
</template>

<script>
import { useStore } from "vuex";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

export default {
  name: "BookmarkButton",
  props: ["doc"],
  emits: ["bookmark-updated"],
  setup(props, { emit }) {
    const store = useStore();
    const isBookmarked = ref(false);

    const checkBookmarkStatus = () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      isBookmarked.value = bookmarks.some((b) => b.key === props.doc.key);
    };

    const toggleBookmark = () => {
      isBookmarked.value = !isBookmarked.value;
      updateBookmarkStatus();

    };

    const updateBookmarkStatus = () => {
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const index = bookmarks.findIndex((b) => b.key === props.doc.key);
      if (isBookmarked.value) {
        if (index === -1) bookmarks.push(props.doc);
      } else {
        if (index !== -1) bookmarks.splice(index, 1);
      }
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      emit("bookmark-updated");
    };

    onMounted(() => {
      checkBookmarkStatus();
      window.addEventListener("focus", checkBookmarkStatus);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("focus", checkBookmarkStatus);
    });

    watch(() => props.doc, checkBookmarkStatus, {
      immediate: true,
      deep: true
    });

    return {
      isBookmarked,
      toggleBookmark
    };
  }
};
</script>

<style scoped>
.bookmark-button {
  cursor: pointer;
  color: #6f3d74;
  transition: color 0.2s ease;
}
.bookmark-button.is-bookmarked {
  color: var(--primary-color);
}
.bookmark-button:hover {
  color: #7b4680;
}
</style>
