import "@testing-library/jest-dom";
import { render, screen, prettyDOM } from "@testing-library/react";

import Container from "../Container";

describe("NavigationButton container", () => {
	test("render child element inside the container", () => {
		const childElementText = "to slide 4";

		render(
			<Container>
				<button aria-label={childElementText}></button>
			</Container>
		);

		const childElement = screen.getByRole("button", { name: childElementText });
		const containerElement = document.querySelector(".mys-multiscroll-nav");

		expect(childElement).toBeInTheDocument();
		expect(containerElement).toContainElement(childElement);
	});
});
