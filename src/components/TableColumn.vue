<template>
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
    cellClass: {
      type: String,
      default: settings.cellClass,
    },
    headerClass: {
      type: String,
      default: settings.headerClass,
    },
    formatter: {
      type: Function,
      default: (v) => v,
    },
    label: {
      type: String,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
