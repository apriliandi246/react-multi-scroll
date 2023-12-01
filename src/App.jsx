import { useState } from "react";

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

	return (
		<>
			<NavButtonsContainer>
				{calculatedPositionLists.map((_, index) => (
					<NavButton key={index} btnNumber={index} />
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
