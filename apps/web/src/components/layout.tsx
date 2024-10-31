// @ts-nocheck
"use client";

import React from "react";
import {BoxIcon, Menu} from "@repo/icons";
import {Button} from "@repo/ui/button";
import {NearWalletConnector} from "@/components/wallet-connector";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {ModeToggle} from "./mode-toggle";
import {Sheet, SheetContent, SheetTrigger} from "@repo/ui/sheet";

export function Layout({children}: {children: React.ReactNode}) {
	const pathname = usePathname();
	const showHeader = !pathname?.startsWith("/dashboard");

	return (
		<>
			{showHeader && (
				<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="container mx-auto flex h-14 items-center justify-between px-4">
						<div className="flex items-center gap-2">
							<BoxIcon className="h-6 w-6" />
							<span className="font-bold">DeFi App</span>
						</div>
						<div className="flex items-center gap-4">
							<div className="md:hidden">
								<Sheet>
									<SheetTrigger asChild>
										<Button variant="outline" size="icon">
											<Menu className="h-5 w-5" />
										</Button>
									</SheetTrigger>
									<SheetContent side="top" className="w-full">
										<div className="flex flex-col gap-4">
											<Link href="/about" className="w-full">
												<Button
													variant="ghost"
													className="w-full justify-start"
												>
													About
												</Button>
											</Link>
											<Link
												href="/contact"
												className="w-full"
											>
												<Button
													variant="ghost"
													className="w-full justify-start"
												>
													Contact
												</Button>
											</Link>
											<NearWalletConnector />
										</div>
									</SheetContent>
								</Sheet>
							</div>
							<div className="hidden md:flex items-center gap-4">
								<Link href="/about">
									<Button variant="ghost">About</Button>
								</Link>
								<Link href="/contact">
									<Button variant="ghost">Contact</Button>
								</Link>
								<NearWalletConnector />
							</div>
							<ModeToggle />
						</div>
					</div>
				</header>
			)}
			<main className="flex-1">{children}</main>
			{showHeader && (
				<footer className="border-t py-6">
					<div className="container mx-auto flex justify-between items-center px-4">
						<span className="text-sm text-muted-foreground">
							© 2024 DeFi App. All rights reserved.
						</span>
						<div className="flex gap-4">
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Terms
							</Link>
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Privacy
							</Link>
						</div>
					</div>
				</footer>
			)}
		</>
	);
}
