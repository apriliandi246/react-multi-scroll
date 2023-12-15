import "@testing-library/jest-dom";
import { render, screen, prettyDOM } from "@testing-library/react";

import Button from "../Button";

describe("Nav Button component", () => {
	test("nav button is rendered and first nav button is active at the first state", () => {
		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const { btnNumber, currentActiveSlideNumber, onClickHandler } = {
			btnNumber: 0,
			currentActiveSlideNumber: 0,
			onClickHandler: jest.fn()
		};

		render(<Button btnNumber={btnNumber} currentActiveSlideNumber={currentActiveSlideNumber} onClickHandler={onClickHandler} />);

		const buttonElement = screen.getByRole("button", { name: `to slide ${btnNumber}` });

		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement).toHaveClass(ACTIVE_CLASSNAME);
	});

	test("nav button become unactive if the nav button number is equal to current active slide number", () => {
		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const { btnNumber, currentActiveSlideNumber, onClickHandler } = {
			btnNumber: 4,
			currentActiveSlideNumber: 0,
			onClickHandler: jest.fn()
		};

		render(<Button btnNumber={btnNumber} currentActiveSlideNumber={currentActiveSlideNumber} onClickHandler={onClickHandler} />);

		const buttonElement = screen.getByRole("button", { name: `to slide ${btnNumber}` });

		expect(buttonElement).not.toHaveClass(ACTIVE_CLASSNAME);
	});
});
