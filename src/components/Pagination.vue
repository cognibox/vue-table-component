<template>
  <div v-if="shouldShowPagination" class="pager">
    <ul class="pagination justify-content-center">
      <li>
        <a :class="{ disabled: gotoPreviousDisabled }"
           @click="gotoPreviousPage()">
          <i class="fa fa-angle-left"></i>
        </a>
      </li>

      <template v-for="(page, index) in pages">
        <li
          :key="`page${index}`"
          v-if="page.type === 'page'"
          class="page-item"
          :class="{ active: page.active }"
        >
          <a class="page-link" @click="gotoPage(page)" :class="{ disabled: !page.enabled }">{{ page.number }}</a>
        </li>

        <li :key="`ellipsis${index}`" v-if="page.type === 'more'">
          <span class="pagination-ellipsis" @click="ellipsisClick($event)">&hellip;</span>
        </li>
      </template>

      <li :class="{ disabled: gotoNextDisabled }">
        <a :class="{ disabled: gotoNextDisabled }"
           @click="gotoNextPage()">
          <i class="fa fa-angle-right"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

const maxPageBlocks = 9;

export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    count: {
      type: Number,
      required: true,
    },
  },

  computed: {
    totalPages() {
      return this.count ? Math.ceil(this.count / this.perPage) : 0;
    },

    pages() {
      return this.totalPages === 0 ? [] : this.pageLinks();
    },

    shouldShowPagination() {
      return this.totalPages > 1;
    },

    gotoNextDisabled() {
      return this.currentPage === this.totalPages;
    },

    gotoPreviousDisabled() {
      return this.currentPage === 1;
    },
  },

  methods: {
    isActive(page) {
      return page.active;
    },

    ellipsisClick(event) {
      this.$emit('ellipsisClick', event);
    },

    gotoNextPage() {
      if (this.gotoNextDisabled) return;

      this.$emit('pageChange', this.currentPage + 1);
    },

    gotoPage(page) {
      if (page.type !== 'page' || !page.enabled) return;

      this.$emit('pageChange', page.number);
    },

    gotoPreviousPage() {
      if (this.gotoPreviousDisabled) return;

      this.$emit('pageChange', this.currentPage - 1);
    },

    pageLinks() {
      const pages = [];

      pages.push(this.renderPage({ pageNumber: 1 }));

      const totalShownPages = Math.min(this.totalPages, maxPageBlocks);
      for (let pageBlock = 2; pageBlock < totalShownPages; pageBlock++) {
        pages.push(this.renderPageBlock({ pageBlock: pageBlock }));
      }

      pages.push(this.renderPage({ pageNumber: this.totalPages }));

      return pages;
    },

    renderEllipsis() {
      return {
        type: 'more',
        enabled: true,
      };
    },

    renderPageBlock({ pageBlock }) {
      const hasEllipsisBlocks = this.totalPages > maxPageBlocks;

      if (hasEllipsisBlocks) {
        return this.renderPageWithEllipsisBlocks({ pageBlock });
      }

      return this.renderPage({ pageNumber: pageBlock });
    },

    renderPage({ pageNumber }) {
      const isCurrent = pageNumber === this.currentPage;

      return {
        type: 'page',
        number: pageNumber,
        enabled: !isCurrent,
        active: isCurrent,
      };
    },

    renderPageWithEllipsisBlocks({ pageBlock }) {
      const maxPagesBetweenEllipsisBlocks = 5;

      const firstPossibleEllipsisIndex = 2;
      const lastPossibleEllipsisIndex = maxPageBlocks - 1;

      const middleIndexElement = Math.ceil(maxPageBlocks / 2); // eslint-disable-line no-magic-numbers
      const firstEllipsisBlockShowed = this.currentPage > middleIndexElement;
      const lastEllipsisBlockShowed = this.currentPage < (this.totalPages - middleIndexElement);

      if (pageBlock === firstPossibleEllipsisIndex) {
        if (firstEllipsisBlockShowed) {
          return this.renderEllipsis();
        }

        return this.renderPage({ pageNumber: pageBlock });
      } else if (pageBlock === lastPossibleEllipsisIndex) {
        if (lastEllipsisBlockShowed) {
          return this.renderEllipsis();
        }

        return this.renderPage({ pageNumber: this.totalPages - 1 });
      }

      if (firstEllipsisBlockShowed) {
        if (lastEllipsisBlockShowed) {
          return this.renderPage({ pageNumber: pageBlock + this.currentPage - maxPagesBetweenEllipsisBlocks });
        }

        return this.renderPage({ pageNumber: this.totalPages - maxPageBlocks + pageBlock });
      }

      return this.renderPage({ pageNumber: pageBlock });
    },
  },
};
</script>
