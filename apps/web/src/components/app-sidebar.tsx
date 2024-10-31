// @ts-nocheck
"use client";

import * as React from "react";
import {
	Bitcoin,
	Contact,
	BookOpenText,
	Image,
	BadgeDollarSign,
	LucideIcon,
} from "@repo/icons";

import {NavUser} from "@/components/nav-user";
import {DashboardHeader} from "@/components/dashboard-header";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@repo/ui/shadcn-sidebar";
import {DynamicNav} from "@/components/dynamic-nav";

export interface NavSection {
	label: string;
	items: NavItem[];
}

interface NavItem {
	title?: string;
	name?: string;
	url?: string;
	icon?: LucideIcon;
}

const addDashboardPrefix = (url: string) => `/dashboard${url}`;


export const links: NavSection[] = [
	{
		label: "Main",
		items: [
			{
				title: "Proposals",
				url: addDashboardPrefix("/proposals"),
				icon: BookOpenText,
			},
			{
				title: "Members",
				url: addDashboardPrefix("/members"),
				icon: Contact,
			},
			{
				title: "Designer",
				url: addDashboardPrefix("/designer"),
				icon: Image,
			},
			{
				title: "Auction",
				url: addDashboardPrefix("/auction"),
				icon: BadgeDollarSign,
			},
			{
				title: "Token",
				url: addDashboardPrefix("/token"),
				icon: Bitcoin,
				// isActive: pathname.startsWith('/'),
				// items: [
				// 	{
				// 		title: "General",
				// 		url: "/keys/general",
				// 	},
				// 	{
				// 		title: "Team",
				// 		url: "/keys/team",
				// 	},
				// 	{
				// 		title: "Billing",
				// 		url: "/keys/billing",
				// 	},
				// 	{
				// 		title: "Limits",
				// 		url: "/keys/limits",
				// 	},
				// ],
			},
		],
	},
];

const projects = [
	{
		name: "Bitconnect",
		url: "/projects/bitconnect",
		image: "/bcc.jpg",
	},
];

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" className="ml-1" collapsible="icon" {...props}>
			<SidebarHeader>
				<DashboardHeader projects={projects} />
			</SidebarHeader>
			<SidebarContent>
				<DynamicNav links={links} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
