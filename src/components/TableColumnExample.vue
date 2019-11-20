<template>
  <TableColumn
    show="b"
    :sortable="true"
  />
</template>

<script>
import TableColumn from './TableColumn.vue';
import tableColumnMixin from './table-column-mixin';

export default {
  components: {
    TableColumn,
  },
  mixins: [tableColumnMixin],
};
</script>
