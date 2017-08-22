import RichTextArea from '../src';
import { h, Component, render } from 'preact';
import jsxChai from 'preact-jsx-chai';
chai.use(jsxChai);

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

		describe('stylesheet', () => {
			let scratch;
			before( () => {
				scratch = document.createElement('div');
				document.body.appendChild(scratch);
			});
			beforeEach( () => {
				scratch.innerHTML = '';
			});
			after( () => {
				document.body.removeChild(scratch);
			})

			it('should inject stylesheet', () => {
				let stylesheet = `strong { color: rgb(255, 0, 0); }`;
				render(<RichTextArea stylesheet={stylesheet} value="foo <strong>bar</strong> baz" />, scratch);
				
				let strong = scratch.querySelector('iframe').contentWindow.document.querySelector('strong');
				expect(strong).to.exist;
				expect(window.getComputedStyle(strong).color).to.equal('rgb(255, 0, 0)');
			});
		});
	});
});
