"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GlowingSphere from "@/components/GlowingSphere";

interface Message {
	id: string;
	query: string;
	response: string;
	timestamp: number;
}

export default function Home() {
	const [input, setInput] = useState("");
	const [mounted, setMounted] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load chat history from session storage on mount
	useEffect(() => {
		setMounted(true);
		const savedMessages = sessionStorage.getItem("chatHistory");
		if (savedMessages) {
			try {
				setMessages(JSON.parse(savedMessages));
			} catch (error) {
				console.error("Failed to load chat history:", error);
			}
		}
	}, []);

	// Save chat history to session storage whenever messages change
	useEffect(() => {
		if (messages.length > 0) {
			sessionStorage.setItem("chatHistory", JSON.stringify(messages));
		}
	}, [messages]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!input.trim() || isLoading) return;

			const userQuery = input.trim();
			setInput("");
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					"https://n8n.macandcode.cloud/webhook/bf4dd093-bb02-472c-9454-7ab9af97bd1d",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Basic " + btoa("tanish:tanish28"),
						},
						body: JSON.stringify({ query: userQuery }),
					},
				);

				if (!response.ok) {
					throw new Error(`Server error: ${response.status}`);
				}

				const data = await response.json();

				// Extract the response text from the deeply nested structure
				let responseText = "";

				// Recursive function to find the 'output' field
				const findOutput = (obj: unknown): string | null => {
					if (typeof obj === "string") {
						return obj;
					}
					if (typeof obj === "object" && obj !== null) {
						// Check if this object has an 'output' field
						if ("output" in obj && typeof obj.output === "string") {
							return obj.output;
						}
						// Recursively search in nested objects
						for (const key in obj) {
							const value = (obj as Record<string, unknown>)[key];
							const result = findOutput(value);
							if (result) return result;
						}
					}
					return null;
				};

				// Try standard fields first
				if (data.response) {
					responseText = data.response;
				} else if (data.answer) {
					responseText = data.answer;
				} else if (data.output) {
					responseText = data.output;
				} else {
					// Search recursively for output field
					const foundOutput = findOutput(data);
					responseText = foundOutput || JSON.stringify(data, null, 2);
				}

				if (responseText?.trim()) {
					const newMessage: Message = {
						id: Date.now().toString(),
						query: userQuery,
						response: responseText,
						timestamp: Date.now(),
					};

					setMessages((prev) => [...prev, newMessage]);
				}
			} catch (err) {
				console.error("Error calling webhook:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to get response. Please try again.",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[input, isLoading],
	);

	const hasMessages = useMemo(
		() => messages.length > 0 || isLoading,
		[messages.length, isLoading],
	);

	if (!mounted) return null;

	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-black">
			{/* Main Content */}
			<div
				className={`relative z-10 flex min-h-screen flex-col items-center px-4 py-8 transition-all duration-700 ${hasMessages ? "justify-start pt-16" : "justify-center"}`}
			>
				{/* Glowing Sphere - scales down when messages appear */}
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{
						scale: hasMessages ? 0.5 : 1,
						opacity: hasMessages ? 0.4 : 1,
						y: hasMessages ? -20 : 0,
					}}
					transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
					className="mb-6 sm:mb-8 md:mb-10"
				>
					<GlowingSphere />
				</motion.div>

				{/* "Ask Me Anything" Text - hides when messages appear */}
				<AnimatePresence>
					{!hasMessages && (
						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{
								duration: 1,
								delay: 0.5,
								ease: [0.25, 0.1, 0.25, 1],
							}}
							className="mb-8 px-4 text-center text-3xl font-bold tracking-tight text-white sm:mb-10 sm:text-4xl md:mb-12 md:text-5xl lg:text-6xl"
						>
							<span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
								Ask Me Anything
							</span>
						</motion.h1>
					)}
				</AnimatePresence>

				{/* Messages Display */}
				<AnimatePresence mode="popLayout">
					{hasMessages && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="mb-6 w-full max-w-6xl space-y-4 px-2"
						>
							{messages.map((message, index) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 20, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{ duration: 0.4, delay: index * 0.1 }}
									className="space-y-3"
								>
									{/* User Query */}
									<div className="flex justify-end">
										<div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-4 py-3 backdrop-blur-sm">
											<p className="text-sm text-white md:text-base">
												{message.query}
											</p>
										</div>
									</div>

									{/* AI Response */}
									<div className="flex justify-start">
										<div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-background/60 border border-purple-500/20 px-4 py-3 backdrop-blur-sm">
											<div className="prose prose-invert prose-sm md:prose-base max-w-none">
												<ReactMarkdown remarkPlugins={[remarkGfm]}>
													{message.response}
												</ReactMarkdown>
											</div>
										</div>
									</div>
								</motion.div>
							))}

							{/* Loading State */}
							{isLoading && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="flex justify-start"
								>
									<div className="rounded-2xl rounded-tl-sm bg-background/60 border border-purple-500/20 px-4 py-3 backdrop-blur-sm">
										<div className="flex items-center gap-2">
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "linear",
												}}
												className="h-4 w-4 rounded-full border-2 border-purple-500 border-t-transparent"
											/>
											<span className="text-sm text-gray-400">Thinking...</span>
										</div>
									</div>
								</motion.div>
							)}

							{/* Error Display */}
							{error && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex justify-center"
								>
									<div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3">
										<p className="text-sm text-red-400">{error}</p>
									</div>
								</motion.div>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Input Bar */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
					className="w-full max-w-6xl"
				>
					<form onSubmit={handleSubmit} className="relative">
						<motion.div
							animate={{
								boxShadow: [
									"0 4px 24px rgba(147, 51, 234, 0.3)",
									"0 4px 32px rgba(147, 51, 234, 0.5)",
									"0 4px 24px rgba(147, 51, 234, 0.3)",
								],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="relative flex items-center rounded-2xl border border-purple-600/50 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-purple-500 focus-within:border-purple-500"
						>
							{/* Input Field */}
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder={isLoading ? "Sending to n8n..." : "Type here ..."}
								className="flex-1 bg-transparent px-6 py-4 text-base text-gray-300 placeholder-gray-600 outline-none md:text-lg disabled:opacity-50"
								disabled={isLoading}
							/>

							{/* Hidden submit button for form submission */}
							<button type="submit" className="sr-only" tabIndex={-1}>
								Submit
							</button>
						</motion.div>
					</form>

					{/* Hint Text - only show when no messages */}
					<AnimatePresence>
						{!hasMessages && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
								className="mt-4 px-4 text-center text-xs text-gray-500 sm:text-sm"
							>
								Powered by AI • Ask anything about your Python course materials
							</motion.p>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			{/* Ambient glow at the bottom */}
			<div className="pointer-events-none fixed bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
		</main>
	);
}
