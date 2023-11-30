function Button({ btnNumber }) {
	const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";

	return (
		<button
			type="button"
			aria-label={`to slide ${btnNumber}`}
			data-mys-multiscroll-nav={btnNumber}
			className={`mys-multiscroll-nav__btn ${btnNumber === 0 && ACTIVE_CLASSNAME}`}></button>
	);
}

export default Button;
