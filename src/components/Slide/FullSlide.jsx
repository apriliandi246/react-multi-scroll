function FullSlide({ slideNumber, slidePosition, activeSlideNumber }) {
	const isSlideActive = slideNumber === activeSlideNumber;

	return (
		<div
			className="mys-multiscroll-slide"
			data-mys-multiscroll-slide-type="full"
			aria-hidden={isSlideActive === true ? "false" : true}
			style={{ zIndex: isSlideActive === true && "1" }}>
			<div className="mys-multiscroll-slide__full" style={{ transform: `translateY(${slidePosition}%)` }}>
				<div className={`mys-multiscroll-slide__content slide-${slideNumber}-full`}>Slide {slideNumber} Full</div>
			</div>
		</div>
	);
}

export default FullSlide;
