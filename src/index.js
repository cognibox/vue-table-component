import TableColumn from './components/TableColumn';
import TableComponent from './components/TableComponent';
import Pagination from './components/Pagination';
import tableColumnMixin from './components/table-column-mixin';

import Vue from 'vue';
import TableExample from './components/TableExample';

if (process.env.NODE_ENV !== 'production') {
  new Vue({
    render: (h) => h(TableExample),
  }).$mount('#app');
}

export { TableComponent, TableColumn, Pagination, tableColumnMixin };
