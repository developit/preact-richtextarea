import { h, Component } from 'preact';
import './style.css';

export default class RichTextArea extends Component {
	shouldComponentUpdate(props) {
		for (let i in props) if (i!=='value' && props[i]!==this.props[i]) return true;
		// value hook is special: contentEditable freaks out when we overwrite innerHTML, so lets avoid it by doing a manual update.
		if (props.value!==this.props.value) {
			this.props.value = props.value;
			this.componentDidUpdate();
		}
		return false;
	}

	componentDidUpdate() {
		let value = this.props.value || '',
			current = this.base.innerHTML;
		if (this.placeholderShowing===true && current===this.props.placeholder) current = '';
		if (current!==value) {
			this.base.innerHTML = value;
		}
		this.updatePlaceholder();
	}

	getHandler(type) {
		for (let i in this.props) if (i.toLowerCase()==='on'+type) return this.props[i];
	}

	handleEvent({ type, target }) {
		let fn = this.getHandler(type),
			value = this.base.innerHTML;
		if (type==='focus' || type==='blur') this.focussed = type==='focus';
		this.updatePlaceholder();
		if (fn) fn({ value, type, target, currentTarget:this });
	}

	updatePlaceholder() {
		let { placeholder } = this.props,
			value = this.base.innerHTML,
			show = (!value || value===placeholder) && placeholder && !this.focussed;
		if (show===this.placeholderShowing) return;
		this.placeholderShowing = show;
		if (show) {
			if (!value) this.base.innerHTML = placeholder;
			this.base.setAttribute('is-placeholder', true);
		}
		else {
			if (value===placeholder) this.base.innerHTML = '';
			this.base.removeAttribute('is-placeholder');
		}
	}

	render({ value, class:cl, className, ...props }) {
		let evt = e => this.handleEvent(e);
		return (
			<richtextarea class={{
				'preact-richtextarea': true,
				[cl]: cl,
				[className]: className
			}} {...props} is-placeholder={!value && !!props.placeholder} contentEditable onFocus={evt} onBlur={evt} onInput={evt} onChange={evt} />
		);
	}
}
