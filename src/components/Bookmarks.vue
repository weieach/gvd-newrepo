<template>
  <div class="pagecomponent min-h-screen bg-bg-color flex flex-col">
    <page-header></page-header>
    
    <div id="bookmark" class="container mx-auto px-6 py-8 flex-1 pt-24 pb-32 max-w-5xl">
      <h1 class="text-3xl font-serif font-medium text-dark-bg mb-8">My Bookmarks</h1>

      <div v-if="bookmarks.length === 0" class="text-center py-16 bg-white rounded-2xl border border-border-color-light">
        <p class="text-xl text-gray-500 mb-4">You haven't bookmarked any articles yet.</p>
        <router-link to="/search" class="primary-btn inline-block bg-primary-color text-white px-6 py-2 rounded-full hover:bg-dark-bg transition-colors">
          Browse Database
        </router-link>
      </div>

      <div v-else>
        <!-- Controls -->
        <div class="bg-white p-6 rounded-2xl border border-border-color-light shadow-sm mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="flex flex-col gap-2">
              <label for="exportFormat" class="font-medium text-gray-700">Export Format</label>
              <select v-model="exportFormat" id="exportFormat" class="form-select w-full p-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary-color focus:border-primary-color outline-none">
                <option value="text">Text (Preview)</option>
                <option value="docx">Microsoft Word (.docx)</option>
                <option value="ris">RIS (EndNote, Zotero)</option>
                <option value="bibtex">BibTeX</option>
                <option value="rdf">Zotero RDF</option>
              </select>
            </div>
            
            <div class="flex flex-col gap-2" v-if="showCitationOptions">
              <label for="citationStyle" class="font-medium text-gray-700">Citation Style</label>
              <select v-model="citationStyle" id="citationStyle" class="form-select w-full p-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary-color focus:border-primary-color outline-none">
                <option value="apa">APA</option>
                <option value="mla">MLA</option>
                <option value="chicago">Chicago</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap justify-end gap-4 border-t border-border-color-light pt-6">
            <button
              v-if="showCitationOptions"
              @click="generateBibliography"
              class="px-5 py-2 text-primary-color border border-primary-color rounded-full hover:bg-primary-color/5 transition-colors font-medium"
            >
              Preview Bibliography
            </button>
            <button
              @click="exportBibliography"
              class="px-5 py-2 bg-primary-color text-white rounded-full hover:bg-dark-bg transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Export File
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="bg-white rounded-2xl border border-border-color-light shadow-sm overflow-hidden">
          <ul class="divide-y divide-border-color-light">
            <li
              v-for="bookmark in bookmarks"
              :key="bookmark.id"
              class="p-5 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4 group"
            >
              <a :href="bookmark.url" class="text-lg font-medium text-dark-bg hover:text-primary-color hover:underline leading-snug">
                {{ bookmark.title }}
              </a>
              <button
                @click="removeBookmark(bookmark)"
                class="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                title="Remove bookmark"
              >
                <i class="ph-bold ph-trash text-xl"></i>
              </button>
            </li>
          </ul>
        </div>

        <!-- Output Preview -->
        <div
          v-if="bibliographyOutput"
          class="mt-8 p-8 bg-white border border-border-color-light rounded-2xl shadow-sm prose max-w-none"
        >
          <h3 class="text-xl font-serif font-medium mb-4 text-dark-bg">Bibliography Preview</h3>
          <div v-html="bibliographyOutput" class="text-gray-700 leading-relaxed"></div>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import axios from "axios";
import Cite from "citation-js";
import PageHeader from "./PageHeader.vue";
import PageFooter from "./PageFooter.vue";
import { Document, Paragraph, Packer, TextRun } from "docx";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
      citationStyle: "apa",
      exportFormat: "text",
      bibliographyOutput: "",
    };
  },
  computed: {
    showCitationOptions() {
      return this.exportFormat === "text" || this.exportFormat === "docx";
    },
  },
  methods: {
    removeBookmark(bookmark) {
      const index = this.bookmarks.findIndex((b) => b.id === bookmark.id);
      if (index !== -1) {
        this.bookmarks.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
      }
    },
    async loadCSLFile(style) {
      const url = `/csl/${style}.csl`; // Ensure relative path works with proxy or public folder
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (err) {
        console.error("Failed to load CSL file:", err);
        return null;
      }
    },
    async generateBibliography() {
      const cslData = await this.loadCSLFile(this.citationStyle);
      if (!cslData) {
        alert(`Failed to load style: ${this.citationStyle}`);
        return;
      }
      Cite.CSL.register.addTemplate(this.citationStyle, cslData);

      const processedData = this.bookmarks.map((bookmark) => ({
        type: "article-journal",
        title: bookmark.title,
        DOI: bookmark.DOI,
        author: bookmark.creators ? bookmark.creators.map((creator) => {
          const parts = creator.split(", ");
          return { family: parts[0], given: parts[1] };
        }) : [],
        issued: { "date-parts": [[parseInt((bookmark.date || "").split("-")[0], 10)]] },
        URL: bookmark.url,
        "container-title": bookmark.journalAbbreviation,
        language: bookmark.language,
        volume: bookmark.volume,
        issue: bookmark.issue,
        page: bookmark.pages,
        abstract: bookmark.abstract,
      }));

      switch (this.exportFormat) {
        case "text":
        case "docx":
          this.bibliographyOutput = Cite(processedData).format("bibliography", {
            format: "html",
            template: this.citationStyle,
            lang: "en-US",
          });
          break;
        case "bibtex":
          this.bibliographyOutput = `<pre>${processedData
            .map((entry) => {
              return `@article{${entry.title.replace(/\s+/g, "")},
                author = {${JSON.stringify(entry.author)}},
                title = {${entry.title}},
                journal = {${entry["container-title"]}},
                volume = {${entry.volume}},
                number = {${entry.issue}},
                pages = {${entry.page}},
                year = {${entry.issued["date-parts"][0][0]}},
                doi = {${entry.DOI}},
                URL = {${entry.URL}},
                language = {${entry.language}},
                abstract = {${entry.abstract}}
              };
            `})
            .join("\n\n")}</pre>`;
          break;
        case "ris":
          this.bibliographyOutput = `<pre>${processedData
            .map((entry) => {
              return `TY  - JOUR
                AU  - ${JSON.stringify(entry.author)}
                TI  - ${entry.title}
                JO  - ${entry["container-title"]}
                VL  - ${entry.volume}
                IS  - ${entry.issue}
                SP  - ${entry.page}
                PY  - ${entry.issued["date-parts"][0][0]}
                DO  - ${entry.DOI}
                UR  - ${entry.URL}
                LA  - ${entry.language}
                AB  - ${entry.abstract}
                ER  - `;
            })
            .join("\n\n")}</pre>`;
          break;
        case "rdf":
          this.bibliographyOutput = `<pre>${Cite(processedData).format("data", {
            type: "application/rdf+xml",
          })}</pre>`;
          break;
        default:
          this.bibliographyOutput = Cite(processedData)
            .format("bibliography", {
              format: "text",
              template: this.citationStyle,
              lang: "en-US",
            })
            .split("\n")
            .join("<br><br>");
          break;
      }
    },
    async exportBibliography() {
      if (!this.bibliographyOutput) {
        await this.generateBibliography();
      }
      const format = this.exportFormat;
      if (format === "docx") {
        this.generateBibliographyDocx();
        return;
      }
      // Strip HTML for text export
      const textContent = this.bibliographyOutput.replace(/<[^>]*>/g, "");
      const blob = new Blob([textContent], { type: "text/plain" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `bookmarks_bibliography.${this.exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    },

    async generateBibliographyDocx() {
      if (!this.bibliographyOutput) {
        await this.generateBibliography();
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(this.bibliographyOutput, "text/html");
      const entries = doc.querySelectorAll(".csl-entry");

      const docx = new Document({
        sections: [
          {
            properties: {},
            children: Array.from(entries).map((entry) => {
              return new Paragraph({
                children: this.parseHTMLToDocxElements(entry),
                spacing: { after: 200 },
              });
            }),
          },
        ],
      });

      const blob = await Packer.toBlob(docx);
      saveAs(blob, `bookmarks_bibliography.docx`);
    },

    parseHTMLToDocxElements(element) {
      return Array.from(element.childNodes).flatMap((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return new TextRun(node.textContent);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const style = {};
          switch (node.tagName.toLowerCase()) {
            case "i":
            case "em":
              style.italics = true;
              break;
            case "b":
            case "strong":
              style.bold = true;
              break;
          }
          return new TextRun({
            text: node.textContent,
            ...style,
          });
        }
        return [];
      });
    },
  },

  components: {
    PageHeader,
    PageFooter,
  },
};
</script>

<style scoped>
/* Specific overrides if needed */
</style>