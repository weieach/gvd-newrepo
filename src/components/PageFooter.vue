<template>
  <footer class="bg-dark-bg text-white p-6 md:p-12 flex flex-col gap-8 md:gap-11">
    <div class="div-logo-copyright flex flex-col sm:flex-row sm:justify-between gap-5">
      <div>
        <a href="https://hdw.wustl.edu" target="_blank" rel="noopener">
          <img
            src="@/assets/gvd/humanities_workshop.png"
            class="h-6 mb-2"
            alt="humanities digital workshop logo"
          />
        </a>
        <p class="text-white text-sm">
          ©2026 Washington University in St. Louis
        </p>
      </div>
      <a href="https://washu.edu" target="_blank" rel="noopener">
        <img
          src="@/assets/gvd/washu_logo.png"
          class="h-[2.2rem]"
          alt="washu logo"
        />
      </a>
    </div>

    <div class="footer-menu flex flex-col lg:flex-row justify-between gap-8 lg:gap-16">
      <ul class="footer-nav flex-1 p-0 m-0">
        <li class="border-b border-[#825B84] first:pt-0">
          <router-link
            to="/browse"
            class="footer-nav-link"
            >Browse database <i class="ph-bold ph-arrow-right text-lg"></i></router-link
          >
        </li>
        <li class="border-b border-[#825B84]">
          <router-link
            to="/blogs"
            class="footer-nav-link"
            >Read blogs <i class="ph-bold ph-arrow-right text-lg"></i></router-link
          >
        </li>
        <li class="border-b border-[#825B84]">
          <router-link
            to="/glossary"
            class="footer-nav-link"
            >View glossary <i class="ph-bold ph-arrow-right text-lg"></i></router-link
          >
        </li>
        <li class="border-b border-[#825B84]">
          <router-link
            to="/about"
            class="footer-nav-link"
            >About GVD <i class="ph-bold ph-arrow-right text-lg"></i></router-link
          >
        </li>
      </ul>

      <div class="footer-contact flex flex-col gap-5 min-w-[200px]">
        <div class="contact-email">
          <p class="contact-header flex items-center gap-1.5 mb-1.5 text-white">
            <i class="ph ph-envelope-simple text-lg"></i>Email
          </p>
          <button
            type="button"
            class="text-white hover:underline text-left p-0 border-0 bg-transparent cursor-pointer"
            @click="$store.dispatch('openFeedbackModal')"
          >
            genderviolencedatabase@gmail.com
          </button>
        </div>
        <div class="contact-address">
          <p class="contact-header flex items-center gap-1.5 mb-1.5 text-white">
            <i class="ph ph-house text-lg"></i>Address
          </p>
          <address class="text-white not-italic">
            Washington University in St. Louis<br />
            Arts &amp; Sciences <br />
            St. Louis, MO
          </address>
        </div>
      </div>

      <div class="help-tip bg-[#6D3172] border border-primary-color rounded-[20px] px-5 md:px-7 py-5 flex items-center gap-4 h-fit w-full lg:w-[40%] max-w-[440px]">
        <div class="card-text">
          <h3 class="text-white text-lg mb-1.5 font-normal">
            Need Immediate Help?
          </h3>
          <p class="text-white text-sm">
            Check our
            <router-link to="/about" class="underline"
              >About section</router-link
            >
            or
            <router-link to="/resources" class="underline"
              >Resources page</router-link
            >
            for quick answers to common questions.
          </p>
        </div>
        <i class="ph-bold ph-arrow-right text-2xl text-white"></i>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "PageFooter",
};
</script>

<style scoped>
.footer-nav-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  color: white;
  font-family: "larken", serif;
  font-size: 1.125rem;
  text-decoration: none;
  width: 100%;
}

.footer-nav-link:hover {
  text-decoration: underline;
}
</style>
