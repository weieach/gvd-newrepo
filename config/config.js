// In development the Vue CLI dev server proxies /solr_gvd → talus.artsci.wustl.edu,
// so we use a relative path to avoid CORS errors on localhost.
export const SOLR_BASE =
  process.env.NODE_ENV === "production"
    ? "https://talus.artsci.wustl.edu/solr_gvd"
    : "/solr_gvd";

// Kept for any remaining legacy references
export const API_CONFIG = {
  protocol: "https",
  host: "talus.artsci.wustl.edu",
  path: "solr_gvd",
};
