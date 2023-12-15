import "@testing-library/jest-dom";
import { render, screen, prettyDOM } from "@testing-library/react";

import Container from "../Container";

describe("Slide Container", () => {
	test("render child element inside the container", () => {
		const headingTextContent = "Hello World";

		render(
			<Container>
				<h1>{headingTextContent}</h1>
			</Container>
		);

		const headingElement = screen.getByText(headingTextContent);
		const mainContainer = screen.getByRole("main");

		expect(headingElement).toBeInTheDocument();
		expect(mainContainer).toContainElement(headingElement);
	});
});
