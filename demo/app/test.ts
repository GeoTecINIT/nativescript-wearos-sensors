import { runTestApp } from "@nativescript/unit-test-runner";
// import other polyfills here

declare let require: any;

runTestApp({
	runTests: () => {
		const tests = require.context("./tests", true, /\.spec\.ts$/);
		tests.keys().map(tests);
	},
});
