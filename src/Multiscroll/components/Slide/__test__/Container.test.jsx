import "@testing-library/jest-dom";
import { render, screen, prettyDOM } from "@testing-library/react";

import Container from "../Container";

describe("Slides container", () => {
	test("render child element inside the container", () => {
		const childElementText = "Hello World";

		render(
			<Container>
				<h1>{childElementText}</h1>
			</Container>
		);

		const childElement = screen.getByText(childElementText);
		const containerElement = screen.getByRole("main");

		expect(childElement).toBeInTheDocument();
		expect(containerElement).toContainElement(childElement);
	});
});
