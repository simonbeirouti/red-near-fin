// @ts-nocheck
"use client";

import {useState} from "react";
import {Box, Plus, ChevronsUpDown} from "lucide-react";
// import { useBitteWallet } from "@mintbase-js/react"
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/shadcn-sidebar";

interface DashboardHeaderProps {
	name: string;
	url: string;
	image: string;
}

export function DashboardHeader({
	projects,
}: {
	projects: DashboardHeaderProps[];
}) {
	const [activeTeam, setActiveTeam] = useState(
		projects?.length > 0 ? projects[0] : null
	);
	const {state, isMobile} = useSidebar();
	// const { isConnected, activeAccountId } = useBitteWallet()

	return (
		<SidebarMenu>
			{projects.length === 0 && (
				<SidebarMenuButton
					size="lg"
					className="bg-secondary hover:bg-secondary/80 justify-start flex"
				>
					<div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-black text-primary-foreground dark:bg-white dark:text-primary-foreground ml-1">
						<Box className="h-5 w-5 text-primary-foreground" />
					</div>
					{state === "expanded" && !isMobile && (
						<div className="flex flex-col overflow-hidden min-w-0 ml-1">
							<span className="text-sm font-bold whitespace-nowrap overflow-x-auto scrollbar-hide text-black dark:text-white">
								Create DAO
							</span>
						</div>
					)}
				</SidebarMenuButton>
			)}
			{projects.length > 0 && (
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									{activeTeam?.image && (
										<Image
											width={32}
											height={32}
											src={activeTeam.image}
											alt={activeTeam.name}
											className={`size-4 rounded-full ${
												state !== "expanded"
													? "ml-1.5"
													: ""
											}`}
										/>
									)}
								</div>
								{state === "expanded" && (
									<>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{activeTeam?.name}
											</span>
										</div>

										<ChevronsUpDown className="ml-auto" />
									</>
								)}
							</SidebarMenuButton>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							className="w-64 sm:w-56 ml-2 md:ml-0 rounded-lg"
							align="start"
							side="bottom"
							sideOffset={4}
							avoidCollisions
						>
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Launched DAOs
							</DropdownMenuLabel>
							{projects.map((project, index) => (
								<DropdownMenuItem
									key={project.name}
									onClick={() => setActiveTeam(project)}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-sm border">
										{project.image && (
											<Image
												width={32}
												height={32}
												src={project.image}
												alt={project.name}
												className="size-4 shrink-0"
											/>
										)}
									</div>
									{project.name}
									<DropdownMenuShortcut>
										⌘{index + 1}
									</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Create DAO
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			)}
		</SidebarMenu>
	);
}
