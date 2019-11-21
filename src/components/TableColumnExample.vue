<template>
  <td v-if="row">
    row {{ row.b }}
  </td>
</template>

<script>
import tableColumnMixin from './table-column-mixin';

export default {
  mixins: [tableColumnMixin],
};
</script>
