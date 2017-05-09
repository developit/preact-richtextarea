# preact-richtextarea

[![Greenkeeper badge](https://badges.greenkeeper.io/developit/preact-richtextarea.svg)](https://greenkeeper.io/)

[![NPM](http://img.shields.io/npm/v/preact-richtextarea.svg)](https://www.npmjs.com/package/preact-richtextarea)
[![travis-ci](https://travis-ci.org/developit/preact-richtextarea.svg)](https://travis-ci.org/developit/preact-richtextarea)

A `<textarea>` that supports HTML editing, powered by [Preact] & contentEditable.

---


### Usage Example

Use `<RichTextArea />` like a normal `<input>`. It supports the same props/attributes, including `value`, `onInput()` and `onChange()`.

```js
import RichTextArea from 'preact-richtextarea';

const HtmlEditor = ({ html, ...props }) => (
	<label class="html">
		Body HTML:
		<RichTextArea value={html} {...props} />
	</form>
);

let html = `<h1>hello</h1><p>Testing 1 2 3...</p>`;
render(<HtmlEditor html={html} />, document.body);
```


### Usage with Linked State

`<RichTextArea />` works with Linked State exactly the same way as any other input field:

```js
import RichTextArea from 'preact-richtextarea';

class Form extends Component {
	render({ }, { html }) {
		return (
			<form>
				<RichTextArea value={html} onChange={ this.linkState('html') } />
			</form>
		);
	}
}

render(<Form />, document.body);
```


---


### License

[MIT]


[Preact]: https://github.com/developit/preact
[MIT]: http://choosealicense.com/licenses/mit/
