// @ts-nocheck

import {AlignLeftIcon} from "@repo/icons";

import {ScrollArea} from "@repo/ui/scroll-area";
import {Button} from "@repo/ui/button";
import {DialogTitle} from "@repo/ui/dialog";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@repo/ui/sheet";
import {NavMenu} from "@/components/navigation/navbar";
import {Logo} from "@/components/navigation/logo";
import PageMenu from "@/components/navigation/pagemenu";
import Link from "next/link";

export function Sidebar() {
	return (
		<aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-16 flex-col h-[94.5vh] overflow-y-auto">
			<ScrollArea className="py-4">
				<PageMenu />
			</ScrollArea>
		</aside>
	);
}

export function SheetLeft() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden flex">
					<AlignLeftIcon />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col gap-4 px-0" side="left">
				<DialogTitle className="sr-only">Menu</DialogTitle>
				<SheetHeader>
					<SheetClose className="px-5" asChild>
						<div>
							<Logo />
						</div>
					</SheetClose>
				</SheetHeader>
				<ScrollArea className="flex flex-col gap-4">
					<div className="flex flex-col gap-2.5 mt-3 mx-0 px-5">
						<NavMenu isSheet />
					</div>
					<div className="mx-0 px-5">
						<PageMenu isSheet />
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}