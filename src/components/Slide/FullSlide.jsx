import { useRef, useEffect } from "react";

function FullSlide({ slideNumber, slidePosition, activeSlideNumber, isMobileView }) {
	const slideRef = useRef(null);
	const isSlideActive = slideNumber === activeSlideNumber;

	useEffect(() => {
		const slideElement = slideRef.current;

		if (isMobileView === true) {
			slideElement.removeAttribute("aria-hidden", isSlideActive === true ? "false" : "true");
		}

		if (isMobileView === false) {
			slideElement.setAttribute("aria-hidden", isSlideActive === true ? "false" : "true");
		}
	}, [isMobileView]);

	return (
		<div
			ref={slideRef}
			className="mys-multiscroll-slide"
			data-mys-multiscroll-slide-type="full"
			aria-hidden={isSlideActive === true ? "false" : "true"}
			style={{ zIndex: isSlideActive === true && "1" }}>
			<div className="mys-multiscroll-slide__full" style={{ transform: `translateY(${slidePosition}%)` }}>
				<div className={`mys-multiscroll-slide__content slide-${slideNumber}-full`}>Slide {slideNumber} Full</div>
			</div>
		</div>
	);
}

export default FullSlide;
