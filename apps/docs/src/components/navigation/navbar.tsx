// @ts-nocheck
"use client";

import Link from "next/link";
import {Logo} from "@/components/navigation/logo";
import {ExternalLink, Github, LogIn, LogOut} from "@repo/icons";
import {ModeToggle} from "@/components/navigation/theme-toggle";
import {SheetLeft} from "@/components/navigation/sidebar";
import Search from "@/components/navigation/search";
import Anchor from "@/components/navigation/anchor";
import {Navigations, GitHubLink} from "@/settings/navigation";
import {Button, buttonVariants} from "@repo/ui/button";
import {SheetClose} from "@repo/ui/sheet";
import {useBitteWallet} from "@repo/mintbase";

export function Navbar() {
	const {isConnected, selector, connect} = useBitteWallet();
	const handleSignout = async () => {
		const wallet = await selector.wallet();
		return wallet.signOut();
	};

	const handleSignIn = async () => {
		return connect();
	};

	const handleClick = () => {
		if (isConnected) {
			handleSignout();
		} else {
			handleSignIn();
		}
	};

	return (
		<nav className="sticky top-0 z-50 w-full h-16 border-b backdrop-filter backdrop-blur-xl bg-opacity-5 md:px-4 px-2">
			<div className="mx-auto flex h-full items-center justify-between p-1 sm:p-3 md:gap-2">
				<div className="flex items-center gap-5">
					<SheetLeft />
					<div className="flex items-center gap-6">
						<div className="hidden md:flex">
							<Logo />
						</div>
						<div className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
							<NavMenu />
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Search />
					<div className="flex sm:ml-0 gap-2">
						{GitHubLink.href && (
							<Link
								href={GitHubLink.href}
								className={buttonVariants({
									variant: "outline",
									size: "icon",
								})}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="View the repository on GitHub"
							>
								<Github className="w-[1.1rem] h-[1.1rem]" />
							</Link>
						)}
						<ModeToggle />
						<Button
              onClick={handleClick}
              variant="outline"
							className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
								isConnected
									? "bg-white text-black hover:bg-gray-100"
									: "bg-black text-white hover:bg-gray-900"
							}`}
						>
							{isConnected ? (
								<>
									<LogOut className="h-4 w-4" />
									<span>Sign Out</span>
								</>
							) : (
								<>
									<LogIn className="h-4 w-4" />
									<span>Sign In</span>
								</>
							)}
						</Button>

						<Button
							onClick={handleClick}
							variant="outline"
							className={`md:hidden p-2 rounded-md ${
								isConnected
									? "bg-white text-black"
									: "bg-black text-white"
							}`}
						>
							{isConnected ? (
								<LogOut className="h-4 w-4" />
							) : (
								<LogIn className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}

export function NavMenu({isSheet = false}) {
	return (
		<>
			{Navigations.map((item) => {
				const Comp = (
					<Anchor
						key={item.title + item.href}
						activeClassName="font-bold text-primary"
						absolute
						className="flex items-center gap-1 text-sm"
						href={item.href}
						target={item.external ? "_blank" : undefined}
						rel={item.external ? "noopener noreferrer" : undefined}
					>
						{item.title}{" "}
						{item.external && (
							<ExternalLink
								className="w-3 h-3 align-super"
								strokeWidth={3}
							/>
						)}
					</Anchor>
				);
				return isSheet ? (
					<SheetClose key={item.title + item.href} asChild>
						{Comp}
					</SheetClose>
				) : (
					Comp
				);
			})}
		</>
	);
}
