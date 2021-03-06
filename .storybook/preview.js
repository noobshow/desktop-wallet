import React from "react";
import { addDecorator, addParameters } from "@storybook/react";
import { withI18next } from "storybook-addon-i18next";
import StoryRouter from "storybook-react-router";

// Preview layout
import { Layout } from "./Layout";
// i18n
import { i18n } from "app/i18n";

addParameters({
	options: {
		showRoots: true,
	},
	themes: [
		{ name: "Light", class: "theme-light", color: "#ffffff", default: true },
		{ name: "Dark", class: "theme-dark", color: "#212225" },
	],
});

addDecorator(
	withI18next({
		i18n,
		languages: {
			en: "English",
		},
	}),
);
addDecorator(StoryRouter());
addDecorator((storyFn) => <Layout>{storyFn()}</Layout>);
