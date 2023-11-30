function MultiSlide() {
	return (
		<div aria-hidden="true" data-mys-multiscroll-slide-type="multi" class="mys-multiscroll-slide">
			<div class="mys-multiscroll-slide__multi" style="transform: translateY(0%)">
				<div class="mys-multiscroll-slide__content slide-1-left">Slide 0 Left</div>
			</div>

			<div class="mys-multiscroll-slide__multi" style="transform: translateY(0%)">
				<div class="mys-multiscroll-slide__content slide-1-right">Slide 0 Right</div>
			</div>
		</div>
	);
}

export default MultiSlide;
