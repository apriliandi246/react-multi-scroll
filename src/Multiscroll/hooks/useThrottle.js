import { useRef } from "react";

function useThrottle(callback, delay) {
	const isCanRun = useRef(true);
	const timeoutID = useRef(null);

	return function (...args) {
		if (isCanRun.current === true) {
			callback.apply(this, args);

			isCanRun.current = false;

			timeoutID.current = setTimeout(() => {
				isCanRun.current = true;
			}, delay);
		}
	};
}

export default useThrottle;
