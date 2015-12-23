import RichTextArea from '..';
import { h, Component } from 'preact';
import { expect } from 'chai';
// import { spy, match } from 'sinon';

describe('preact-richtextarea', () => {
	describe('<RichTextArea />', () => {
		it('should be a function', () => {
			expect(RichTextArea).to.be.a('function');
		});

		it('should render the correct DOM', () => {
			expect(<RichTextArea />).to.eql(
				<richtextarea class="preact-richtextarea" is-placeholder="false" contentEditable="true" />
			);
		});
	});
});
