import TableColumn from './components/TableColumn';
import TableComponent from './components/TableComponent';
import Pagination from './components/Pagination';
import { mergeSettings } from './settings';

import Vue from 'vue';
import TableExample from './components/TableExample';

if (process.env.NODE_ENV !== 'production') {
  new Vue({
    render: (h) => h(TableExample),
  }).$mount('#app');
}

export default {
  install(Vue, options = {}) {
    mergeSettings(options);

    Vue.component('table-component', TableComponent);
    Vue.component('table-column', TableColumn);
    Vue.component('pagination', Pagination);
  },

  settings(settings) {
    mergeSettings(settings);
  },
};

export { TableComponent, TableColumn, Pagination };
