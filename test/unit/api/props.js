/* eslint-env jasmine, mocha */

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { Component, define, props } from '../../../src/index';

describe('api/props', () => {
  let elem;

  beforeEach(done => {
    elem = new (define(class extends Component {
      static get props () {
        return {
          prop1: {
            initial: 'test1'
          },
          prop2: {
            initial: 'test2'
          },
          prop3: {
            default: undefined
          }
        };
      }
      constructor () {
        super();
        this._rendered = 0;
      }
      renderCallback () {
        this._rendered++;
      }
    }))();
    fixture(elem);
    afterMutations(
      () => {}, // .render()
      done
    );
  });

  describe('getting', () => {
    it('should return only properties defined as props', () => {
      const curr = props(elem);

      expect(curr.prop1).to.equal('test1');
      expect(curr.prop2).to.equal('test2');
      expect('prop3' in curr).to.equal(true);
      expect(curr.undeclaredProp).to.equal(undefined);
    });
  });

  describe('setting', () => {
    it('should set all properties', () => {
      props(elem, {
        prop1: 'updated1',
        prop2: 'updated2',
        undeclaredProp: 'updated3'
      });
      expect(elem.prop1).to.equal('updated1');
      expect(elem.prop2).to.equal('updated2');
      expect(elem.undeclaredProp).to.equal('updated3');
    });

    it('should synchronously render if declared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, { prop1: 'updated1' });
      expect(elem._rendered).to.equal(2);
    });

    it('should synchronously render once when multiple props are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, {
        prop1: 'updated1',
        prop2: 'updated2'
      });
      expect(elem._rendered).to.equal(2);
    });

    it('should not render if undeclared properties are set', () => {
      expect(elem._rendered).to.equal(1);
      props(elem, { undeclaredProp: 'updated3' });
      expect(elem._rendered).to.equal(1);
    });

    it('should succeed on an uninitialised element', () => {
      const elem = new (define(class extends Component {}))();
      props(elem, { undeclaredProp: 'foo' });
      expect(elem).property('undeclaredProp', 'foo');
    });
  });
});
