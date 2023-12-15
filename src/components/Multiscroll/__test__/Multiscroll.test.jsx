import "@testing-library/jest-dom";
import { render, screen, fireEvent, prettyDOM } from "@testing-library/react";

import Multiscroll from "../Multiscroll";

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.runOnlyPendingTimers();
	jest.useRealTimers();
});

describe("Multiscroll", () => {
	test("the first slide is the active slide and also for the nav button", () => {
		render(<Multiscroll />);

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const firstNavButtonElement = screen.getByRole("button", { name: "to slide 0" });
		const firstSlideElement = screen.getByText("Slide 0 Full").parentElement.parentElement;

		expect(firstNavButtonElement).toHaveClass(ACTIVE_CLASSNAME);
		expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");
		expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
	});

	describe("Wheel navigation event", () => {
		test("wheel until the last slide and nav buttonsand slides changes accordingly", () => {
			render(<Multiscroll />);

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
				if (slideIdx !== totalSlideElements - 1) {
					fireEvent.wheel(document, {
						deltaY: 60
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === totalSlideElements - 1) {
					fireEvent.wheel(document, {
						deltaY: 60
					});
				}

				const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;
				const prevSlideElement = slideElements[slideIdx - 1].parentElement.parentElement;

				const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
				const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });

				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			}
		});

		test("wheel until the first slide and nav buttons and slides changes accordingly", () => {
			render(<Multiscroll />);

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;

			fireEvent.keyDown(document, {
				key: "End"
			});

			jest.advanceTimersByTime(610);

			for (let slideIdx = totalSlideElements - 2; slideIdx >= 0; slideIdx--) {
				if (slideIdx !== 0) {
					fireEvent.wheel(document, {
						deltaY: -60
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === 0) {
					fireEvent.wheel(document, {
						deltaY: -60
					});
				}

				const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;
				const prevSlideElement = slideElements[slideIdx + 1].parentElement.parentElement;

				const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
				const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx + 1}` });

				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
			}
		});

		test("should do nothing if the deltaY value is not face the minimum of the value", () => {
			render(<Multiscroll />);

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const firstNavBtnElement = navBtnElements[0];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const firstSlideElement = slideElements[0].parentElement.parentElement;

			fireEvent.wheel(document, {
				deltaY: 10
			});

			expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
			expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
			expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];

				expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			}

			for (let slideIdx = 1; slideIdx < slideElements.length; slideIdx++) {
				const slideElement = slideElements[slideIdx].parentElement.parentElement;

				expect(slideElement).not.toHaveStyle({ zIndex: 1 });
				expect(slideElement).toHaveAttribute("aria-hidden", "true");
			}
		});

		test("should do nothing the current viewport is mobile size", () => {
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			render(<Multiscroll />);

			fireEvent.wheel(document, {
				deltaY: 60
			});

			jest.advanceTimersByTime(610);

			fireEvent.wheel(document, {
				deltaY: -60
			});

			jest.advanceTimersByTime(610);

			fireEvent.wheel(document, {
				deltaY: 60
			});

			jest.advanceTimersByTime(610);

			fireEvent.wheel(document, {
				deltaY: 60
			});

			jest.advanceTimersByTime(610);

			fireEvent.wheel(document, {
				deltaY: 60
			});

			jest.advanceTimersByTime(610);

			fireEvent.wheel(document, {
				deltaY: -60
			});

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);

			for (let slideIdx = 0; slideIdx < slideElements.length; slideIdx++) {
				const slideElement = slideElements[slideIdx].parentElement.parentElement;

				expect(slideElement).not.toHaveStyle({ zIndex: 1 });
				expect(slideElement).not.toHaveAttribute("aria-hidden");
			}

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});
	});

	describe("Keyboard navigation event", () => {
		describe("ArrowDown", () => {
			test("navigate until the last slide and nav buttons and slides changes accordingly", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlides = slideElements.length;

				for (let slideIdx = 1; slideIdx < totalSlides; slideIdx++) {
					if (slideIdx !== totalSlides - 1) {
						fireEvent.keyDown(document, {
							key: "ArrowDown"
						});

						jest.advanceTimersByTime(610);
					}

					if (slideIdx === totalSlides - 1) {
						fireEvent.keyDown(document, {
							key: "ArrowDown"
						});
					}

					const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;
					const prevSlideElement = slideElements[slideIdx - 1].parentElement.parentElement;

					const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
					const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });

					expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
					expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

					expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
					expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

					expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
					expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
				}
			});

			test("should do nothing for nav buttons and slides if user press the ArrowDown key when at the last slide", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
				const totalNavBtnElements = navBtnElements.length;
				const lastNavBtnElement = navBtnElements[totalNavBtnElements - 1];

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;
				const lastSlideElement = slideElements[totalSlideElements - 1].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "End"
				});

				jest.advanceTimersByTime(610);

				fireEvent.keyDown(document, {
					key: "ArrowDown"
				});

				expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
				expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");

				for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
					const navBtnElement = navBtnElements[btnIdx];

					if (btnIdx !== totalNavBtnElements - 1) {
						expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					}
				}

				for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
					if (slideIdx !== totalSlideElements - 1) {
						const slideElement = slideElements[slideIdx].parentElement.parentElement;

						expect(slideElement).not.toHaveStyle({ zIndex: 1 });
						expect(slideElement).toHaveAttribute("aria-hidden", "true");
					}
				}
			});
		});

		describe("PageDown", () => {
			test("navigate until the last slide and nav buttons and slides changes accordingly", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlides = slideElements.length;

				for (let slideIdx = 1; slideIdx < totalSlides; slideIdx++) {
					if (slideIdx !== totalSlides - 1) {
						fireEvent.keyDown(document, {
							key: "PageDown"
						});

						jest.advanceTimersByTime(610);
					}

					if (slideIdx === totalSlides - 1) {
						fireEvent.keyDown(document, {
							key: "PageDown"
						});
					}

					const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;
					const prevSlideElement = slideElements[slideIdx - 1].parentElement.parentElement;

					const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
					const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });

					expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
					expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

					expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
					expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

					expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
					expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
				}
			});

			test("should do nothing for nav buttons and slides if user press the PageDown key when at the last slide", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
				const totalNavBtnElements = navBtnElements.length;
				const lastNavBtnElement = navBtnElements[totalNavBtnElements - 1];

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;
				const lastSlideElement = slideElements[totalSlideElements - 1].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "End"
				});

				jest.advanceTimersByTime(610);

				fireEvent.keyDown(document, {
					key: "PageDown"
				});

				expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
				expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");

				for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
					const navBtnElement = navBtnElements[btnIdx];

					if (btnIdx !== totalNavBtnElements - 1) {
						expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					}
				}

				for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
					if (slideIdx !== totalSlideElements - 1) {
						const slideElement = slideElements[slideIdx].parentElement.parentElement;

						expect(slideElement).not.toHaveStyle({ zIndex: 1 });
						expect(slideElement).toHaveAttribute("aria-hidden", "true");
					}
				}
			});
		});

		describe("End", () => {
			test("go to the last slide and nav buttons, slides and the current active slide number changes accordingly", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const lastNavBtnElement = screen.getByRole("button", { name: "to slide 11" });

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const lastSlideNumber = slideElements.length - 1;
				const lastSlideElement = slideElements[lastSlideNumber].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "End"
				});

				expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
				expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");
			});

			test("should do nothing if user press the End key when at the last slide", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
				const totalNavBtnElements = navBtnElements.length;
				const lastNavBtnElement = navBtnElements[totalNavBtnElements - 1];

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;
				const lastSlideElement = slideElements[totalSlideElements - 1].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "End"
				});

				jest.advanceTimersByTime(610);

				fireEvent.keyDown(document, {
					key: "End"
				});

				expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
				expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");

				for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
					const navBtnElement = navBtnElements[btnIdx];

					if (btnIdx !== totalNavBtnElements - 1) {
						expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					}
				}

				for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
					if (slideIdx !== totalSlideElements - 1) {
						const slideElement = slideElements[slideIdx].parentElement.parentElement;

						expect(slideElement).not.toHaveStyle({ zIndex: 1 });
						expect(slideElement).toHaveAttribute("aria-hidden", "true");
					}
				}
			});
		});

		describe("ArrowUp", () => {
			test("navigate until the first slide and nav buttons and slides changes accordingly", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;

				fireEvent.keyDown(document, {
					key: "End"
				});

				jest.advanceTimersByTime(610);

				for (let slideIdx = totalSlideElements - 2; slideIdx >= 0; slideIdx--) {
					if (slideIdx !== 0) {
						fireEvent.keyDown(document, {
							key: "ArrowUp"
						});

						jest.advanceTimersByTime(610);
					}

					if (slideIdx === 0) {
						fireEvent.keyDown(document, {
							key: "ArrowUp"
						});
					}

					const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;
					const prevSlideElement = slideElements[slideIdx + 1].parentElement.parentElement;

					const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
					const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx + 1}` });

					expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

					expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
					expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

					expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
					expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
				}
			});

			test("should do nothing if user press the ArrowUp key when at the first slide", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
				const totalNavBtnElements = navBtnElements.length;
				const firstNavBtnElement = navBtnElements[0];

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;
				const firstSlideElement = slideElements[0].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "ArrowUp"
				});

				expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
				expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

				for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
					const navBtnElement = navBtnElements[btnIdx];
					expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				}

				for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
					const slideElement = slideElements[slideIdx].parentElement.parentElement;

					expect(slideElement).not.toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "true");
				}
			});
		});

		describe("PageUp", () => {
			test("navigate until the last slide and nav buttons and slides changes accordingly", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;

				fireEvent.keyDown(document, {
					key: "End"
				});

				jest.advanceTimersByTime(610);

				for (let slideIdx = totalSlideElements - 2; slideIdx >= 0; slideIdx--) {
					if (slideIdx !== 0) {
						fireEvent.keyDown(document, {
							key: "PageUp"
						});

						jest.advanceTimersByTime(610);
					}

					if (slideIdx === 0) {
						fireEvent.keyDown(document, {
							key: "PageUp"
						});
					}

					const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;
					const prevSlideElement = slideElements[slideIdx + 1].parentElement.parentElement;

					const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
					const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx + 1}` });

					expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
					expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

					expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
					expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

					expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
					expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
				}
			});

			test("should do nothing for nav buttons and slides if user press the PageUp key when at the first slide", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
				const totalNavBtnElements = navBtnElements.length;
				const firstNavBtnElement = navBtnElements[0];

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;
				const firstSlideElement = slideElements[0].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "PageUp"
				});

				expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
				expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

				for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
					const navBtnElement = navBtnElements[btnIdx];
					expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				}

				for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
					const slideElement = slideElements[slideIdx].parentElement.parentElement;

					expect(slideElement).not.toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "true");
				}
			});
		});

		describe("Home", () => {
			test("go to the first slide and nav buttons and slides changes accordingly", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const firstNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
				const firstSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "End"
				});

				jest.advanceTimersByTime(610);

				fireEvent.keyDown(document, {
					key: "Home"
				});

				expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
				expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");
			});

			test("should do nothing if user press the Home key when at the first slide", () => {
				render(<Multiscroll />);

				const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
				const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
				const totalNavBtnElements = navBtnElements.length;
				const firstNavBtnElement = navBtnElements[0];

				const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
				const totalSlideElements = slideElements.length;
				const firstSlideElement = slideElements[0].parentElement.parentElement;

				fireEvent.keyDown(document, {
					key: "Home"
				});

				expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
				expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

				for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
					const navBtnElement = navBtnElements[btnIdx];

					if (btnIdx !== totalNavBtnElements - 1) {
						expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					}
				}

				for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
					const slideElement = slideElements[slideIdx].parentElement.parentElement;

					expect(slideElement).not.toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "true");
				}
			});
		});

		test("should do nothing if the current viewport is mobile size", () => {
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			render(<Multiscroll />);

			fireEvent.keyDown(document, {
				key: "ArrowDown"
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp"
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageDown"
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageUp"
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "End"
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home"
			});

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);

			for (let slideIdx = 0; slideIdx < slideElements.length; slideIdx++) {
				const slideElement = slideElements[slideIdx].parentElement.parentElement;

				expect(slideElement).not.toHaveStyle({ zIndex: 1 });
				expect(slideElement).not.toHaveAttribute("aria-hidden");
			}

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});
	});

	describe("Nav Buttons navigation event", () => {
		test("navigating until the last nav button and the slides and nav buttons changes accordingly", () => {
			render(<Multiscroll />);

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });

			for (let btnIdx = 1; btnIdx < navBtnElements.length; btnIdx++) {
				const nextNavBtnElement = navBtnElements[btnIdx];

				fireEvent.click(nextNavBtnElement);

				const prevNavBtnElement = navBtnElements[btnIdx - 1];
				const prevRegexSlideSelector = new RegExp(`Slide ${btnIdx - 1} (Left|Full)`);
				const prevSlideActiveElement = screen.getByText(prevRegexSlideSelector).parentElement.parentElement;

				const nextRegexSlideSelector = new RegExp(`Slide ${btnIdx} (Left|Full)`);
				const nextSlideActiveElement = screen.getByText(nextRegexSlideSelector).parentElement.parentElement;

				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideActiveElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideActiveElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideActiveElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideActiveElement).toHaveAttribute("aria-hidden", "false");
			}
		});

		test("navigating until the first nav button and the slides and nav buttons changes accordingly", () => {
			render(<Multiscroll />);

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const lastNavBtnElement = navBtnElements[navBtnElements.length - 1];

			fireEvent.click(lastNavBtnElement);

			for (let btnIdx = navBtnElements.length - 2; btnIdx >= 0; btnIdx--) {
				const nextNavBtnElement = navBtnElements[btnIdx];

				fireEvent.click(nextNavBtnElement);

				const prevNavBtnElement = navBtnElements[btnIdx + 1];
				const prevRegexSlideSelector = new RegExp(`Slide ${btnIdx + 1} (Left|Full)`);
				const prevSlideElement = screen.getByText(prevRegexSlideSelector).parentElement.parentElement;

				const nextRegexSlideSelector = new RegExp(`Slide ${btnIdx} (Left|Full)`);
				const nextSlideElement = screen.getByText(nextRegexSlideSelector).parentElement.parentElement;

				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
			}
		});
	});
});
