import { pick } from '../helpers';

export default class Column {
  constructor(columnComponent) {
    const properties = pick(columnComponent, [
      'show',
      'label',
      'dataType',
      'sortable',
      'sortBy',
      'hidden',
      'formatter',
      'cellClass',
      'headerClass',
    ]);

    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        this[property] = columnComponent.componentInstance[property];
      }
    }

    if (columnComponent.componentOptions.tag === 'table-column') {
      this.template = columnComponent.componentInstance.$scopedSlots.default;
    } else {
      this.component = columnComponent;
    }
  }

  isSortable() {
    return this.sortable;
  }

  getSortPredicate(sortOrder, allColumns) {
    const sortFieldName = this.getSortFieldName();

    const sortColumn = allColumns.find((column) => column.show === sortFieldName);

    const dataType = sortColumn.dataType;

    if (dataType.startsWith('date') || dataType === 'numeric') {
      return (row1, row2) => {
        const value1 = row1.getSortableValue(sortFieldName);
        const value2 = row2.getSortableValue(sortFieldName);

        if (sortOrder === 'desc') {
          return value2 < value1 ? -1 : 1;
        }

        return value1 < value2 ? -1 : 1;
      };
    }

    return (row1, row2) => {
      const value1 = row1.getSortableValue(sortFieldName);
      const value2 = row2.getSortableValue(sortFieldName);

      if (sortOrder === 'desc') {
        return value2.localeCompare(value1);
      }

      return value1.localeCompare(value2);
    };
  }

  getSortFieldName() {
    return this.sortBy || this.show;
  }
}
