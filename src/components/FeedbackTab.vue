<template>
  <div>
    <!-- Floating contact button — sits above the back-to-top button -->
    <button
      type="button"
      class="contact-fab"
      title="Contact us or send feedback"
      aria-label="Contact us"
      @click="openModal"
    >
      <i class="ph-fill ph-chat-circle-dots"></i>
    </button>

    <!-- Contact / Feedback Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-[1055] overflow-y-auto overflow-x-hidden outline-none flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      @click.self="closeModal"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity z-[-1]"
        @click="closeModal"
      ></div>

      <div class="relative w-full max-w-3xl pointer-events-none">
        <div
          class="relative flex flex-col w-full pointer-events-auto bg-white rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden max-h-[90vh]"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 rounded-t-xl bg-white border-b border-gray-100"
          >
            <h5
              class="text-2xl font-serif font-medium text-dark-bg"
              id="modal-title"
            >
              {{ currentView === "selection" ? "Contact Us" : "Contact" }}
            </h5>
            <button
              type="button"
              class="text-gray-400 hover:text-primary-color transition-colors bg-transparent border-0 text-2xl leading-none outline-none focus:outline-none p-2 rounded-full hover:bg-gray-50"
              @click="closeModal"
            >
              <i class="ph ph-x"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="relative p-6 flex-auto max-h-[80vh] overflow-y-auto">
            <!-- Selection View -->
            <div v-if="currentView === 'selection'" class="flex flex-col gap-6">
              <p class="text-gray-600 text-center text-lg">
                How can we help? Choose an option below and we'll take it from
                there.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  @click="selectFeedbackOption('Website feedback')"
                  class="flex flex-col items-center justify-center gap-4 p-8 bg-[#F5F1F5] hover:bg-[#F0EAF0] rounded-[1.2rem] transition-colors border-0 group h-[165px]"
                >
                  <i
                    class="ph-fill ph-gear text-3xl text-[#883F8F] group-hover:scale-110 transition-transform"
                  ></i>
                  <span class="font-medium text-base text-[#883F8F]"
                    >Website feedback</span
                  >
                </button>

                <button
                  @click="selectFeedbackOption('General inquiries')"
                  class="flex flex-col items-center justify-center gap-4 p-8 bg-[#F5F1F5] hover:bg-[#F0EAF0] rounded-[1.2rem] transition-colors border-0 group h-[165px]"
                >
                  <i
                    class="ph ph-envelope-simple text-3xl text-[#883F8F] group-hover:scale-110 transition-transform"
                  ></i>
                  <span class="font-medium text-base text-[#883F8F]"
                    >General inquiries</span
                  >
                </button>
              </div>
            </div>

            <!-- Form View -->
            <div v-else>
              <div
                v-if="submissionSuccess"
                class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              >
                Your feedback has been submitted successfully!
              </div>
              <div v-else>
                <button
                  @click="currentView = 'selection'"
                  class="text-[#5a366b] hover:underline mb-4 flex items-center gap-1 text-sm font-medium"
                >
                  <i class="ph ph-arrow-left"></i> Back
                </button>

                <div
                  v-if="submissionError"
                  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                >
                  {{ submissionError }}
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div>
                    <label
                      for="feedbackName"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Name</label
                    >
                    <input
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow"
                      id="feedbackName"
                      v-model="formData.name"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="feedbackEmail"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Email</label
                    >
                    <input
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow"
                      id="feedbackEmail"
                      v-model="formData.email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div v-if="feedbackCategory === 'website'">
                    <label
                      for="feedbackType"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >I would like to...</label
                    >
                    <select
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow bg-white"
                      id="feedbackType"
                      v-model="formData.feedbackType"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Report an issue">Report an issue</option>
                      <option value="Suggest a feature">
                        Suggest a feature
                      </option>
                      <option value="Submit feedback on search results">
                        Submit feedback on search results
                      </option>
                      <option value="Report incorrect information">
                        Report incorrect information
                      </option>
                      <option value="Suggest new content">
                        Suggest new content
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div
                    v-if="
                      formData.feedbackType === 'Report incorrect information'
                    "
                  >
                    <label
                      for="pageUrl"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Page URL</label
                    >
                    <input
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      id="pageUrl"
                      v-model="formData.pageUrl"
                      readonly
                    />
                  </div>

                  <div
                    v-if="
                      formData.feedbackType === 'Report incorrect information'
                    "
                  >
                    <label
                      for="incorrectInfo"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Incorrect Information</label
                    >
                    <textarea
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow"
                      id="incorrectInfo"
                      v-model="formData.incorrectInfo"
                      rows="3"
                      placeholder="Describe what information is incorrect"
                      required
                    ></textarea>
                  </div>

                  <div
                    v-if="
                      formData.feedbackType === 'Report incorrect information'
                    "
                  >
                    <label
                      for="correctInfo"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Correct Information</label
                    >
                    <textarea
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow"
                      id="correctInfo"
                      v-model="formData.correctInfo"
                      rows="3"
                      placeholder="Provide the correct information"
                      required
                    ></textarea>
                  </div>

                  <div
                    v-if="
                      formData.feedbackType === 'Report incorrect information'
                    "
                  >
                    <label
                      for="source"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Source</label
                    >
                    <input
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow"
                      id="source"
                      v-model="formData.source"
                      placeholder="Provide a source for the correct information"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="details"
                      class="block mb-1 font-medium text-[#5a366b]"
                      >Details</label
                    >
                    <textarea
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a366b] focus:border-transparent transition-shadow"
                      id="details"
                      v-model="formData.details"
                      rows="4"
                      placeholder="Please provide additional details"
                      required
                    ></textarea>
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="h-4 w-4 text-[#5a366b] border-gray-300 rounded focus:ring-[#5a366b] cursor-pointer"
                      id="acknowledge"
                      v-model="formData.acknowledge"
                    />
                    <label
                      class="text-sm text-gray-700 cursor-pointer"
                      for="acknowledge"
                    >
                      I would like to be acknowledged for my contribution
                    </label>
                  </div>

                  <div>
                    <small class="text-gray-500 block">
                      This form helps improve the Gender Violence Database. Your
                      feedback is valuable to us.
                    </small>
                  </div>

                  <!-- Cloudflare Turnstile -->
                  <div>
                    <div
                      id="turnstile-container-modal"
                      class="turnstile-container flex justify-center py-2"
                    ></div>
                    <div
                      v-if="turnstileError"
                      class="text-red-500 text-xs mt-1 flex items-center justify-center"
                    >
                      <i class="ph ph-warning me-1"></i>
                      Security verification failed. Please try again.
                    </div>
                  </div>

                  <div class="flex gap-3 pt-2">
                    <button
                      type="submit"
                      class="px-6 py-2.5 bg-[#5a366b] text-white rounded-lg hover:bg-[#4a2c58] transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                      :disabled="isSubmitting || !turnstileToken"
                    >
                      <span
                        v-if="isSubmitting"
                        class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      ></span>
                      {{ isSubmitting ? "Submitting..." : "Submit" }}
                    </button>
                    <button
                      type="button"
                      class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      @click="closeModal"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useTurnstile } from "@/composables/useTurnstile";

export default {
  name: "FeedbackTab",
  setup() {
    const store = useStore();
    const showModal = computed(() => store.state.feedbackModalOpen);
    const currentView = ref("selection");
    const feedbackCategory = ref("");
    const submissionSuccess = ref(false);
    const submissionError = ref(null);
    const isSubmitting = ref(false);

    const TURNSTILE_SITE_KEY =
      process.env.VUE_APP_TURNSTILE_SITE_KEY || "0x4AAAAAAA7dBaO7lqrUu9Rc";
    const {
      turnstileToken,
      isLoading: turnstileLoading,
      error: turnstileError,
      initTurnstile,
      resetTurnstile,
    } = useTurnstile(TURNSTILE_SITE_KEY);

    const formData = reactive({
      name: "",
      email: "",
      feedbackType: "",
      details: "",
      incorrectInfo: "",
      correctInfo: "",
      source: "",
      pageUrl: "",
      acknowledge: false,
    });

    const resetForm = () => {
      formData.name = "";
      formData.email = "";
      formData.feedbackType = "";
      formData.details = "";
      formData.incorrectInfo = "";
      formData.correctInfo = "";
      formData.source = "";
      formData.pageUrl = window.location.href;
      formData.acknowledge = false;
      resetTurnstile();
    };

    const openModal = () => {
      store.dispatch("openFeedbackModal");
      currentView.value = "selection";
      feedbackCategory.value = "";
    };

    const closeModal = () => {
      store.dispatch("closeFeedbackModal");
      submissionSuccess.value = false;
      submissionError.value = null;
      resetForm();
      currentView.value = "selection";
      feedbackCategory.value = "";
    };

    const selectFeedbackOption = (option) => {
      if (option === "Website feedback") {
        feedbackCategory.value = "website";
        formData.feedbackType = "";
      } else if (option === "General inquiries") {
        feedbackCategory.value = "general";
        formData.feedbackType = "General inquiry";
      }
      currentView.value = "form";
    };

    const handleSubmit = async () => {
      if (!turnstileToken.value) {
        submissionError.value = "Please complete the security verification.";
        return;
      }

      isSubmitting.value = true;
      submissionError.value = null;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        submissionSuccess.value = true;
        setTimeout(() => {
          closeModal();
        }, 2000);
      } catch (error) {
        submissionError.value = "Failed to send feedback. Please try again.";
        resetTurnstile();
      } finally {
        isSubmitting.value = false;
      }
    };

    watch([showModal, currentView], async ([newShow, newView]) => {
      if (newShow && newView === "form") {
        setTimeout(() => {
          initTurnstile("turnstile-container-modal");
        }, 300);
      }
    });

    onMounted(() => {
      formData.pageUrl = window.location.href;
    });

    return {
      showModal, // computed from store
      currentView,
      feedbackCategory,
      submissionSuccess,
      submissionError,
      isSubmitting,
      formData,
      openModal,
      closeModal,
      selectFeedbackOption,
      handleSubmit,
      turnstileToken,
      turnstileLoading,
      turnstileError,
    };
  },
};
</script>

<style scoped>
/* Floating contact button — bottom-right, above the back-to-top button */
.contact-fab {
  position: fixed;
  right: 1.15rem;
  bottom: 4.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgba(189, 167, 191, 0.85);
  background: rgba(250, 248, 250, 0.95);
  color: var(--primary-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 120;
  box-shadow: 0 6px 18px rgba(20, 30, 60, 0.12);
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
}

.contact-fab:hover {
  background: #fff;
  color: var(--dark-bg);
}

.turnstile-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

@media (prefers-reduced-motion: reduce) {
  .contact-fab {
    transition: none;
  }
}
</style>
