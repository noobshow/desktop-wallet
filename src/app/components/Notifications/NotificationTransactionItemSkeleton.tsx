import { Circle } from "app/components/Circle";
import { Skeleton } from "app/components/Skeleton";
import { TableCell, TableRow } from "app/components/Table";
import { useRandomNumber } from "app/hooks";
import React from "react";

export const NotificationTransactionItemSkeleton = () => {
	const recipientWidth = useRandomNumber(120, 150);
	const amountWidth = useRandomNumber(100, 130);

	return (
		<TableRow
			data-testid="NotificationTransactionItemSkeleton"
			className="border-b border-dotted last:border-b-0 border-theme-neutral-300 dark:border-theme-neutral-800"
		>
			<TableCell variant="start" innerClassName="space-x-3" noHover isCompact>
				<div className="flex items-center -space-x-1">
					<Circle className="leading-none border-transparent" size="sm">
						<Skeleton circle height={32} width={32} />
					</Circle>
					<Circle className="leading-none border-transparent" size="sm">
						<Skeleton circle height={32} width={32} />
					</Circle>
				</div>

				<Skeleton height={16} width={recipientWidth} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end" noHover isCompact>
				<span className="flex items-center px-2 space-x-1 border rounded h-7 border-theme-neutral-300 dark:border-theme-neutral-800">
					<Skeleton height={16} width={amountWidth} />
					<Skeleton height={16} width={35} />
				</span>
			</TableCell>
		</TableRow>
	);
};
