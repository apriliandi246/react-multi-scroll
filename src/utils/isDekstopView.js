function isDekstopView() {
	const DEKSTOP_SIZE_MINIMUM = 768;
	const currentViewportWidth = window.innerWidth;

	if (currentViewportWidth > DEKSTOP_SIZE_MINIMUM) {
		return true;
	} else {
		return false;
	}
}

export default isDekstopView;
