<template>
  <TableComponent
    :data="[{ a: 1 }, { a: 2 }]"
    :pagination="{ perPage: 1, currentPage: 1 }"
  >
    <TableColumn show="a" />
  </TableComponent>
</template>

<script>
import TableComponent from './TableComponent.vue';
import TableColumn from './TableColumn.vue';

export default {
  components: {
    TableComponent,
    TableColumn,
  },

  data: () => ({
    columns: [],
    rows: [],
    localSettings: {},
  }),
};
</script>
