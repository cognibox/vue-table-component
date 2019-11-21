<template>
  <TableComponent
    :data="[{ a: 1, b: '1' }, { a: 2, b: 2 }]"
    :pagination="{ perPage: 1, currentPage: 1 }"
  >
    <table-column
      show="a"
      :sortable="true"
    >
      <template slot-scope="row">
        <div>
          {{ row.a }}
        </div>
      </template>
    </table-column>
    <table-column-example show="b" />
  </TableComponent>
</template>

<script>
import TableComponent from './TableComponent.vue';
import TableColumn from './TableColumn.vue';
import TableColumnExample from './TableColumnExample.vue';

export default {
  components: {
    TableComponent,
    TableColumn,
    TableColumnExample,
  },
};
</script>
