import {
	shouldRender,
	setCurrentBreakpoint,
	setAvailableBreakpoints,
} from "../../src/store.js";

describe("store.js", () => {
	beforeAll(() => {
		setCurrentBreakpoint("sm");
		setAvailableBreakpoints({
			xs: 576,
			sm: 768,
			md: 992,
			lg: 1200,
			xl: 1400,
			xxl: Infinity,
		});
	});

	it("should render when part of a range", () => {
		const result = shouldRender("xs-sm");
		expect(result).toBe(true);
	});

	it("should render when part of a minus modifier", () => {
		const result = shouldRender("md-");
		expect(result).toBe(true);
	});

	it("should render when part of a plus modifier", () => {
		const result = shouldRender("sm+");
		expect(result).toBe(true);
	});

	it("should render when part of an array", () => {
		const result = shouldRender(["sm", "xl"]);
		expect(result).toBe(true);
	});

	it("should render when directly requested", () => {
		const result = shouldRender("sm");
		expect(result).toBe(true);
	});
});
