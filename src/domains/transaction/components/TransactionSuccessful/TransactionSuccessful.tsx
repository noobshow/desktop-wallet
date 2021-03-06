import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Header } from "app/components/Header";
import {
	TransactionExplorerLink,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type TransactionSuccessfulProps = {
	children?: React.ReactNode;
	transaction?: Contracts.SignedTransactionData;
	senderWallet?: ReadWriteWallet;
};

const { TransactionSuccessfulBanner } = images.transaction.common;

export const TransactionSuccessful = ({ children, transaction, senderWallet }: TransactionSuccessfulProps) => {
	const { t } = useTranslation();

	return (
		<section data-testid="TransactionSuccessful" className="space-y-8">
			<Header title={t("TRANSACTION.SUCCESS.TITLE")} />

			<TransactionSuccessfulBanner className="w-full" />

			<p className="text-theme-secondary-text">{t("TRANSACTION.SUCCESS.DESCRIPTION")}</p>

			<div>
				{senderWallet && transaction && (
					<>
						<TransactionExplorerLink
							id={transaction.id()}
							link={senderWallet.coin().link().transaction(transaction.id())}
							border={false}
							paddingPosition="bottom"
						/>

						<TransactionNetwork network={senderWallet.network()} />

						<TransactionSender
							address={senderWallet.address()}
							alias={senderWallet.alias()}
							isDelegate={senderWallet.isDelegate() && !senderWallet.isResignedDelegate()}
						/>
					</>
				)}

				{children}
			</div>
		</section>
	);
};
