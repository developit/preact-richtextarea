

/**
 * Partition an object between event handlers and non-event handlers.
 * @param {Object} props            An object with keys that may be event handlers
 * @param {Boolean} withOrWithout   If true, returns only event handlers. If false, returns only non-event handlers.
 * @returns {Object}                Returns a copy of {@param props} either with or without all event handlers (based on {@param withOrWithout}).
 */
export default function partitionEventHandlers(props, withOrWithout) {
	let nextProps = {}, key;
	for (key in props) if (props.hasOwnProperty(key)) {
		if (/^on/i.test(key) ^ withOrWithout !== true) {
			nextProps[key] = props[key];
		}
	}
	return nextProps;
}
