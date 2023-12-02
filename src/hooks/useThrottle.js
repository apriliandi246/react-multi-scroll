import { useRef } from "react";

function useThrottle(func, delay) {
	let timeOut = useRef(null);
	let isCanRun = useRef(true);

	return function (...args) {
		if (isCanRun.current === true) {
			func.apply(this, args);

			isCanRun.current = false;

			timeOut.current = setTimeout(() => {
				isCanRun.current = true;
			}, delay);
		}
	};
}

export default useThrottle;
