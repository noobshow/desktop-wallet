import React from "react";

import { ListDividedItem } from "./ListDividedItem";

export default {
	title: "App / Components / ListDivided / ListDividedItem",
};

const item = {
	isFloatingLabel: true,
	label: "New Profile",
	labelDescription: "Select Profile Image",
	itemLabelClass: "text-2xl font-semibold text-theme-secondary-text",
	itemLabelDescriptionClass: "text-sm font-semibold text-neutral-dark",
	labelClass: "",
	value: "",
	itemValueClass: "",
	content: (
		<div className="flex flex-row mt-2">
			<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-dashed rounded border-theme-neutral" />
			<div className="relative w-24 h-24 rounded bg-theme-neutral">
				<img
					src="https://randomuser.me/api/portraits/men/3.jpg"
					className="object-cover rounded"
					alt="random avatar"
				/>
			</div>
		</div>
	),
};

export const Default = () => (
	<div className="inline-flex space-x-4">
		<ListDividedItem {...item} />
	</div>
);
