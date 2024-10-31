// @ts-nocheck
"use client";

import {Badge} from "@repo/ui/badge";
import {Button} from "@repo/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@repo/ui/accordion";
import {useEffect, useState} from "react";
import {SearchLayout} from "@/components/search-layout";
import {useSearch} from "@/store/use-search";
import {HeartIcon} from "@repo/icons";

interface Proposal {
	title: string;
	description: string;
	tags: string[];
	likes: number;
	votes: {yes: number; no: number};
	image?: string;
}

const proposals: Proposal[] = [
	{
		title: "Proposal 1",
		description:
			"Description for Proposal 1 - This is an extended description to increase length and provide more details about the proposal.",
		tags: ["finance", "governance"],
		likes: 156,
		votes: {yes: 30, no: 50},
		// image: "https://example.com/image1.jpg"
	},
	{
		title: "Proposal 2",
		description:
			"Description for Proposal 2 - This is an extended description to increase length and provide more details about the proposal.",
		tags: ["community", "events"],
		likes: 89,
		votes: {yes: 0, no: 0},
		// image: "https://example.com/image2.jpg"
	},
	{
		title: "Proposal 3",
		description:
			"Description for Proposal 3 - This is an extended description to increase length and provide more details about the proposal.",
		tags: ["finance", "development"],
		likes: 234,
		votes: {yes: 0, no: 0},
		// image: "https://example.com/image3.jpg"
	},
	{
		title: "Proposal 4",
		description:
			"Description for Proposal 4 - This is an extended description to increase length and provide more details about the proposal.",
		tags: ["governance", "community"],
		likes: 67,
		votes: {yes: 0, no: 0},
		// image: "https://example.com/image4.jpg"
	},
];

export default function ProposalsPage() {
	const [filteredProposals, setFilteredProposals] =
		useState<Proposal[]>(proposals);
	const {reset} = useSearch();

	useEffect(() => {
		return () => reset();
	}, [reset]);

	return (
		<SearchLayout
			data={proposals}
			onDataFiltered={setFilteredProposals}
			tags={Array.from(
				new Set(proposals.flatMap((proposal) => proposal.tags))
			)}
		>
			<div className="gap-4">
				{filteredProposals.map((proposal, index) => (
					<ProposalCard key={index} proposal={proposal} />
				))}
			</div>
		</SearchLayout>
	);
}

function ProposalCard({proposal}: {proposal: Proposal}) {
	const totalVotes = proposal.votes.yes + proposal.votes.no;
	const yesPercentage =
		totalVotes === 0
			? 0
			: Math.round((proposal.votes.yes / totalVotes) * 100);
	const noPercentage =
		totalVotes === 0
			? 0
			: Math.round((proposal.votes.no / totalVotes) * 100);

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value={proposal.title}>
				<AccordionTrigger>
					<div className="flex justify-between items-center w-full">
						<h3 className="text-xl font-bold tracking-tight underline">
							{proposal.title}
						</h3>
						<div className="flex items-center gap-1 text-muted-foreground mr-4">
							{proposal.tags.map(
								(tag: string, tagIndex: number) => (
									<Badge
										key={tagIndex}
										variant="secondary"
										className="bg-secondary/50 text-md"
									>
										{tag}
									</Badge>
								)
							)}
							<HeartIcon className="w-4 h-4 text-red-500" />
							<span className="text-lg">{proposal.likes}</span>
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent>
					<p className="text-md text-muted-foreground">
						{proposal.description}
					</p>
					<div className="flex flex-col items-center justify-between pt-4">
						<div className="w-full">
							<div className="bg-gray-200 h-4 rounded-lg flex overflow-hidden">
								<div
									className="bg-green-500 h-full"
									style={{width: `${yesPercentage}%`}}
								></div>
								<div
									className="bg-red-500 h-full"
									style={{width: `${noPercentage}%`}}
								></div>
							</div>
							<div className="text-sm text-gray-500 my-4">
								Total Votes: {totalVotes} ({yesPercentage}% Yes,{" "}
								{noPercentage}% No)
							</div>
						</div>
						<div className="flex gap-2 w-full">
							<Button className="w-full bg-green-500 dark:bg-green-700 light:bg-green-300">
								Vote yes
							</Button>
							<Button className="w-full bg-red-500 dark:bg-red-700 light:bg-red-300">
								Vote no
							</Button>
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
