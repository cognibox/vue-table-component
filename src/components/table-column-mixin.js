export default {
  data() {
    return {
      show: '',
      sortable: false,
    };
  },
  props: {
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
  mounted() {
    const tableColumn = this.$children[0];
    this.show = tableColumn.show;
    this.sortable = tableColumn.sortable;
  },
};
