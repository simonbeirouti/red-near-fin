"use client";

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {NearProvider} from "@repo/near";
import {ThemeProvider} from "@repo/theme";
import {BitteProvider} from "@repo/mintbase";
import {Navbar} from "@/components/navigation/navbar";
import {Footer} from "@/components/navigation/footer";

const geistSans = localFont({
	src: "../../public/fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});
const geistMono = localFont({
	src: "../../public/fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<BitteProvider>
						<NearProvider>
							<Navbar />
							<main className="px-5 sm:px-8 h-auto">
								{children}
							</main>
							<Footer />
						</NearProvider>
					</BitteProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}