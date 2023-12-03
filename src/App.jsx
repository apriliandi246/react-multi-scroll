import { useState, useEffect } from "react";

import SlidesContainer from "./components/Slide/Container";
import MultiSlide from "./components/Slide/MultiSlide";
import FullSlide from "./components/Slide/FullSlide";
import NavButton from "./components/NavigationButton/Button";
import NavButtonsContainer from "./components/NavigationButton/Container";

import isDekstopView from "./utils/isDekstopView";
import useThrottle from "./hooks/useThrottle";
import useDebounce from "./hooks/useDebounce";

const TOTAL_SLIDE = 12;
const FULL_SLIDE_NUMBERS = [0, 2, 7];
const MULTI_SLIDE_NUMBERS = [1, 3, 4, 5, 6, 8, 9, 10, 11];
const calculatedPositionLists = Array.from({ length: TOTAL_SLIDE }, (_, index) => index * 100);

const HOME = "Home";
const END = "End";
const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const PAGE_UP = "PageUp";
const PAGE_DOWN = "PageDown";

function App() {
	const [isMobileView, setIsMobileView] = useState(false);
	const [isSlideNavigating, setSlideNavigatingProcess] = useState(false);
	const [currentActiveSlideNumber, setCurrentActiveSlideNumber] = useState(0);
	const [positionLists, setPositionLists] = useState([...calculatedPositionLists]);

	const throttleKeyboardNav = useThrottle(keydownKeyboardNavigate, 610);
	const debouncedResizeHandler = useDebounce(setViewportSizeStatus, 300);

	useEffect(() => {
		setViewportSizeStatus();

		window.addEventListener("resize", debouncedResizeHandler);

		return () => {
			window.removeEventListener("resize", debouncedResizeHandler);
		};
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", throttleKeyboardNav);

		return () => {
			document.removeEventListener("keydown", throttleKeyboardNav);
		};
	}, [currentActiveSlideNumber, positionLists]);

	function navBtnNavigate(btnNumber) {
		if (isDekstopView() === false) return;
		if (isSlideNavigating === true) return;
		if (btnNumber === currentActiveSlideNumber) return;

		setSlideNavigatingProcess(true);

		const slidesComparisonNumber = Math.abs(currentActiveSlideNumber - btnNumber);

		if (slidesComparisonNumber === 1) {
			if (btnNumber > currentActiveSlideNumber) {
				oneTimeSlide("bottom");
			}

			if (btnNumber < currentActiveSlideNumber) {
				oneTimeSlide("top");
			}
		}

		if (slidesComparisonNumber > 1) {
			if (btnNumber > currentActiveSlideNumber) {
				multipleTimesSlide("bottom", slidesComparisonNumber);
			}

			if (btnNumber < currentActiveSlideNumber) {
				multipleTimesSlide("top", slidesComparisonNumber);
			}
		}

		setCurrentActiveSlideNumber(btnNumber);
		setSlideNavigatingProcess(false);
	}

	function keydownKeyboardNavigate(event) {
		if (isDekstopView() === false) return;
		if (isSlideNavigating === true) return;

		setSlideNavigatingProcess(true);

		const keyboardKey = event.key;

		if (keyboardKey === HOME && currentActiveSlideNumber !== 0) {
			multipleTimesSlide("top", currentActiveSlideNumber);
			setCurrentActiveSlideNumber(0);
		}

		if (keyboardKey === ARROW_DOWN || keyboardKey === PAGE_DOWN) {
			const lastSlideNumber = positionLists.length - 1;

			if (currentActiveSlideNumber !== lastSlideNumber) {
				oneTimeSlide("bottom");
				setCurrentActiveSlideNumber((prevState) => prevState + 1);
			}
		}

		if (keyboardKey === ARROW_UP || keyboardKey === PAGE_UP) {
			if (currentActiveSlideNumber !== 0) {
				oneTimeSlide("top");
				setCurrentActiveSlideNumber((prevState) => prevState - 1);
			}
		}

		if (keyboardKey === END) {
			const lastSlideNumber = positionLists.length - 1;

			if (currentActiveSlideNumber !== lastSlideNumber) {
				const slideComparison = Math.abs(currentActiveSlideNumber - lastSlideNumber);

				multipleTimesSlide("bottom", slideComparison);
				setCurrentActiveSlideNumber(lastSlideNumber);
			}
		}

		setSlideNavigatingProcess(false);
	}

	function oneTimeSlide(direction) {
		let newPosition;
		const positionListsArr = [...positionLists];

		for (let positionIdx = 0; positionIdx < positionLists.length; positionIdx++) {
			if (direction === "bottom") {
				newPosition = positionLists[positionIdx] - 100;
			}

			if (direction === "top") {
				newPosition = positionLists[positionIdx] + 100;
			}

			positionListsArr[positionIdx] = newPosition;
			setPositionLists(positionListsArr);
		}
	}

	function multipleTimesSlide(direction, distance) {
		let newPosition;
		const positionListsArr = [...positionLists];

		for (let ii = 0; ii < distance; ii++) {
			for (let positionIdx = 0; positionIdx < positionLists.length; positionIdx++) {
				if (direction === "bottom") {
					newPosition = positionListsArr[positionIdx] - 100;
				}

				if (direction === "top") {
					newPosition = positionListsArr[positionIdx] + 100;
				}

				positionListsArr[positionIdx] = newPosition;
			}
		}

		setPositionLists(positionListsArr);
	}

	function setViewportSizeStatus() {
		if (isDekstopView() === false) {
			setIsMobileView(true);
		}

		if (isDekstopView() === true) {
			setIsMobileView(false);
		}
	}

	return (
		<>
			<NavButtonsContainer>
				{calculatedPositionLists.map((_, index) => (
					<NavButton
						key={index}
						btnNumber={index}
						currentActiveSlideNumber={currentActiveSlideNumber}
						onClickHandler={navBtnNavigate}
					/>
				))}
			</NavButtonsContainer>

			<SlidesContainer>
				{positionLists.map((slidePosition, index) => {
					if (MULTI_SLIDE_NUMBERS.includes(index) === true) {
						return (
							<MultiSlide
								key={index}
								slideNumber={index}
								isMobileView={isMobileView}
								slidePosition={slidePosition}
								activeSlideNumber={currentActiveSlideNumber}
							/>
						);
					}

					if (FULL_SLIDE_NUMBERS.includes(index) === true) {
						return (
							<FullSlide
								key={index}
								slideNumber={index}
								isMobileView={isMobileView}
								slidePosition={slidePosition}
								activeSlideNumber={currentActiveSlideNumber}
							/>
						);
					}
				})}
			</SlidesContainer>
		</>
	);
}

export default App;
