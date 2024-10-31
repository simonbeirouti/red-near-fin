// @ts-nocheck
"use client";

import { usePathname } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";
import { links, NavSection } from "@/components/app-sidebar";

export default function BreadcrumbPath() {
	const pathname = usePathname();
	const navData: NavSection[] = links;

	// Find the current page title
	const getCurrentPageTitle = () => {
		for (const section of navData) {
			const matchedItem = section.items.find(item => item.url === pathname);
			if (matchedItem) {
				return matchedItem.title;
			}
		}
		return null;
	};

	const currentPageTitle = getCurrentPageTitle();

	return (
		<Breadcrumb className='flex justify-between'>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
				</BreadcrumbItem>
				
				{currentPageTitle && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{currentPageTitle}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
