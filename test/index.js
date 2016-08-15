import RichTextArea from '..';
import { h, Component } from 'preact';
import { expect } from 'chai';
// import { spy, match } from 'sinon';

let onFocus = (function doFocus(){}).bind({})

describe('preact-richtextarea', () => {
	describe('<RichTextArea />', () => {
		it('should be a function', () => {
			expect(RichTextArea).to.be.a('function');
		});

		it('should render the correct DOM', () => {
			expect(<RichTextArea />).to.eql(
				<richtextarea class="preact-richtextarea" tabIndex=" " onFocus={onFocus}>
					<iframe />
				</richtextarea>
			);
		});

		it('should render placeholders', () => {
			expect(<RichTextArea placeholder="test" />).to.eql(
				<richtextarea class="preact-richtextarea" tabIndex=" " is-placeholder onFocus={onFocus}>
					<iframe />
				</richtextarea>
			);

			expect(<RichTextArea placeholder="test" value="foo bar" />).to.eql(
				<richtextarea class="preact-richtextarea" tabIndex=" " onFocus={onFocus}>
					<iframe />
				</richtextarea>
			);
		});
	});
});
