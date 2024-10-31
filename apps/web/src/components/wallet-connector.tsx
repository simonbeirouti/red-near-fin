// @ts-nocheck
"use client";

import {useBitteWallet} from "@repo/mintbase";
import {Button} from "@repo/ui/button";
import Link from "next/link";

export const NearWalletConnector = () => {
	const {isConnected, connect} = useBitteWallet();

	const handleSignIn = async () => {
		return connect();
	};

	if (!isConnected) {
		return <Button onClick={handleSignIn}>Connect To NEAR</Button>;
	}

	return (
		<Link href="/dashboard">
			<Button>Dashboard</Button>
		</Link>
	);
};
