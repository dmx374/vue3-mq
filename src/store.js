import { ref, readonly, computed } from "vue";
import {
	convertBreakpointsToMediaQueries,
	subscribeToMediaQuery,
	listeners,
	sanitiseBreakpoints,
	selectBreakpoints,
} from "./helpers";
const test = "THIS IS A TEST";

export const DEFAULT_BREAKPOINTS = {
	xs: 576,
	sm: 768,
	md: 992,
	lg: 1200,
	xl: 1400,
	xxl: Infinity,
};

const _currentBreakpoint = ref("");
const _mqAvailableBreakpoints = ref({});

export const setAvailableBreakpoints = (v) =>
	(_mqAvailableBreakpoints.value = v);
export const mqAvailableBreakpoints = readonly(_mqAvailableBreakpoints);

export const setCurrentBreakpoint = (v) => (_currentBreakpoint.value = v);
export const currentBreakpoint = readonly(_currentBreakpoint);

export function updateBreakpoints(breakpoints) {
	// Remove any existing MQ listeners
	for (let i = listeners.length - 1; i >= 0; i--) {
		const { mql, cb } = listeners[i];
		mql.removeEventListener("change", cb);
		listeners.splice(i, 1);
	}

	sanitiseBreakpoints(breakpoints);

	// Save new breakpoints to reactive variable
	setAvailableBreakpoints(breakpoints);
	// Create css media queries from breakpoints
	const mediaQueries = convertBreakpointsToMediaQueries(breakpoints);

	// Add new MQ listeners
	for (const key in mediaQueries) {
		const mediaQuery = mediaQueries[key];
		const enter = () => {
			setCurrentBreakpoint(key);
		};
		subscribeToMediaQuery(mediaQuery, enter);
	}
}

export function shouldRender(mq) {
	const isMqArray = Array.isArray(mq);
	const isMqPlus = !isMqArray.value && /\+$/.test(mq) === true;
	const isMqMinus = !isMqArray.value && /-$/.test(mq) === true;
	const isMqRange = !isMqArray.value && /^\w+-\w+/.test(mq) === true;
	const activeBreakpoints = computed(() => {
		if (isMqArray) return mq;
		else if (!isMqPlus && !isMqMinus && !isMqRange) return [mq];
		else {
			return selectBreakpoints({
				mqProp: mq,
				isMqPlus: { value: isMqPlus },
				isMqMinus: { value: isMqMinus },
				isMqRange: { value: isMqRange },
			});
		}
	});
	return activeBreakpoints.value.includes(currentBreakpoint.value);
}
