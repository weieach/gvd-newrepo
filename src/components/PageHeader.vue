<template>
  <nav
    class="site-nav fixed top-0 w-full z-[100] bg-bg-color border-b-[0.9px] border-[#e1d0e2]"
  >
    <div
      class="nav-inner flex items-center justify-between px-5 py-3 md:px-8 lg:px-11 lg:pt-5"
    >
      <!-- Left: logo + desktop nav links -->
      <div class="nav-left-half flex items-center gap-4 md:gap-5 lg:gap-6">
        <router-link
          to="/"
          class="website-logo hover:scale-[1.01] transition-transform duration-200 ease-in-out"
          @click="closeMobileMenu"
        >
          <img src="@/assets/gvd/nav-logo-new.png" class="w-[142px] md:w-[164px]" alt="logo-img" />
        </router-link>
        <div class="hidden lg:flex items-center gap-9 xl:gap-12">
          <router-link to="/browse" class="nav-link">Browse</router-link>
          <router-link to="/blogs" class="nav-link">Blogs</router-link>
          <router-link to="/glossary" class="nav-link">Glossary</router-link>
        </div>
      </div>

      <!-- Right: exit button (always visible) + desktop links + mobile toggle -->
      <div class="flex items-center gap-6 xl:gap-8">

        <!-- Exit Site — always visible on all screen sizes -->
        <button
          type="button"
          class="exit-btn"
          title="Leave this site immediately (or press Escape twice)"
          aria-label="Exit site quickly"
          @click="exitSite"
        >
          <i class="ph-bold ph-sign-out"></i>
          <span>Exit</span>
        </button>

        <!-- Desktop-only links -->
        <div class="hidden lg:flex items-center gap-8 xl:gap-12">
          <router-link to="/about" class="nav-link">About us</router-link>
          <router-link to="/resources" class="primary-btn">Get Help</router-link>
        </div>

        <!-- Mobile hamburger -->
        <button
          type="button"
          class="mobile-nav-toggle lg:hidden text-[1.6rem] text-[#5b2960] p-2"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
        >
          <i :class="isMobileMenuOpen ? 'ph ph-x' : 'ph ph-list'"></i>
        </button>
      </div>
    </div>

    <!-- Mobile nav panel -->
    <div v-if="isMobileMenuOpen" class="mobile-nav-panel lg:hidden" @click="closeMobileMenu">
      <div class="mobile-nav-content" @click.stop>
        <router-link to="/browse" class="mobile-link" @click="closeMobileMenu">Browse</router-link>
        <router-link to="/blogs" class="mobile-link" @click="closeMobileMenu">Blogs</router-link>
        <router-link to="/glossary" class="mobile-link" @click="closeMobileMenu">Glossary</router-link>
        <router-link to="/about" class="mobile-link" @click="closeMobileMenu">About us</router-link>
        <router-link to="/resources" class="mobile-help-btn" @click="closeMobileMenu">Get Help</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "PageHeader",
  data() {
    return {
      isMobileMenuOpen: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  watch: {
    $route() {
      this.closeMobileMenu();
    },
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    exitSite() {
      // Replace the current history entry so GVD doesn't appear in back-button history
      window.location.replace("https://weather.com");
    },
    handleKeydown(e) {
      if (e.key !== "Escape") return;
      // Don't fire if the user is typing in a form field
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      this.exitSite();
    },
  },
};
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
}

.nav-link {
  font-size: var(--type-body);
  line-height: 1.3;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  /* py-3 = 0.75 rem bottom padding on nav-inner keeps the indicator
     flush with the nav bar's bottom border */
  bottom: -1.5rem;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px 2px 0 0;
}

.primary-btn {
  color: var(--bg-color);
  background-color: var(--primary-color);
  padding: 0.625rem 1.5rem;
  border-radius: 2rem;
  font-size: var(--type-body-sm);
  line-height: 1.2;
  font-weight: 500;
  transition: background-color 0.2s ease-out;
}

.primary-btn:hover {
  background-color: var(--dark-bg);
}

/* Exit Site button — always visible */
.exit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: none;
  background-color: #c0392b;
  color: #fff;
  font-size: var(--type-body-sm);
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: background-color 0.15s ease-out;
  white-space: nowrap;
}

.exit-btn:hover {
  background-color: #a93226;
}

.exit-btn i {
  font-size: 1rem;
}

.mobile-nav-panel {
  background: rgba(0, 0, 0, 0.2);
}

.mobile-nav-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.75rem 1.25rem 1.25rem;
  background: var(--bg-color);
  border-top: 1px solid #e1d0e2;
}

.mobile-link {
  font-size: var(--type-body);
  line-height: 1.35;
  font-weight: 500;
  padding: 0.7rem 0.25rem;
}

.mobile-link:hover {
  color: var(--primary-color);
}

.mobile-help-btn {
  margin-top: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  text-align: center;
  color: var(--bg-color);
  background: var(--primary-color);
  font-size: var(--type-body-sm);
  line-height: 1.2;
  font-weight: 500;
}

.mobile-help-btn:hover {
  background: var(--dark-bg);
}
</style>
