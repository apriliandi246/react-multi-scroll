function Button({ btnNumber, currentActiveSlideNumber, onClickHandler }) {
	const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
	const isActiveBtn = btnNumber === currentActiveSlideNumber && ACTIVE_CLASSNAME;

	return (
		<button
			type="button"
			aria-label={`to slide ${btnNumber}`}
			data-mys-multiscroll-nav={btnNumber}
			onClick={() => onClickHandler(btnNumber)}
			className={`mys-multiscroll-nav__btn ${isActiveBtn}`}></button>
	);
}

export default Button;
