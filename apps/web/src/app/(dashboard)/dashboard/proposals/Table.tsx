import {promises as fs} from "fs";
import path from "path";
import {Metadata} from "next";
import {z} from "zod";

import {columns} from "@/components/table/components/columns";
import {DataTable} from "@/components/table/components/data-table";
import {taskSchema} from "@/components/table/data/schema";

export const metadata: Metadata = {
	title: "Tasks",
	description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getTasks() {
	const data = await fs.readFile(
		path.join(process.cwd(), "src/components/table/data/tasks.json")
	);

	const tasks = JSON.parse(data.toString());

	return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
	const tasks = await getTasks();

	return (
		<div className="flex flex-col w-full h-full overflow-hidden">
			<DataTable data={tasks} columns={columns} />
		</div>
	);
}
