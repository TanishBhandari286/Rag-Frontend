/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "#0a0a0f",
				foreground: "#ffffff",
				primary: {
					purple: "#8b5cf6",
					blue: "#3b82f6",
					glow: "#a78bfa",
				},
			},
			boxShadow: {
				"glow-purple":
					"0 0 20px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
				"glow-purple-lg":
					"0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.5), 0 0 120px rgba(139, 92, 246, 0.3)",
				"glow-blue":
					"0 0 10px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)",
			},
			animation: {
				"pulse-glow": "pulse-glow 3s ease-in-out infinite",
				"rotate-slow": "rotate 20s linear infinite",
				float: "float 6s ease-in-out infinite",
			},
			keyframes: {
				"pulse-glow": {
					"0%, 100%": {
						opacity: "1",
						filter: "brightness(1)",
					},
					"50%": {
						opacity: "0.8",
						filter: "brightness(1.2)",
					},
				},
				rotate: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
