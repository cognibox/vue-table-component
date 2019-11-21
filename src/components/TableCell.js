export default {
  functional: true,

  props: ['column', 'row'],

  render(createElement, { props }) {
    const data = {};

    if (props.column.cellClass) {
      data.class = props.column.cellClass;
    }

    if (props.column.template) {
      return createElement('td', data, props.column.template(props.row.data));
    }
    if (props.column.component) {
      const component = props.column.component;
      component.componentOptions.propsData.row = props.row.data;
      return component;
    }

    data.domProps = {};
    data.domProps.innerHTML = props.column.formatter(props.row.getValue(props.column.show), props.row.data);

    return createElement('td', data);
  },
};
