// @ts-nocheck
import {Users} from "@repo/icons";
import {Card, CardContent, CardHeader, CardTitle} from "@repo/ui/card";

export default function DashboardPage() {
	return (
		<>
			<Data />
		</>
	);
}

function Data() {
	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
			<Card className="bg-blue-50 dark:bg-blue-900 col-span-1 h-48 flex flex-col justify-center relative overflow-hidden">
				<CardHeader className="z-10">
					<CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
						Total Users
					</CardTitle>
				</CardHeader>
				<CardContent className="z-10">
					<div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
						15,231
					</div>
					<p className="text-sm text-blue-600 dark:text-blue-400">
						+2.5% from last month
					</p>
				</CardContent>
				<Users className="absolute right-0 top-0 h-full w-auto text-blue-200 dark:text-blue-700" />
			</Card>

			<Card className="bg-blue-50 dark:bg-blue-900 col-span-1 h-48 flex flex-col justify-center relative overflow-hidden">
				<CardHeader className="z-10">
					<CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
						Total Users
					</CardTitle>
				</CardHeader>
				<CardContent className="z-10">
					<div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
						15,231
					</div>
					<p className="text-sm text-blue-600 dark:text-blue-400">
						+2.5% from last month
					</p>
				</CardContent>
				<Users className="absolute right-0 top-0 h-full w-auto text-blue-200 dark:text-blue-700" />
			</Card>
		</div>
	);
}
