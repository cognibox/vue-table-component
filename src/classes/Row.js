import { get } from '../helpers';

export default class Row {
  constructor(data, columns, index) {
    this.data = data;
    this.columns = columns;
    this.index = index;
  }

  getValue(columnName) {
    return get(this.data, columnName);
  }

  getColumn(columnName) {
    return this.columns.find((column) => column.show === columnName);
  }

  getSortableValue(columnName) {
    const dataType = this.getColumn(columnName).dataType;

    let value = this.getValue(columnName);

    if (value === undefined || value === null) {
      return '';
    }

    if (value instanceof String) {
      value = value.toLowerCase();
    }

    if (dataType === 'numeric') {
      return value;
    }

    return value.toString();
  }
}
