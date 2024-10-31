// @ts-nocheck
"use client";

import {ChevronRight, type LucideIcon} from "@repo/icons";
import Link from "next/link";
import Image from "next/image";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@repo/ui/shadcn-sidebar";
import { NavSection } from "@/components/app-sidebar";

interface NavItemProp {
	title?: string;
	name?: string;
	image?: string;
	url?: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: NavItemProp[];
}

interface NavProps {
	links: NavSection[];
}

export function DynamicNav({links}: NavProps) {
	return (
		<>
			{links.map((section) => (
				<SidebarGroup key={section.label}>
					<SidebarGroupLabel>{section.label}</SidebarGroupLabel>
					<SidebarMenu className="gap-2">
						{Array.isArray(section.items) && section.items.map((item) => (
							<NavItemComponent
								key={item.title || item.name}
								item={item}
							/>
						))}
					</SidebarMenu>
				</SidebarGroup>
			))}
		</>
	);
}

function NavItemComponent({
	item,
}: {
	item: NavItemProp;
}) {
	const title = item.title || item.name || "";

	if (item.items && item.items.length > 0) {
		return (
			<Collapsible
				key={title}
				asChild
				defaultOpen={item.isActive}
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton tooltip={title}>
							<div className="flex items-center gap-2 w-full">
								{item.icon && (
									<item.icon className="h-4 w-4 shrink-0" />
								)}
								<span className="truncate">{title}</span>
								<ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							</div>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent className="ml-4">
						<SidebarMenuSub>
							{item.items.map((subItem) => (
								<SidebarMenuSubItem
									key={subItem.title || subItem.name}
								>
									<SidebarMenuSubButton asChild>
										<Link 
											href={subItem.url || ""}
											className="flex items-center gap-2 w-full py-2"
										>
											{subItem.icon && (
												<subItem.icon className="h-4 w-4 shrink-0" />
											)}
											<span className="truncate">
												{subItem.title || subItem.name}
											</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		);
	}

	return (
		<SidebarMenuItem key={title}>
			<SidebarMenuButton asChild tooltip={title}>
				<Link 
					className="flex items-center gap-3 w-full" 
					href={item.url || ""}
				>
					{item.icon && (
						<item.icon className="h-5 w-5 shrink-0" />
					)}
					{item.image && (
						<div className="h-5 w-5 relative overflow-hidden rounded-full shrink-0">
							<Image
								src={item.image}
								alt={title}
									fill
									className="object-cover"
								/>
						</div>
					)}
					<span className="truncate">{title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
