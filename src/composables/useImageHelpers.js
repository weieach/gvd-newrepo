import { ref } from "vue";

/**
 * Composable for handling Drupal image fetching and URL resolution
 * Used by Landing.vue, Blog.vue, Blog_test.vue and other components that display post images
 */
export function useImageHelpers(defaultThumbnail) {
  const postImageMap = ref({});
  const postImageRequests = ref({});

  const apiBase =
    process.env.VUE_APP_JSONAPI_BASE_URL ||
    "https://gvd.research-stage.artsci.wustl.edu/admin";

  /**
   * Resolve relative Drupal image URIs to absolute URLs
   */
  const resolveDrupalImageUrl = (base, relativeUri) => {
    if (!relativeUri || typeof relativeUri !== "string") return "";
    if (/^https?:\/\//i.test(relativeUri)) return relativeUri;

    const origin = new URL(base).origin;
    if (relativeUri.startsWith("/admin/")) return `${origin}${relativeUri}`;
    if (relativeUri.startsWith("/sites/"))
      return `${origin}/admin${relativeUri}`;
    if (relativeUri.startsWith("/")) return `${origin}${relativeUri}`;
    return `${base}/${relativeUri}`.replace(/([^:]\/)\/+/g, "$1");
  };

  /**
   * Convert an image URL to absolute format
   */
  const toAbsoluteUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") return "";
    const trimmed = imageUrl.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    const origin = new URL(apiBase).origin;
    if (trimmed.startsWith("/admin/")) return `${origin}${trimmed}`;
    if (trimmed.startsWith("/sites/")) return `${origin}/admin${trimmed}`;
    if (trimmed.startsWith("/")) return `${origin}${trimmed}`;
    return `${apiBase}/${trimmed}`.replace(/([^:]\/)\/+/g, "$1");
  };

  /**
   * Fetch post image from Drupal JSON:API
   */
  const fetchPostImageByUuid = async (postUuid) => {
    if (
      !postUuid ||
      postImageMap.value[postUuid] ||
      postImageRequests.value[postUuid]
    ) {
      return;
    }

    postImageRequests.value = {
      ...postImageRequests.value,
      [postUuid]: true,
    };

    try {
      const response = await fetch(
        `${apiBase}/jsonapi/node/article/${postUuid}?include=field_image`,
        { headers: { Accept: "application/vnd.api+json" } },
      );
      if (!response.ok) return;

      const articleJson = await response.json();
      const imageRelationship =
        articleJson?.data?.relationships?.field_image?.data;
      if (!imageRelationship) return;

      const included = Array.isArray(articleJson.included)
        ? articleJson.included
        : [];
      const imageData = included.find(
        (item) => item.id === imageRelationship.id,
      );
      const relativeUri = imageData?.attributes?.uri?.url;
      if (!relativeUri) return;

      const absoluteUrl = resolveDrupalImageUrl(apiBase, relativeUri);

      postImageMap.value = { ...postImageMap.value, [postUuid]: absoluteUrl };
    } catch (error) {
      console.error(`Failed to fetch image for post ${postUuid}:`, error);
    } finally {
      const { [postUuid]: _ignored, ...remaining } = postImageRequests.value;
      postImageRequests.value = remaining;
    }
  };

  /**
   * Get post image URL from cache or field_image data
   */
  const getPostImage = (post, getPostUuid) => {
    const postUuid = getPostUuid(post);
    if (postUuid && postImageMap.value[postUuid]) {
      return postImageMap.value[postUuid];
    }

    const fieldImage = post?.field_image;
    if (!fieldImage) return defaultThumbnail;

    if (Array.isArray(fieldImage) && fieldImage[0]) {
      const imageUrl =
        fieldImage[0].url ||
        fieldImage[0].uri?.url ||
        fieldImage[0].uri ||
        fieldImage[0].image_style_uri?.thumbnail;
      return toAbsoluteUrl(imageUrl) || defaultThumbnail;
    }

    if (typeof fieldImage === "object") {
      const imageUrl =
        fieldImage.url ||
        fieldImage.uri?.url ||
        fieldImage.uri ||
        fieldImage.image_style_uri?.thumbnail;
      return toAbsoluteUrl(imageUrl) || defaultThumbnail;
    }

    if (typeof fieldImage === "string") {
      return toAbsoluteUrl(fieldImage) || defaultThumbnail;
    }

    return defaultThumbnail;
  };

  /**
   * Prefetch images for an array of posts
   */
  const prefetchPostImages = async (posts, getPostUuid) => {
    if (!Array.isArray(posts) || posts.length === 0) return;
    await Promise.all(
      posts.map((post) => fetchPostImageByUuid(getPostUuid(post))),
    );
  };

  return {
    postImageMap,
    postImageRequests,
    resolveDrupalImageUrl,
    toAbsoluteUrl,
    fetchPostImageByUuid,
    getPostImage,
    prefetchPostImages,
  };
}
