import NavButton from "./components/NavigationButton/Button";
import NavButtonsContainer from "./components/NavigationButton/Container";

function App() {
	const timesArray = Array.from({ length: 10 }, (_, index) => index);

	return (
		<>
			<NavButtonsContainer>
				{timesArray.map((index) => (
					<NavButton key={index} btnNumber={index} />
				))}
			</NavButtonsContainer>
		</>
	);
}

export default App;
