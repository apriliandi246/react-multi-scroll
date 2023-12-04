import { useRef } from "react";

const DELTA_THRESHOLD = 50;
const NOISE_THRESHOLD = 20;
const MINIMUM_TIME_STAMP = 300;

function useWheelOnce(callback) {
	const wheelPower = useRef(0);
	const wheelTimeStamp = useRef(0);
	const isWheelLock = useRef(false);
	const wheelLockTimer = useRef(null);

	return function (event) {
		const delta = event.deltaY * -1;
		const absDelta = Math.abs(delta);
		const currentTimeStamp = event.timeStamp;

		if (absDelta < NOISE_THRESHOLD) return;
		if (currentTimeStamp - wheelTimeStamp.current < MINIMUM_TIME_STAMP && isWheelLock.current === true) return;

		wheelTimeStamp.current = currentTimeStamp;

		if (wheelPower.current < absDelta && isWheelLock.current === false) {
			if (delta > DELTA_THRESHOLD) {
				callback("top");
			}

			if (delta < -DELTA_THRESHOLD) {
				callback("bottom");
			}
		}

		lock(absDelta);

		clearTimeout(wheelLockTimer.current);

		wheelLockTimer.current = setTimeout(() => {
			if (wheelPower.current !== absDelta) return;

			unlock();
		}, 610);

		if (absDelta < DELTA_THRESHOLD && isWheelLock.current === true) {
			unlock();
		}

		function lock(absDelta) {
			wheelPower.current = absDelta;
			isWheelLock.current = true;
		}

		function unlock() {
			wheelPower.current = DELTA_THRESHOLD;
			isWheelLock.current = false;
		}
	};
}

export default useWheelOnce;
