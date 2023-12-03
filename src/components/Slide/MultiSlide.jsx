import { useRef, useEffect } from "react";

function MultiSlide({ slideNumber, slidePosition, activeSlideNumber, isMobileView }) {
	const slideRef = useRef(null);
	const isSlideActive = slideNumber === activeSlideNumber;

	useEffect(() => {
		const slideElement = slideRef.current;

		if (isMobileView === true) {
			slideElement.removeAttribute("aria-hidden");
			isSlideActive === true && slideElement.style.removeProperty("z-index");
		}

		if (isMobileView === false) {
			slideElement.setAttribute("aria-hidden", isSlideActive === true ? "false" : "true");
			isSlideActive === true && slideElement.style.setProperty("z-index", "1");
		}
	}, [isMobileView]);

	return (
		<div
			ref={slideRef}
			className="mys-multiscroll-slide"
			data-mys-multiscroll-slide-type="multi"
			style={{ zIndex: isSlideActive === true && "1" }}
			aria-hidden={isSlideActive === true ? "false" : "true"}>
			<div className="mys-multiscroll-slide__multi" style={{ transform: `translateY(${slidePosition}%)` }}>
				<div className={`mys-multiscroll-slide__content slide-${slideNumber}-left`}>Slide {slideNumber} Left</div>
			</div>

			<div className="mys-multiscroll-slide__multi" style={{ transform: `translateY(${slidePosition * -1}%)` }}>
				<div className={`mys-multiscroll-slide__content slide-${slideNumber}-right`}>Slide {slideNumber} Right</div>
			</div>
		</div>
	);
}

export default MultiSlide;
