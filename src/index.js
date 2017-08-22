import { h, Component } from 'preact';
import partitionEventHandlers from './partition-event-handlers';
import './style.css';

const UID = Math.random().toString(32).substring(2);

const EMPTY_VALUE = '<br>';

export default class RichTextArea extends Component {
	constructor(props) {
		super(props);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
		this.updateHeight = this.updateHeight.bind(this);
		this.handleEvent = this.handleEvent.bind(this);
		this.proxyEvents = this.proxyEvents.bind(this);
		this.doFocus = this.doFocus.bind(this);
	}

	exec(command, ...args) {
		let doc = this.getDocument();
		if (doc) return doc[command](...args);
	}

	execCommand(command, ...args) {
		return this.exec('execCommand', command, ...args);
	}

	queryCommandState(command) {
		return this.exec('queryCommandState', command);
	}

	queryCommandValue(command) {
		return this.exec('queryCommandValue', command);
	}

	proxyEvents(props, nextProps) {
		let currHandlers = partitionEventHandlers(props, true),
			nextHandlers = partitionEventHandlers(nextProps, true),
			win = this.getFrame().contentWindow,
			handler;

		// Add handlers that are in nextHandlers but not in currHandlers
		for (handler in nextHandlers) if (nextHandlers.hasOwnProperty(handler)) {
			if (!(handler in currHandlers)) {
				win.addEventListener(handler.substr(2).toLowerCase(), this.handleEvent);
			}
		}

		// Remove handlers that are in currHandlers but not in nextHandlers
		for (handler in currHandlers) if (currHandlers.hasOwnProperty(handler)) {
			if (!(handler in nextHandlers)) {
				win.removeEventListener(handler.substr(2).toLowerCase(), this.handleEvent);
			}
		}
	}

	componentDidMount() {
		this.updateHeightTimer = setInterval(this.updateHeight, 1000);
		this.proxyEvents({}, this.props);
		this.componentDidUpdate();
	}

	componentWillUnmount() {
		clearInterval(this.updateHeightTimer);
	}

	componentWillReceiveProps(nextProps) {
		this.proxyEvents(this.props, nextProps);
	}

	shouldComponentUpdate({ value, stylesheet, placeholder, children, ...props }) {
		for (let i in props) if (props[i]!==this.props[i]) return true;
		this.props = { ...this.props, value, placeholder, stylesheet };
		this.componentDidUpdate();
		return false;
	}

	componentDidUpdate() {
		clearTimeout(this.updateTimer);
		this.setup();

		let editor = this.getEditor();
		if (!editor) {
			this.editorRetries = (this.editorRetries || 0) + 1;
			this.updateTimer = setTimeout(this.componentDidUpdate, this.editorRetries>10 ? 100 : 1);
			return;
		}
		this.editorRetries = 0;

		let value = this.props.value || EMPTY_VALUE,
			stylesheet = this.props.stylesheet,
			current = editor.innerHTML;

		if (stylesheet!==this.stylesheet) {
			this.setStyleSheet(stylesheet);
		}

		if (this.placeholderShowing===true && current===this.props.placeholder) {
			current = EMPTY_VALUE;
		}
		if (current!==value && editor.__value!==value) {
			editor.innerHTML = editor.__value = value;
		}
		this.updatePlaceholder();
		this.updateHeight();
	}

	setStyleSheet(stylesheet) {
		this.stylesheet = stylesheet;
		let doc = this.getDocument(),
			s = doc.getElementById('prtcss'+UID);
		if (s) s.parentNode.removeChild(s);

		let head = doc.getElementsByTagName('head')[0];
		if (!head) head = doc.body.parentNode.insertBefore(doc.createElement('head'), doc.body);

		s = doc.createElement('style');
		s.setAttribute('id', 'prtcss'+UID);
		s.appendChild(doc.createTextNode(stylesheet));
		head.appendChild(s);
	}

	setup() {
		let doc = this.getDocument();
		if (!doc || (doc.body && doc.body._hasbeensetup===true)) return;

		if (!doc.body) {
			doc.open('text/html');
			doc.write('<!DOCTYPE html><html><head></head><body contentEditable></body></html>');
			doc.close();
		}
		doc.designMode = 'on';
		doc.documentElement.style.cursor = 'text';
		doc.documentElement.style.overflowY = doc.body.style.overflowY = 'hidden';
		doc.body.style.minHeight = '1.2em';
		doc.body.contentEditable = true;
		doc.body._hasbeensetup = true;
		let win = this.getFrame().contentWindow;
		win.onfocus = win.onblur = this.handleEvent;
		win.onscroll = win.onload = this.updateHeight;
	}

	updateHeight() {
		clearTimeout(this.uht);
		this.uht = null;
		let doc = this.getDocument(),
			br = doc && doc._br;
		if (!doc) return;
		if (!br) {
			br = doc._br = doc.createElement('div');
			br.style.cssText = 'position:relative;overflow:hidden;clear:both;';
		}
		doc.body.appendChild(br);
		let ph = br.offsetTop + doc.documentElement.offsetHeight - doc.body.offsetHeight;
		doc.body.removeChild(br);

		let frame = this.getFrame();
		if (ph!==frame.offsetHeight) {
			frame.style.height = ph+'px';
		}
	}

	getFrame() {
		return this.base && this.base.firstChild;
	}

	getDocument() {
		let frame = this.getFrame();
		return frame && frame.contentWindow && frame.contentWindow.document;
	}

	getEditor() {
		let doc = this.getDocument();
		return doc && doc.body;
	}

	getHandler(type) {
		for (let i in this.props) if (i.toLowerCase()==='on'+type) return this.props[i];
	}

	handleEvent(e) {
		let type = e.type,
			fn = this.getHandler(type),
			editor = this.getEditor();

		if (type==='input' || type==='change') {
			e.value = editor.innerHTML;
		}

		if (type==='focus' || type==='blur') {
			this.focussed = type==='focus';
			this.updatePlaceholder();
			if (type==='focus') e.target.focus();
		}

		if (fn) fn(e);
		if (!this.uht) {
			this.uht = setTimeout(this.updateHeight, 20);
		}
	}

	updatePlaceholder() {
		let { placeholder } = this.props,
			editor = this.getEditor(),
			value = editor.innerHTML,
			norm = this.normalizeEmptyValue(value),
			show = (!norm || norm===EMPTY_VALUE || norm===placeholder) && placeholder && !this.focussed;

		if (show===this.placeholderShowing) return;
		this.placeholderShowing = show;

		if (show) {
			if (!norm) editor.innerHTML = placeholder;
			this.base.setAttribute('is-placeholder', 'true');
		}
		else {
			if (value===placeholder) editor.innerHTML = EMPTY_VALUE;
			this.base.removeAttribute('is-placeholder');
		}
	}

	normalizeEmptyValue(value) {
		return typeof value==='string' ? value.replace(/^[\s\n]*?(<br\s*?\/?>)?[\s\n]*?$/gi, '') : '';
	}

	doFocus(e) {
		let a = this.getEditor();
		if (a) a.focus();
		if (e) return e.preventDefault(), false;
	}

	render({ value, className, placeholder, stylesheet, ...props }) {
		props = partitionEventHandlers(props, false);
		return (
			<richtextarea
				{...props}
				class={['preact-richtextarea', props.class, className].filter(Boolean).join(' ')}
				onFocus={this.doFocus}
				tabIndex=" "
				is-placeholder={ (!value && !!placeholder) || null }>
				<iframe />
			</richtextarea>
		);
	}
}
