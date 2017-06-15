import partitionEventHandlers from '../src/partition-event-handlers';
import { expect } from 'chai';

function noop() {}

describe('partitionEventHandlers', () => {
	const props = {
		onFoo: noop,
		onBar: noop,
		title: 'Foo',
		value: 'Bar'
	};

	it('should return only properties beginning with `on` if `withOrWithout` is true', () => {
		const withEventHandlers = partitionEventHandlers(props, true);
		expect(Object.keys(withEventHandlers)).to.eql([ 'onFoo', 'onBar' ]);
	});

	it('should return only properties not beginning with `on` if `withOrWithout` is false', () => {
		const withoutEventHandlers = partitionEventHandlers(props, false);
		expect(Object.keys(withoutEventHandlers)).to.eql([ 'title', 'value' ]);
	});
});

