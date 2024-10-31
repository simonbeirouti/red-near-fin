// @ts-nocheck
import { Button } from "@repo/ui/button";
import {Card, CardContent} from "@repo/ui/card";
import Link from "next/link";

export default function LandingPage() {
	return (
		<>
			<section className="py-20 md:py-32 flex justify-center items-center px-4">
				<div className="container flex flex-col items-center text-center gap-4">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
						The Future of{" "}
						<span className="text-primary">
							Decentralized Finance
						</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-[600px] md:text-2xl">
						Trade, earn and grow your crypto assets in a secure
						decentralized environment
					</p>
					<div className="flex gap-4 mt-6">
						<Link href="/dashboard">
							<Button size="lg">Get Started</Button>
						</Link>
						<Button size="lg" variant="outline">
							Learn More
						</Button>
					</div>
				</div>
			</section>

			<section className="py-20 bg-muted/50 flex justify-center items-center px-4">
				<div className="container">
					<div className="grid gap-8 md:grid-cols-3">
						<Card>
							<CardContent className="pt-6">
								<h3 className="text-2xl font-bold mb-2">
									Trade
								</h3>
								<p className="text-muted-foreground">
									Swap tokens instantly with deep
									liquidity and minimal slippage
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<h3 className="text-2xl font-bold mb-2">
									Earn
								</h3>
								<p className="text-muted-foreground">
									Provide liquidity and earn rewards
									through yield farming
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<h3 className="text-2xl font-bold mb-2">
									Stake
								</h3>
								<p className="text-muted-foreground">
									Stake your tokens to earn passive income
									and governance rights
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</>
	);
}
