import { createRouter, createWebHistory } from "vue-router";
import Search from "../components/Search.vue";
import Landing from "../components/Landing.vue";
import About from "../components/AboutGVD.vue";
import AboutWhy from "../components/AboutWhy.vue";
import Access from "../components/Access.vue";
import Faq from "../components/Faq.vue";
import Help from "../components/Help.vue";
import Journals from "../components/Journals.vue";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import SchemaEditor from "../components/SchemaEditor.vue";
import TreemapSplitPageRoute from "../components/TreemapSplitPage.vue";
import Untagged from "../components/Untagged.vue";

import Blog from "../components/Blog.vue";
import ArticleDetail from "../components/ArticleDetail.vue";
import Glossary from "../components/Glossary.vue";
import Bookmarks from "../components/Bookmarks.vue";
import Feedback from "../components/Feedback.vue";

const routes = [
  { path: "/search", name: "Search", component: Search },
  { path: "/browse", redirect: "/search" },
  { path: "/treemap", name: "TreemapPage", component: TreemapSplitPageRoute },
  { path: "/", name: "Landing", component: Landing },
  { path: "/about", name: "About", component: AboutWhy },
  { path: "/access", name: "Access", component: Access },
  { path: "/about_old", name: "About_old", component: About },
  { path: "/faq", name: "Faq", component: Faq },
  { path: "/help", name: "Help", component: Help },
  { path: "/resources", redirect: "/help" },
  { path: "/journals", name: "Journals", component: Journals },
  { path: "/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/untagged", name: "Untagged", component: Untagged },
  { path: "/schemaeditor", name: "SchemaEditor", component: SchemaEditor },
  { path: "/blog", name: "Blog", component: Blog },
  { path: "/blogs", redirect: "/blog" },
  {
    path: "/article/:id",
    name: "ArticleDetail",
    component: ArticleDetail,
    props: true,
  },
  { path: "/glossary", name: "Glossary", component: Glossary },
  { path: "/bookmarks", name: "Bookmarks", component: Bookmarks },
  { path: "/feedback", name: "Feedback", component: Feedback },
];

// // const router = createRouter({
// //   // history: createWebHistory("/gvd2/"),
// //   history: createWebHistory(
// //     // process.env.NODE_ENV === "production" ? "/gvd/" : "/"
// //     process.env.BASE_URL
// //   ),

// //   routes
// // });

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/gvd/" : "/"
  ),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
});

export default router;
