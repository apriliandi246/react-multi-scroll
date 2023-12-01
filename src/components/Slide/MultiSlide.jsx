function MultiSlide({ slideNumber, slidePosition, activeSlideNumber }) {
	const isSlideActive = slideNumber === activeSlideNumber;

	return (
		<div
			className="mys-multiscroll-slide"
			data-mys-multiscroll-slide-type="multi"
			aria-hidden={isSlideActive === true ? "false" : true}
			style={{ zIndex: isSlideActive === true && "1" }}>
			<div className="mys-multiscroll-slide__multi" style={{ transform: `translateY(${slidePosition}%)` }}>
				<div className="mys-multiscroll-slide__content slide-1-left">Slide {slideNumber} Left</div>
			</div>

			<div className="mys-multiscroll-slide__multi" style={{ transform: `translateY(${slidePosition * -1}%)` }}>
				<div className="mys-multiscroll-slide__content slide-1-right">Slide {slideNumber} Right</div>
			</div>
		</div>
	);
}

export default MultiSlide;
