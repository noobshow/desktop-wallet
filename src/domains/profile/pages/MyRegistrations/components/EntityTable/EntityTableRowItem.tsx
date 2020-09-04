import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type EntityTableRowItemProps = {
	entity: ExtendedTransactionData;
	onAction?: any;
};

export const EntityTableRowItem = ({ onAction, entity }: EntityTableRowItemProps) => {
	const { t } = useTranslation();

	const options = [
		{ label: t("COMMON.UPDATE"), value: "update" },
		{ label: t("COMMON.RESIGN"), value: "resign" },
	];

	const { data }: any = entity.asset();

	return (
		<tr data-testid="EntityTableRowItem" className="border-b border-dashed border-theme-neutral-light">
			<td className="w-24 py-6">
				<div className="flex items-center">
					<Circle className="border-theme-neutral-800" size="lg">
						<Icon name="Business" width={22} height={22} />
					</Circle>
					<Avatar address={entity.sender()} size="lg" className="mr-4" />
				</div>
			</td>
			<td className="font-semibold">
				<span>{entity.wallet().alias()}</span>
			</td>
			<td className="font-semibold">
				<span>{data?.name}</span>
			</td>
			<td className="font-semibold text-center text-theme-primary">
				<span>{t("COMMON.VIEW")}</span>
			</td>
			<td className="text-center text-theme-neutral-light">
				<span className="flex justify-center">
					<Icon name="Redirect" className="text-center" />
				</span>
			</td>
			<td className="font-semibold text-center text-theme-primary">
				<span className="flex justify-center">
					<Icon name="Msq" width={22} height={22} />
				</span>
			</td>
			<td className="font-semibold text-center text-theme-primary">
				<span>{t("COMMON.VIEW")}</span>
			</td>
			<td className="align-middle">
				<span className="flex justify-end">
					<Button variant="plain" size="sm" className="ml-16">
						<Dropdown
							toggleIcon="Settings"
							options={options}
							onSelect={({ value }: any) =>
								onAction?.({ walletId: entity.wallet().id(), txId: entity.id(), action: value })
							}
						/>
					</Button>
				</span>
			</td>
		</tr>
	);
};