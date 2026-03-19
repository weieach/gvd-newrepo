<template>
  <div class="pagecomponent">
    <page-header></page-header>
    <div class="container-fluid mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">
          <div class="feedback-page">
            <h1 class="page-title">Contact Us & Feedback</h1>
            <p class="page-description">
              We value your feedback and are committed to improving the Gender
              Violence Database. Please use the form below to share your
              thoughts, report issues, or suggest improvements.
            </p>

            <div v-if="submissionSuccess" class="alert alert-success">
              <i class="bi bi-check-circle-fill me-2"></i>
              Thank you for your feedback! We have received your message and
              will respond as soon as possible.
            </div>

            <div v-else>
              <div v-if="submissionError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ submissionError }}
              </div>

              <form @submit.prevent="handleSubmit" class="feedback-form">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Name *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="formData.name"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="formData.email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="subject" class="form-label">Subject *</label>
                  <select
                    class="form-select"
                    id="subject"
                    v-model="formData.subject"
                    required
                  >
                    <option value="">Please select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <!-- <option value="Data Correction">Data Correction</option> -->
                    <option value="Feature Request">Feature Request</option>
                    <option value="Research Collaboration">
                      Research Collaboration
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="organization" class="form-label"
                    >Organization/Institution</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="organization"
                    v-model="formData.organization"
                    placeholder="Your organization or institution (optional)"
                  />
                </div>

                <!-- Conditional fields for specific subjects -->
                <!-- <div
                  v-if="formData.subject === 'Data Correction'"
                  class="correction-fields"
                >
                  <div class="mb-3">
                    <label for="pageUrl" class="form-label">Page URL</label>
                    <input
                      type="url"
                      class="form-control"
                      id="pageUrl"
                      v-model="formData.pageUrl"
                      placeholder="URL of the page with incorrect information"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="incorrectInfo" class="form-label"
                      >Incorrect Information</label
                    >
                    <textarea
                      class="form-control"
                      id="incorrectInfo"
                      v-model="formData.incorrectInfo"
                      rows="3"
                      placeholder="Describe what information is incorrect"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="correctInfo" class="form-label"
                      >Correct Information</label
                    >
                    <textarea
                      class="form-control"
                      id="correctInfo"
                      v-model="formData.correctInfo"
                      rows="3"
                      placeholder="Provide the correct information"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="source" class="form-label">Source</label>
                    <input
                      type="text"
                      class="form-control"
                      id="source"
                      v-model="formData.source"
                      placeholder="Provide a source for the correct information"
                    />
                  </div>
                </div> -->

                <div class="mb-3">
                  <label for="message" class="form-label">Message *</label>
                  <textarea
                    class="form-control"
                    id="message"
                    v-model="formData.message"
                    rows="6"
                    placeholder="Please provide detailed information about your inquiry, feedback, or request..."
                    required
                  ></textarea>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="acknowledge"
                    v-model="formData.acknowledge"
                  />
                  <label class="form-check-label" for="acknowledge">
                    I would like to be acknowledged for my contribution (if
                    applicable)
                  </label>
                </div>

                <div class="mb-3 form-check">
                  <!-- <input
                    type="checkbox"
                    class="form-check-input"
                    id="updates"
                    v-model="formData.updates"
                  />
                  <label class="form-check-label" for="updates">
                    I would like to receive updates about the Gender Violence
                    Database
                  </label> -->
                </div>

                <!-- Cloudflare Turnstile -->
                <div class="mb-3">
                  <div
                    id="turnstile-container-page"
                    class="turnstile-container"
                  ></div>
                  <div v-if="turnstileError" class="text-danger small mt-1">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Security verification failed. Please try again.
                  </div>
                </div>

                <div class="submission-section">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    :disabled="isSubmitting || !turnstileToken"
                  >
                    <span
                      v-if="isSubmitting"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ isSubmitting ? "Sending..." : "Send Message" }}
                  </button>
                  <p class="submission-note"></p>
                </div>
              </form>
            </div>

            <!-- Contact Information -->
            <div class="contact-info mt-5">
              <h3>Other Ways to Reach Us</h3>
              <div class="d-flex justify-content-between align-items-start">
                <div class="contact-item">
                  <i class="bi bi-envelope-fill"></i>
                  <div>
                    <strong>Email</strong>
                    <p>
                      <a href="mailto:genderviolencedatabase@gmail.com"
                        >genderviolencedatabase@gmail.com</a
                      >
                    </p>
                  </div>
                </div>
                <div class="contact-item">
                  <i class="bi bi-geo-alt-fill"></i>
                  <div>
                    <strong>Address</strong>
                    <p>
                      Washington University in St. Louis<br />
                      Arts & Sciences<br />
                      St. Louis, MO
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- FAQ Link -->
            <div class="help-section mt-4">
              <div class="help-card">
                <h4>Need Immediate Help?</h4>
                <p>
                  Check our
                  <router-link to="/about" class="help-link"
                    >About section</router-link
                  >
                  or
                  <router-link to="/help" class="help-link"
                    >Resources page</router-link
                  >
                  for quick answers to common questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import { useTurnstile } from "@/composables/useTurnstile";

export default {
  name: "Feedback",
  components: {
    PageHeader,
  },
  setup() {
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
      subject: "",
      organization: "",
      message: "",
      pageUrl: "",
      incorrectInfo: "",
      correctInfo: "",
      source: "",
      acknowledge: false,
      updates: false,
    });

    const resetForm = () => {
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === "boolean") {
          formData[key] = false;
        } else {
          formData[key] = "";
        }
      });
      resetTurnstile();
    };

    const handleSubmit = async () => {
      if (!turnstileToken.value) {
        submissionError.value = "Please complete the security verification.";
        return;
      }

      isSubmitting.value = true;
      submissionError.value = null;

      try {
        const submitData = {
          ...formData,
          turnstileToken: turnstileToken.value,
        };

        await new Promise((resolve) => setTimeout(resolve, 1500));

        submissionSuccess.value = true;
        resetForm();

        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } catch (error) {
        submissionError.value =
          "Failed to send your message. Please try again or contact us directly at email@email.com";
        resetTurnstile();
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      formData.pageUrl = window.location.href;

      setTimeout(() => {
        initTurnstile("turnstile-container-page");
      }, 100);
    });

    return {
      submissionSuccess,
      submissionError,
      isSubmitting,
      formData,
      handleSubmit,
      turnstileToken,
      turnstileLoading,
      turnstileError,
    };
  },
};
</script>

<style scoped>
.pagecomponent {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.feedback-page {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.page-title {
  color: #5a366b;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-align: center;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-8);
  line-height: var(--line-height-relaxed);
}

.feedback-form {
  margin-top: 2rem;
}

.form-label {
  font-weight: 600;
  color: #5a366b;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-3);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.form-control:focus,
.form-select:focus {
  border-color: #7d4a8a;
  box-shadow: 0 0 0 0.2rem rgba(90, 54, 107, 0.25);
  outline: none;
}

.correction-fields {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #5a366b;
}

.form-check-input {
  border: 2px solid #dee2e6;
  border-radius: 4px;
}

.form-check-input:checked {
  background-color: #5a366b;
  border-color: #5a366b;
}

.form-check-label {
  color: #495057;
  margin-left: 0.5rem;
}

.submission-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn-primary {
  background: #5a366b;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(90, 54, 107, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #7d4a8a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(90, 54, 107, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: 0 4px 12px rgba(90, 54, 107, 0.3);
}

.submission-note {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.contact-info {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
}

.contact-info h3 {
  color: #5a366b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.contact-item i {
  color: #5a366b;
  font-size: 1.5rem;
  margin-right: 1rem;
  margin-top: 0.25rem;
}

.contact-item strong {
  color: #5a366b;
  display: block;
  margin-bottom: 0.25rem;
}

.contact-item p {
  margin: 0;
  color: #6c757d;
}

.contact-item a {
  color: #5a366b;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.help-section {
  margin-top: 2rem;
}

.help-card {
  background: #5a366b;
  color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.help-card h4 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.help-card p {
  margin: 0;
  font-size: 1.1rem;
}

.help-link {
  color: #ffc107;
  text-decoration: none;
  font-weight: 600;
}

.help-link:hover {
  color: #ffeb3b;
  text-decoration: underline;
}

.alert {
  border-radius: 8px;
  border: none;
  font-size: 1rem;
}

.alert-success {
  background-color: #d1edcc;
  color: #0a5f0a;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.turnstile-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .feedback-page {
    padding: 1.5rem;
    margin: 1rem;
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .contact-info {
    padding: 1.5rem;
  }

  .contact-info .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .contact-item {
    justify-content: flex-start;
  }
}
</style>
