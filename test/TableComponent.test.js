import TableComponent from '@/components/TableComponent.vue';
import TableColumn from '@/components/TableColumn';

describe('TableComponent', () => {
  let data, localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.component('table-column', TableColumn);

    TableComponent.__Rewire__('expiringStorage', {
      get() { return null; },
      set() { return null; },
    });
  });

  context('when data is empty', () => {
    beforeEach(() => { data = []; });

    it('should display headers', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const headers = component.findAll('th').wrappers;
      const headerTitles = headers.map((header) => header.text());

      expect(headerTitles).to.deep.equal(['First name', 'Last name']);
    });

    it('should show a no result message', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const container = component.find('.table-component__message');
      const message = container.text();

      expect(message).to.equal('There are no matching rows');
    });

    context('with a custom message', () => {
      it('should show a custom no result message', async() => {
        const customMessage = `my custom message ${Math.random()}`;
        const component = initMockComponent({ propsData: { filterNoResults: customMessage } });
        await component.vm.$nextTick();

        const container = component.find('.table-component__message');
        const message = container.text();

        expect(message).to.equal(customMessage);
      });
    });
  });

  context('when data is not empty', () => {
    beforeEach(() => {
      data = [
        { firstName: 'mew', lastName: 'pew' },
        { firstName: 'maw', lastName: 'paw' },
      ];
    });

    it('should display headers', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const headers = component.findAll('th').wrappers;
      const headerTitles = headers.map((header) => header.text());

      expect(headerTitles).to.deep.equal(['First name', 'Last name']);
    });

    it('should display content', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const trWrappers = component.findAll('tbody tr').wrappers;
      const mappedRows = trWrappers.map((tr) => {
        const tdWrappers = tr.findAll('td').wrappers;
        return tdWrappers.map((element) => element.text());
      });

      const expectedValues = data.map((item) => Object.values(item));
      expect(mappedRows).to.deep.equal(expectedValues);
    });

    context('when lastName is hidden', () => {
      let component;

      beforeEach(async() => {
        component = initMockComponent({ lastNameHidden: true });
        await component.vm.$nextTick();
      });

      it('should not display lastName header', () => {
        const headers = component.findAll('th').wrappers;
        const headerTitles = headers.map((header) => header.text());

        expect(headerTitles).to.deep.equal(['First name']);
      });

      it('should not display lastName content', () => {
        const trWrappers = component.findAll('tbody tr').wrappers;
        const mappedRows = trWrappers.map((tr) => {
          const tdWrappers = tr.findAll('td').wrappers;
          return tdWrappers.map((element) => element.text());
        });

        const expectedValues = data.map((item) => {
          delete item.lastName;
          return Object.values(item);
        });
        expect(mappedRows).to.deep.equal(expectedValues);
      });
    });
  });

  describe('sort', () => {
    let component;

    beforeEach(() => {
      data = [
        { firstName: 'b', lastName: 'c' },
        { firstName: 'a', lastName: 'a' },
        { firstName: 'c', lastName: 'b' },
      ];
    });

    context('when column is sortable', () => {
      beforeEach(async() => {
        component = initMockComponent({ firstNameSortable: true });
        await component.vm.$nextTick();
      });

      it('should display sort-arrows in column header', () => {
        const header = component.find('th');
        expect(header.classes()).to.contain('table-component__th--sort');
      });

      context('when clicking on header', () => {
        beforeEach(() => {
          component.find('thead tr th').trigger('click');
        });

        it('should change the class to sort-asc', () => {
          const header = component.find('th');
          expect(header.classes()).to.contain('table-component__th--sort-asc');
        });

        context('when clicking again on header', () => {
          beforeEach(() => {
            component.find('thead tr th').trigger('click');
          });

          it('should change the class to sort-desc', () => {
            const header = component.find('th');
            expect(header.classes()).to.contain('table-component__th--sort-desc');
          });
        });
      });
    });

    context('when column is not sortable', () => {
      beforeEach(async() => {
        component = initMockComponent({ firstNameSortable: false });
        await component.vm.$nextTick();
      });

      it('should not display sort-arrows in column header', () => {
        const header = component.find('th');
        expect(header.classes()).to.not.contain('table-component__th--sort');
      });

      context('when clicking on header', () => {
        beforeEach(() => {
          component.find('thead tr th').trigger('click');
        });

        it('should not change the class to sort-asc', () => {
          const header = component.find('th');
          expect(header.classes()).to.not.contain('table-component__th--sort-asc');
        });

        it('should not sort', () => {
          const trWrappers = component.findAll('tbody tr').wrappers;
          const mappedRows = trWrappers.map((tr) => {
            const tdWrappers = tr.findAll('td').wrappers;
            return tdWrappers.map((element) => element.text());
          });

          expect(mappedRows).to.deep.equal([
            ['b', 'c'],
            ['a', 'a'],
            ['c', 'b'],
          ]);
        });
      });
    });
  });

  function initMockComponent({ firstNameSortable = false, lastNameHidden = false, propsData = {} } = {}) {
    const defaultSlot = `
      <table-column show="firstName" label="First name" :sortable="${firstNameSortable}"></table-column>
      <table-column show="lastName" label="Last name" :hidden="${lastNameHidden}"></table-column>
    `;

    return mockTableComponent({
      ...propsData,
      data: data,
    }, {
      slots: {
        default: defaultSlot,
      },
    });
  }

  function mockTableComponent(propsData, options) {
    const defaultProps = {};
    return mount(TableComponent, {
      localVue: localVue,
      propsData: {
        ...defaultProps,
        ...propsData,
      },
      ...options,
    });
  }
});
