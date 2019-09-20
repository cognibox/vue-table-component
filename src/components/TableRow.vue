<template>
  <tr @click="$emit('rowClick', row)">
    <table-cell
      v-for="column in visibleColumns"
      :key="column.id"
      :row="row"
      :column="column"
    />
  </tr>
</template>

<script>
import TableCell from './TableCell';

export default {

  components: {
    TableCell,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
  },

  computed: {
    visibleColumns() {
      return this.columns.filter((column) => !column.hidden);
    },
  },
};
</script>
