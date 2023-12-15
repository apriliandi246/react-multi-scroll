import "@testing-library/jest-dom";
import { render, screen, prettyDOM } from "@testing-library/react";

import FullSlide from "../FullSlide";

describe("FullSide component", () => {
	test("slide component is rendered", () => {
		const { slideNumber, slidePosition, activeSlideNumber, isMobileView } = {
			slideNumber: 0,
			slidePosition: 0,
			activeSlideNumber: 0,
			isMobileView: false
		};

		render(
			<FullSlide
				slideNumber={slideNumber}
				slidePosition={slidePosition}
				activeSlideNumber={activeSlideNumber}
				isMobileView={isMobileView}
			/>
		);

		const slideElement = screen.getByText(`Slide ${slideNumber} Full`).parentElement.parentElement;

		expect(slideElement).toBeInTheDocument();
	});

	test("slide component become active slide", () => {
		const { slideNumber, slidePosition, activeSlideNumber, isMobileView } = {
			slideNumber: 0,
			slidePosition: 0,
			activeSlideNumber: 0,
			isMobileView: false
		};

		render(
			<FullSlide
				slideNumber={slideNumber}
				slidePosition={slidePosition}
				activeSlideNumber={activeSlideNumber}
				isMobileView={isMobileView}
			/>
		);

		const slideElement = screen.getByText(`Slide ${slideNumber} Full`).parentElement.parentElement;

		expect(slideElement).toHaveAttribute("aria-hidden", "false");
		expect(slideElement).toHaveStyle({ zIndex: 1 });
	});

	test("slide component become unactive slide", () => {
		const { slideNumber, slidePosition, activeSlideNumber, isMobileView } = {
			slideNumber: 7,
			slidePosition: 600,
			activeSlideNumber: 1,
			isMobileView: false
		};

		render(
			<FullSlide
				slideNumber={slideNumber}
				slidePosition={slidePosition}
				activeSlideNumber={activeSlideNumber}
				isMobileView={isMobileView}
			/>
		);

		const slideElement = screen.getByText(`Slide ${slideNumber} Full`).parentElement.parentElement;

		expect(slideElement).toHaveAttribute("aria-hidden", "true");
		expect(slideElement).not.toHaveStyle({ zIndex: 1 });
	});

	test("there is no active or unactive slide when current viewport is mobile size", () => {
		const activeSlideProps = {
			slideNumber: 1,
			slidePosition: 0,
			activeSlideNumber: 1,
			isMobileView: true
		};

		const unactiveSlideProps = {
			slideNumber: 7,
			slidePosition: 600,
			activeSlideNumber: 1,
			isMobileView: true
		};

		render(
			<>
				<FullSlide
					slideNumber={activeSlideProps.slideNumber}
					slidePosition={activeSlideProps.slidePosition}
					activeSlideNumber={activeSlideProps.activeSlideNumber}
					isMobileView={activeSlideProps.isMobileView}
				/>
				<FullSlide
					slideNumber={unactiveSlideProps.slideNumber}
					slidePosition={unactiveSlideProps.slidePosition}
					activeSlideNumber={unactiveSlideProps.activeSlideNumber}
					isMobileView={unactiveSlideProps.isMobileView}
				/>
			</>
		);

		const activeSlideElement = screen.getByText(`Slide ${activeSlideProps.slideNumber} Full`).parentElement.parentElement;
		const unactiveSlideElement = screen.getByText(`Slide ${unactiveSlideProps.slideNumber} Full`).parentElement.parentElement;

		expect(activeSlideElement).not.toHaveAttribute("aria-hidden", "false");
		expect(activeSlideElement).not.toHaveStyle({ zIndex: 1 });

		expect(unactiveSlideElement).not.toHaveAttribute("aria-hidden", "true");
		expect(unactiveSlideElement).not.toHaveStyle({ zIndex: 1 });
	});
});
