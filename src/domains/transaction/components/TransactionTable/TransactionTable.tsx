import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TransactionCompactRow } from "./TransactionRow/TransactionCompactRow";
import { TransactionRow } from "./TransactionRow/TransactionRow";

type Props = {
	transactions: ExtendedTransactionData[];
	exchangeCurrency?: string;
	showSignColumn?: boolean;
	showExplorerLinkColumn?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
	onRowClick?: (row: ExtendedTransactionData) => void;
	isLoading?: boolean;
	skeletonRowsLimit?: number;
};

export const TransactionTable = ({
	transactions,
	exchangeCurrency,
	showSignColumn,
	showExplorerLinkColumn,
	hideHeader,
	isCompact,
	onRowClick,
	isLoading,
	skeletonRowsLimit,
}: Props) => {
	const { t } = useTranslation();

	const commonColumns: any = [
		{
			Header: t("COMMON.DATE"),
			accessor: (transaction: ExtendedTransactionData) => transaction.timestamp?.()?.toUNIX(),
			cellWidth: "w-50",
		},
		{
			Header: t("COMMON.RECIPIENT"),
			className: "ml-25",
			cellWidth: "w-96",
		},
		{
			Header: t("COMMON.INFO"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.STATUS"),
			className: "justify-center",
			minimumWidth: true,
		},
		{
			Header: t("COMMON.AMOUNT"),
			accessor: (transaction: ExtendedTransactionData) => transaction.total?.().toHuman(),
			className: "justify-end",
		},
	];

	const columns = useMemo(() => {
		if (isCompact) {
			return [
				{
					Header: t("COMMON.RECIPIENT"),
				},
				{
					Header: t("COMMON.AMOUNT"),
					accessor: (transaction: ExtendedTransactionData) => transaction.total?.().toHuman(),
					className: "justify-end",
				},
			];
		}

		if (showExplorerLinkColumn) {
			commonColumns.unshift({
				Header: t("COMMON.ID"),
				minimumWidth: true,
			});
		}

		if (exchangeCurrency) {
			return [
				...commonColumns,
				{ Header: t("COMMON.CURRENCY"), className: "justify-end float-right", cellWidth: "w-24" },
			];
		}

		if (showSignColumn) {
			return [...commonColumns, { Header: "Sign", className: "invisible", cellWidth: "w-24" }];
		}

		return commonColumns;
	}, [commonColumns, exchangeCurrency, showExplorerLinkColumn, showSignColumn, isCompact, t]);

	const showSkeleton = useMemo(() => isLoading && transactions.length === 0, [transactions, isLoading]);

	const skeletonRows = new Array(skeletonRowsLimit).fill({});
	const data = showSkeleton ? skeletonRows : transactions;

	return (
		<div data-testid="TransactionTable" className="relative">
			<Table hideHeader={hideHeader} columns={columns} data={data}>
				{(row: ExtendedTransactionData) =>
					isCompact ? (
						<TransactionCompactRow onClick={() => onRowClick?.(row)} transaction={row} />
					) : (
						<TransactionRow
							isLoading={showSkeleton}
							onClick={() => onRowClick?.(row)}
							transaction={row}
							exchangeCurrency={exchangeCurrency}
							showExplorerLink={showExplorerLinkColumn}
							showSignColumn={showSignColumn}
							isSignaturePending={row.isMultiSignature && showSignColumn}
						/>
					)
				}
			</Table>
		</div>
	);
};

TransactionTable.defaultProps = {
	showSignColumn: false,
	showExplorerLinkColumn: true,
	isCompact: false,
	hideHeader: false,
	isLoading: false,
	skeletonRowsLimit: 8,
};
