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

    it('should add the "even" class on even rows and the "odd" class on odd rows', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const trWrappers = component.findAll('tbody tr');

      expect(trWrappers.at(0).classes('even')).to.be.true;
      expect(trWrappers.at(0).classes('odd')).to.be.false;
      expect(trWrappers.at(1).classes('even')).to.be.false;
      expect(trWrappers.at(1).classes('odd')).to.be.true;
    });

    context('when giving a before-header slot', () => {
      let component;

      beforeEach(async() => {
        component = initMockComponent({
          scopedSlots: {
            'before-header': `
              <div id="before-header" slot-scope="{ columns }">
                {{ columns.length }}
              </div>
            `,
          },
        });

        await component.vm.$nextTick();
      });

      it('should display it', () => {
        expect(component.contains('#before-header')).to.be.true;
      });

      it('should have access to the columns', () => {
        const content = component.find('#before-header').text();

        const numberOfColumns = 2;
        expect(content).to.equal(numberOfColumns.toString());
      });
    });

    context('when giving a after-header slot', () => {
      let component;

      beforeEach(async() => {
        component = initMockComponent({
          scopedSlots: {
            'after-header': `
              <div id="after-header" slot-scope="{ columns }">
                {{ columns.length }}
              </div>
            `,
          },
        });

        await component.vm.$nextTick();
      });

      it('should display it', () => {
        expect(component.contains('#after-header')).to.be.true;
      });

      it('should have access to the columns', () => {
        const content = component.find('#after-header').text();

        const numberOfColumns = 2;
        expect(content).to.equal(numberOfColumns.toString());
      });
    });

    context('when giving an after-row slot', () => {
      let component;

      beforeEach(async() => {
        component = initMockComponent({
          scopedSlots: {
            'after-row': `
              <div class="after-row" slot-scope="{ index, row, columns }">
                <span class="after-row-index">
                  {{ index }}
                </span>
                <span class="after-row-first-name">
                  {{ row.firstName }}
                </span>
                <span class="after-row-column-length">
                  {{ columns.length }}
                </span>
              </div>
            `,
          },
        });

        await component.vm.$nextTick();
      });

      it('should display it', () => {
        expect(component.findAll('.after-row').wrappers.length).to.equal(data.length);
      });

      it('should have access to the index', () => {
        const indices = component.findAll('.after-row-index').wrappers.map((wrapper) => wrapper.text());
        expect(indices.length).to.equal(data.length);
        expect(indices).to.deep.equal(data.map((_row, index) => index.toString()));
      });

      it('should have access to the row', () => {
        const firstNames = component.findAll('.after-row-first-name').wrappers.map((wrapper) => wrapper.text());
        expect(firstNames.length).to.equal(data.length);
        expect(firstNames).to.deep.equal(data.map((row) => row.firstName));
      });

      it('should have access to the columns', () => {
        const lengths = component.findAll('.after-row-column-length').wrappers.map((wrapper) => wrapper.text());
        expect(lengths.length).to.equal(data.length);
        expect(lengths).to.deep.equal(data.map((row) => `${Object.keys(row).length}`));
      });
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

  describe('footer', () => {
    beforeEach(() => {
      data = [
        { firstName: 'b', lastName: 'c' },
        { firstName: 'a', lastName: 'a' },
        { firstName: 'c', lastName: 'b' },
      ];
    });

    context('with footer slot', () => {
      it('should show the footer', async() => {
        const component = initMockComponent({ firstNameSortable: true, slots: { footer: '<div id="footer" />' } });
        await component.vm.$nextTick();
        expect(component.contains('#footer')).be.true;
      });
    });

    context('without footer slot', () => {
      it('should not show the footer', async() => {
        const component = initMockComponent({ firstNameSortable: true });
        await component.vm.$nextTick();
        const tfoot = component.find('tfoot');
        expect(tfoot.exists()).be.false;
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

          it('should emit a data-change event', () => {
            expect(component.emitted('data-change')).to.not.be.undefined;
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

  function initMockComponent({ firstNameSortable = false, lastNameHidden = false, propsData = {}, slots = {}, ...args } = {}) {
    const defaultSlot = `
      <table-column show="firstName" label="First name" :sortable="${firstNameSortable}"></table-column>
      <table-column show="lastName" label="Last name" :hidden="${lastNameHidden}"></table-column>
    `;

    return mockTableComponent({
      data: data,
      ...propsData,
    }, {
      slots: {
        default: defaultSlot,
        ...slots,
      },
      ...args,
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
