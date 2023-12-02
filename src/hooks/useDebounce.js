import { useRef } from "react";

function useDebounce(func, delay) {
	const timer = useRef(null);

	return function (...args) {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}

		timer.current = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

export default useDebounce;
