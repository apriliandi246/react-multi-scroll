import { useRef, useEffect } from "react";

function MultiSlide({ slideNumber, slidePosition, activeSlideNumber, isMobileView }) {
	const slideElement = useRef(null);
	const isSlideActive = slideNumber === activeSlideNumber;

	useEffect(() => {
		if (isMobileView === true) {
			slideElement.current.removeAttribute("aria-hidden", isSlideActive === true ? "false" : "true");
		}

		if (isMobileView === false) {
			slideElement.current.setAttribute("aria-hidden", isSlideActive === true ? "false" : "true");
		}
	}, [isMobileView]);

	return (
		<div
			ref={slideElement}
			className="mys-multiscroll-slide"
			data-mys-multiscroll-slide-type="multi"
			aria-hidden={isSlideActive === true ? "false" : "true"}
			style={{ zIndex: isSlideActive === true && "1" }}>
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
