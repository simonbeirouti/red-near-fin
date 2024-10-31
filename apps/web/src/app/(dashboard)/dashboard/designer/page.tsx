// @ts-nocheck
"use client";

import {useState, useCallback, useRef, useEffect} from "react";
import {Card, CardContent} from "@repo/ui/card";
import {ScrollArea, ScrollBar} from "@repo/ui/scroll-area";
import {NFTPreview} from "@/components/nft-preview";
import {Button} from "@repo/ui/button";
import Image from "next/image";
import {Input} from "@repo/ui/input";
import {Label} from "@repo/ui/label";
import {Trash2Icon, ImageIcon, LockIcon, UnlockIcon} from "@repo/icons";
import {LayerPositionSelect} from "@/components/layer-position-select";
import {prepareNFTCollectionData} from "@/lib/nft-factory";
// import {Layer} from "@prisma/client";

interface StoredImage {
	path: string;
	filename: string;
}

interface LayerFolder {
	id: string;
	name: string;
	images: StoredImage[];
	order: number;
	locked?: boolean;
}

interface CollectionMetadata {
	name: string;
	symbol: string;
	description: string;
	size: number;
}

// function convertToLayerFormat(folder: LayerFolder): Layer {
// 	return {
// 		id: folder.id,
// 		name: folder.name,
// 		order: folder.order,
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		images: folder.images,
// 	};
// }

export default function NFTDesignerPage() {
	const [layerFolders, setLayerFolders] = useState<LayerFolder[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [metadata, setMetadata] = useState<CollectionMetadata>({
		name: "",
		symbol: "",
		description: "",
		size: 100,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load existing layers
	useEffect(() => {
		async function loadLayers() {
			try {
				const response = await fetch("/api/layers");
				const data = await response.json();

				const loadedLayers = data.map((layer: any) => ({
					id: layer.id,
					name: layer.name,
					order: layer.order,
					locked: layer.locked,
					images: layer.images.map((img: any) => ({
						path: img.path,
						filename: img.filename,
					})),
				}));

				setLayerFolders(loadedLayers);
			} catch (error) {
				console.error("Failed to load layers:", error);
			}
		}

		loadLayers();
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			setIsLoading(true);

			try {
				const items = Array.from(e.dataTransfer.items);

				const processEntry = async (entry: FileSystemEntry) => {
					if (entry.isDirectory) {
						const dirReader = (
							entry as FileSystemDirectoryEntry
						).createReader();
						const entries = await new Promise<FileSystemEntry[]>(
							(resolve) => {
								dirReader.readEntries((entries) =>
									resolve(entries)
								);
							}
						);

						const imageFiles: File[] = [];
						for (const fileEntry of entries) {
							if (fileEntry.isFile) {
								const file = await new Promise<File>(
									(resolve) => {
										(fileEntry as FileSystemFileEntry).file(
											(file) => resolve(file)
										);
									}
								);
								if (file.type.startsWith("image/")) {
									imageFiles.push(file);
								}
							}
						}

						if (imageFiles.length > 0) {
							const orderMatch = entry.name.match(/^(\d+)_/);
							const order = orderMatch
								? parseInt(orderMatch[1]) - 1
								: layerFolders.length;

							// Create FormData and append files
							const formData = new FormData();
							formData.append("name", entry.name);
							formData.append("order", order.toString());
							imageFiles.forEach((file) => {
								formData.append("images", file);
							});

							// Save to API
							const response = await fetch("/api/layers", {
								method: "POST",
								body: formData,
							});

							if (!response.ok) {
								throw new Error("Failed to save layer");
							}

							// Update state with the response
							const savedLayer = await response.json();
							setLayerFolders((prev) => [
								...prev,
								{
									id: savedLayer.id,
									name: entry.name,
									images: savedLayer.images,
									order: order,
								},
							]);
						}
					}
				};

				for (const item of items) {
					const entry = item.webkitGetAsEntry();
					if (entry) {
						await processEntry(entry);
					}
				}
			} catch (error) {
				console.error("Failed to save layer:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[layerFolders.length]
	);

	const handleOrderChange = async (folderId: string, newOrder: string) => {
		const folder = layerFolders.find(f => f.id === folderId);
		if (folder?.locked) {
			return; // Don't allow changes to locked layers
		}

		if (newOrder === "delete") {
			try {
				const response = await fetch(`/api/layers?id=${folderId}`, {
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error("Failed to delete layer");
				}

				setLayerFolders(prev => {
					const folderToDelete = prev.find(f => f.id === folderId);
					if (!folderToDelete) return prev;

					return prev
						.filter(f => f.id !== folderId)
						.map(folder => {
							if (folder.order > folderToDelete.order) {
								return { ...folder, order: folder.order - 1 };
							}
							return folder;
						})
						.sort((a, b) => a.order - b.order);
				});
			} catch (error) {
				console.error("Failed to delete layer:", error);
			}
			return;
		}

		const numOrder = parseInt(newOrder);
		try {
			// Update the order in the database
			const response = await fetch(`/api/layers?id=${folderId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					order: numOrder,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update layer order");
			}

			// Update local state
			setLayerFolders(prev => {
				const updatedFolders = [...prev];
				const currentFolder = updatedFolders.find(f => f.id === folderId);
				if (!currentFolder) return prev;

				const oldOrder = currentFolder.order;

				// Update all folders between old and new position
				updatedFolders.forEach(folder => {
					if (folder.id === folderId) {
						folder.order = numOrder;
					} else if (
						(oldOrder < numOrder && folder.order > oldOrder && folder.order <= numOrder) ||
						(oldOrder > numOrder && folder.order < oldOrder && folder.order >= numOrder)
					) {
						folder.order += oldOrder < numOrder ? -1 : 1;
					}
				});

				return updatedFolders.sort((a, b) => a.order - b.order);
			});
		} catch (error) {
			console.error("Failed to update layer order:", error);
		}
	};

	const handleLockLayer = async (
		folderId: string,
		currentLocked: boolean
	) => {
		try {
			const response = await fetch(`/api/layers?id=${folderId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					locked: !currentLocked,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update layer");
			}

			const updatedLayer = await response.json();

			setLayerFolders((prev) =>
				prev.map((folder) =>
					folder.id === folderId
						? {...folder, locked: updatedLayer.locked}
						: folder
				)
			);
		} catch (error) {
			console.error("Failed to update layer:", error);
		}
	};

	const FolderItem = ({
		folder,
		index,
	}: {
		folder: LayerFolder;
		index: number;
	}) => {
		return (
			<div className="md:col-span-2 bg-background dark:bg-background transform transition-all duration-300 ease-in-out p-2 rounded-md">
				<div className="flex flex-row justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						{folder.name}
					</h3>
					<div className="flex items-center gap-4">
						<Button
							onClick={() =>
								handleLockLayer(
									folder.id,
									folder.locked || false
								)
							}
							variant="ghost"
							size="icon"
							className={
								folder.locked
									? "text-primary"
									: "text-muted-foreground"
							}
						>
							{folder.locked ? (
								<LockIcon className="w-4 h-4" />
							) : (
								<UnlockIcon className="w-4 h-4" />
							)}
						</Button>
						<LayerPositionSelect
							totalLayers={layerFolders.length}
							folderIndex={index}
							onOrderChange={(newOrder) =>
								handleOrderChange(folder.id, newOrder)
							}
							disabled={folder.locked}
						/>
						<Button
							onClick={() =>
								handleOrderChange(folder.id, "delete")
							}
							className="text-black dark:text-white bg-destructive/40 dark:bg-destructive/40 hover:bg-destructive dark:hover:bg-destructive px-2"
							disabled={folder.locked}
						>
							<Trash2Icon className="w-5 h-5" />
						</Button>
					</div>
				</div>
				<ScrollArea className="w-full">
					<div className="flex gap-4">
						{folder.images.map((image, imageIndex) => (
							<Card
								key={imageIndex}
								className="flex-shrink-0 w-[150px] bg-gray-100 dark:bg-gray-800"
							>
								<CardContent className="p-2">
									<Image
										src={
											image instanceof File
												? URL.createObjectURL(image)
												: image.path
										}
										width={150}
										height={150}
										alt={`${folder.name} ${imageIndex + 1}`}
										className="w-full h-auto object-contain"
									/>
								</CardContent>
							</Card>
						))}
					</div>
					<ScrollBar orientation="horizontal" />
					<h1 className="mt-4 text-md text-gray-500 dark:text-gray-400">
						{folder.images.length} images
					</h1>
				</ScrollArea>
			</div>
		);
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;
		setIsLoading(true);

		try {
			// Group files by directory
			const filesByDirectory = Array.from(files).reduce((acc, file) => {
				const path = file.webkitRelativePath;
				const [dirName] = path.split("/");
				if (!acc[dirName]) {
					acc[dirName] = [];
				}
				if (file.type.startsWith("image/")) {
					acc[dirName].push(file);
				}
				return acc;
			}, {} as Record<string, File[]>);

			// Process each directory
			for (const [dirName, dirFiles] of Object.entries(
				filesByDirectory
			)) {
				if (dirFiles.length > 0) {
					const orderMatch = dirName.match(/^(\d+)_/);
					const order = orderMatch
						? parseInt(orderMatch[1]) - 1
						: layerFolders.length;

					const formData = new FormData();
					formData.append("name", dirName);
					formData.append("order", order.toString());
					dirFiles.forEach((file) => {
						formData.append("images", file);
					});

					const response = await fetch("/api/layers", {
						method: "POST",
						body: formData,
					});

					if (!response.ok) {
						throw new Error(`Failed to save layer ${dirName}`);
					}

					const savedLayer = await response.json();
					setLayerFolders((prev) => [
						...prev,
						{
							id: savedLayer.id,
							name: dirName,
							images: savedLayer.images,
							order: order,
						},
					]);
				}
			}
		} catch (error) {
			console.error("Failed to process folders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setMetadata((prev) => ({
			...prev,
			[name]: name === "size" ? parseInt(value) || 0 : value,
		}));
	};

	const handleGenerateCollection = async () => {
		try {
			setIsLoading(true);

			// Convert layerFolders to the format expected by prepareNFTCollectionData
			const layerData = layerFolders.map((folder) => ({
				name: folder.name,
				order: folder.order,
				images: folder.images.map((img) => ({
					path:
						img instanceof File
							? URL.createObjectURL(img)
							: img.path,
					filename: img instanceof File ? img.name : img.filename,
				})),
			}));

			const collectionData = await prepareNFTCollectionData(layerData);

			// Send the collection data to your API
			const response = await fetch("/api/nft-collection", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					metadata,
					collection: collectionData,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate collection");
			}

			const result = await response.json();
			console.log("Collection generated:", result);

			// Handle success (e.g., show success message, redirect to collection page)
		} catch (error) {
			console.error("Failed to generate collection:", error);
			// Handle error (e.g., show error message)
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen -ml-1.5 sm:-ml-0">
			<ScrollArea className="h-[calc(100vh-4rem)]">
				<div className="space-y-8">
					{/* Collection Metadata Form and Preview */}
					{/* <div className="grid gap-4 p-4 border rounded-lg bg-card">
						<div className="grid gap-8 md:grid-cols-2">
							<div className="space-y-4">
								<h2 className="text-2xl font-bold">
									Collection Details
								</h2>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name">
											Collection Name
										</Label>
										<Input
											id="name"
											name="name"
											value={metadata.name}
											onChange={handleMetadataChange}
											placeholder="My NFT Collection"
											className="bg-background text-foreground"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="symbol">Symbol</Label>
										<Input
											id="symbol"
											name="symbol"
											value={metadata.symbol}
											onChange={handleMetadataChange}
											placeholder="MYNFT"
											className="bg-background text-foreground"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="description">
											Description
										</Label>
										<Input
											id="description"
											name="description"
											value={metadata.description}
											onChange={handleMetadataChange}
											placeholder="Describe your collection..."
											className="bg-background text-foreground"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="size">
											Collection Size
										</Label>
										<Input
											id="size"
											name="size"
											type="number"
											value={metadata.size}
											onChange={handleMetadataChange}
											min={1}
											max={10000}
											className="bg-background text-foreground"
										/>
									</div>
									
									{layerFolders.length > 0 && (
										<div className="pb-8 space-y-4 h-full w-full">
											<div className="flex justify-center">
												<Button
													onClick={
														handleGenerateCollection
													}
													disabled={
														isLoading ||
														!metadata.name ||
														!metadata.symbol ||
														metadata.size < 1
													}
													className="w-full"
												>
													{isLoading
														? "Generating..."
														: "Generate Collection"}
												</Button>
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col items-center justify-center">
								<NFTPreview
									layerFolders={layerFolders.map(
										(folder) => ({
											...folder,
											images: folder.images,
										})
									)}
								/>
							</div>
						</div>
					</div> */}

					{/* Existing Layer Management UI */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div
							className="flex flex-col gap-2 bg-white dark:bg-gray-800 min-h-[100px] md:min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center text-center cursor-pointer md:col-span-2"
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
						>
							<Input
								type="file"
								ref={fileInputRef}
								onChange={handleFileSelect}
								className="hidden"
								// webkitdirectory=""
								// directory=""
								multiple
							/>
							<ImageIcon className="h-5 w-5" />
							<p className="text-gray-500 dark:text-gray-400">
								Drop folders here or click to select
							</p>
						</div>
						{layerFolders.map((folder, index) => (
							<FolderItem
								key={folder.id}
								folder={folder}
								index={index}
							/>
						))}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
