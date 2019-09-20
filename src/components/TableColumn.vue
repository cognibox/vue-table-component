<template>
  <!-- Never render the contents -->
  <!-- The scoped slot won't have the required data -->
  <div v-if="false">
    <slot />
  </div>
</template>

<script>
import settings from '../settings';

export default {
  props: {
    show: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    dataType: {
      type: String,
      default: 'string',
    },
    sortable: {
      type: Boolean,
      default: false,
    },
    sortBy: {
      type: String,
      default: null,
    },
    formatter: {
      type: Function,
      default: () => (v) => v,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    cellClass: {
      type: String,
      default: settings.cellClass,
    },
    headerClass: {
      type: String,
      default: settings.headerClass,
    },
  },
};
</script>
