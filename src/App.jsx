import { useState, useEffect } from "react";

import SlidesContainer from "./components/Slide/Container";
import MultiSlide from "./components/Slide/MultiSlide";
import FullSlide from "./components/Slide/FullSlide";
import NavButton from "./components/NavigationButton/Button";
import NavButtonsContainer from "./components/NavigationButton/Container";

const TOTAL_SLIDE = 12;
const FULL_SLIDE_NUMBERS = [0, 2, 7];
const MULTI_SLIDE_NUMBERS = [1, 3, 4, 5, 6, 8, 9, 10, 11];
const calculatedPositionLists = Array.from({ length: TOTAL_SLIDE }, (_, index) => index * 100);

function App() {
	const [isSlideNavigating, setSlideNavigatingProcess] = useState(false);
	const [currentActiveSlideNumber, setCurrentActiveSlideNumber] = useState(0);
	const [positionLists, setPositionLists] = useState([...calculatedPositionLists]);

	useEffect(() => {
		document.addEventListener("keydown", keydownKeyboardNavigate);

		return () => {
			document.removeEventListener("keydown", keydownKeyboardNavigate);
		};
	}, [currentActiveSlideNumber]);

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

	function navBtnNavigate(btnNumber) {
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
		if (isSlideNavigating === true) return;

		const HOME = "Home";
		const END = "End";
		const ARROW_UP = "ArrowUp";
		const ARROW_DOWN = "ArrowDown";
		const PAGE_UP = "PageUp";
		const PAGE_DOWN = "PageDown";

		setSlideNavigatingProcess(true);

		const keyboardKey = event.key;

		if (keyboardKey === HOME && currentActiveSlideNumber !== 0) {
			multipleTimesSlide("top", currentActiveSlideNumber);
			setCurrentActiveSlideNumber(0);
			setSlideNavigatingProcess(false);
		}

		if (keyboardKey === ARROW_DOWN || keyboardKey === PAGE_DOWN) {
			const lastSlideNumber = positionLists.length - 1;

			if (currentActiveSlideNumber !== lastSlideNumber) {
				oneTimeSlide("bottom");
				setCurrentActiveSlideNumber((prevState) => prevState + 1);
				setSlideNavigatingProcess(false);
			}
		}

		if (keyboardKey === ARROW_UP || keyboardKey === PAGE_UP) {
			if (currentActiveSlideNumber !== 0) {
				oneTimeSlide("top");
				setCurrentActiveSlideNumber((prevState) => prevState - 1);
				setSlideNavigatingProcess(false);
			}
		}

		if (keyboardKey === END) {
			const lastSlideNumber = positionLists.length - 1;

			if (currentActiveSlideNumber !== lastSlideNumber) {
				const slideComparison = Math.abs(currentActiveSlideNumber - lastSlideNumber);

				multipleTimesSlide("bottom", slideComparison);
				setCurrentActiveSlideNumber(lastSlideNumber);
				setSlideNavigatingProcess(false);
			}
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
