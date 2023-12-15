import { useRef } from "react";

function useDebounce(callback, delay) {
	const timeoutID = useRef(null);

	return function (...args) {
		if (timeoutID.current) {
			clearTimeout(timeoutID.current);
			timeoutID.current = null;
		}

		timeoutID.current = setTimeout(() => {
			callback.apply(this, args);
		}, delay);
	};
}

export default useDebounce;
