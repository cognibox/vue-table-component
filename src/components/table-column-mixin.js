export default {
  data() {
    return {
    };
  },
  props: {
    row: {
      required: false,
    },
    show: {
      type: String,
      default: 'a',
    },
    sortable: {
      type: Boolean,
      default: false,
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
