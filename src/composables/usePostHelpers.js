/**
 * Composable for shared post/article helper methods
 * Used by Landing.vue, Blog.vue, and other components that display posts
 */
export function usePostHelpers() {
  const getPostUuid = (post) => {
    return post.uuid?.[0]?.value || post.uuid || "";
  };

  const getPostNid = (post) => {
    return post.nid?.[0]?.value || post.nid || "";
  };

  const getPostTitle = (post) => {
    const title = post.title?.[0]?.value || post.title || "";
    // Strip HTML tags if present
    const tmp = document.createElement("DIV");
    tmp.innerHTML = title;
    const cleanTitle = tmp.textContent || tmp.innerText || title;
    return cleanTitle.trim();
  };

  const getPostAuthor = (post) => {
    // Handle string format (new flat structure)
    if (typeof post.field_author === "string" && post.field_author.trim()) {
      return post.field_author;
    }

    // Handle array format (old structure)
    if (
      post.field_author &&
      Array.isArray(post.field_author) &&
      post.field_author.length > 0
    ) {
      if (post.field_author[0].value) {
        return post.field_author[0].value;
      }
      if (typeof post.field_author[0] === "string") {
        return post.field_author[0];
      }
    }

    // Try attributes.field_author (JSON:API format)
    if (post.attributes && post.attributes.field_author) {
      return post.attributes.field_author;
    }

    // Check for 'creators' if it exists (from Zotero sync)
    if (post.creators && post.creators.length) {
      return post.creators.join(", ");
    }

    return "GVD Team";
  };

  const getPostCategory = (post) => {
    let tagValue = "";

    // Handle string format
    if (typeof post.field_tags === "string" && post.field_tags.trim()) {
      tagValue = post.field_tags;
    }
    // Handle array format
    else if (
      post.field_tags &&
      Array.isArray(post.field_tags) &&
      post.field_tags.length > 0
    ) {
      if (post.field_tags[0].value) {
        tagValue = post.field_tags[0].value;
      } else if (typeof post.field_tags[0] === "string") {
        tagValue = post.field_tags[0];
      }
    }
    // Try attributes.field_tags (JSON:API format)
    else if (post.attributes && post.attributes.field_tags) {
      tagValue = post.attributes.field_tags;
    }
    // Fallback to generic tags
    else if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
      tagValue = post.tags[0];
    }

    // Strip HTML tags if present
    if (tagValue) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = tagValue;
      const cleanTag = tmp.textContent || tmp.innerText || tagValue;
      return cleanTag.trim();
    }

    return "Article";
  };

  const getPostBody = (post) => {
    if (typeof post.body === "string") {
      return post.body;
    }
    if (post.body && post.body[0]) {
      return post.body[0].summary || post.body[0].value || "";
    }
    return "";
  };

  const getPostTagName = (post) => {
    if (!post.field_tags) return "";

    // Handle array format
    if (Array.isArray(post.field_tags) && post.field_tags[0]) {
      return post.field_tags[0].name || "";
    }

    // Handle HTML string format
    if (typeof post.field_tags === "string" && post.field_tags.trim()) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = post.field_tags;
      const tagName = tmp.textContent || tmp.innerText || "";
      return tagName.trim();
    }

    return "";
  };

  const truncateText = (text, maxLength) => {
    if (text && typeof text === "string" && text.length > maxLength) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = text;
      const plain = tmp.textContent || tmp.innerText || "";
      return plain.substring(0, maxLength) + "...";
    }
    return text || "";
  };

  return {
    getPostUuid,
    getPostNid,
    getPostTitle,
    getPostAuthor,
    getPostCategory,
    getPostBody,
    getPostTagName,
    truncateText,
  };
}
