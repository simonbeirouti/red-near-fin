// @ts-nocheck
"use client";

import {useEffect, useState} from "react";
import {Card, CardContent} from "@repo/ui/card";
import Image from "next/image";
import {useSearch} from "@/store/use-search";
import {SearchLayout} from "@/components/search-layout";

interface Member {
	title: string;
	description: string;
	tags: string[];
	image?: string;
}

const members: Member[] = [
	{
		title: "Member 1",
		description: "Description for Member 1",
		tags: ["core", "developer"],
		image: "/digitalhumanoid.png",
	},
	{
		title: "Member 2",
		description: "Description for Member 2",
		tags: ["community", "events"],
		image: "/maratus.png",
	},
	{
		title: "Member 3",
		description: "Description for Member 3",
		tags: ["core", "developer"],
		image: "/maratus.png",
	},
	{
		title: "Proposal 4",
		description: "Description for Member 4",
		tags: ["community", "events"],
		image: "/robotboy.png",
	},
];

export default function MembersPage() {
	const [filteredMembers, setFilteredMembers] = useState<Member[]>(members);
	const {reset} = useSearch();

	// Reset search state when component unmounts
	useEffect(() => {
		return () => reset();
	}, [reset]);

	return (
		<SearchLayout
			data={members}
			onDataFiltered={setFilteredMembers}
			tags={Array.from(new Set(members.flatMap((member) => member.tags)))}
		>
			<div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
				{filteredMembers.map((member, index) => (
					<MemberCard key={index} member={member} />
				))}
			</div>
		</SearchLayout>
	);
}

function MemberCard({member}: {member: Member}) {
	return (
		<Card className="relative flex flex-col justify-center items-center h-48 overflow-hidden border-2 border-border transition-all duration-300 ease-in-out bg-card hover:bg-card/80 dark:bg-card/80 dark:hover:bg-card/60 hover:-translate-y-1 group">
			{member.image && (
				<Image
					src={member.image}
					alt={member.title}
					width={250}
					height={250}
					className="absolute object-cover w-full h-full inset-0 z-0"
				/>
			)}
			<div
				className={`absolute inset-0 z-10 ${
					member.image
						? "bg-black bg-opacity-30"
						: ""
				}`}
			></div>
			<CardContent className="relative z-20 flex flex-col items-center justify-center p-6">
				<div
					className={`text-lg font-medium mb-2 transform transition-all duration-300 ease-in-out opacity-30 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 ${
						member.image ? "text-white" : "text-foreground"
					}`}
				>
					{member.title}
				</div>
			</CardContent>
		</Card>
	);
}