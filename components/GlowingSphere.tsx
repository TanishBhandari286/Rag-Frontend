"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useRef } from "react";

interface FloatingParticle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	opacity: number;
	phase: number;
}

function GlowingSphere() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		const size = 300;
		canvas.width = size;
		canvas.height = size;

		const centerX = size / 2;
		const centerY = size / 2;
		const radius = 80;

		// Create many more floating particles for denser effect
		const particleCount = 80;
		const floatingParticles: FloatingParticle[] = [];

		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * radius * 0.7;
			floatingParticles.push({
				x: centerX + Math.cos(angle) * distance,
				y: centerY + Math.sin(angle) * distance,
				vx: (Math.random() - 0.5) * 0.2,
				vy: (Math.random() - 0.5) * 0.2,
				size: Math.random() * 1.5 + 0.5,
				opacity: Math.random() * 0.7 + 0.3,
				phase: Math.random() * Math.PI * 2,
			});
		}

		let animationFrameId: number;
		let rotation = 0;
		let pulsePhase = 0;

		const drawSphere = () => {
			ctx.clearRect(0, 0, size, size);

			// Smooth rotation
			rotation += 0.01;

			// Smooth pulsing effect
			pulsePhase += 0.015;
			const pulse = Math.sin(pulsePhase) * 0.12 + 1;

			// Draw large outer purple glow
			const outerGlow = ctx.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				radius * 2.8 * pulse,
			);
			outerGlow.addColorStop(0, `rgba(139, 92, 246, ${0.15 * pulse})`);
			outerGlow.addColorStop(0.3, `rgba(139, 92, 246, ${0.25 * pulse})`);
			outerGlow.addColorStop(0.6, `rgba(139, 92, 246, ${0.15 * pulse})`);
			outerGlow.addColorStop(1, "rgba(139, 92, 246, 0)");

			ctx.fillStyle = outerGlow;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius * 2.8 * pulse, 0, Math.PI * 2);
			ctx.fill();

			// Draw dark core circle (black center)
			ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.fill();

			// Update and draw dense blue particles inside
			ctx.shadowBlur = 0;
			for (let i = 0; i < floatingParticles.length; i++) {
				const particle = floatingParticles[i];

				// Update position
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Phase-based floating motion
				particle.phase += 0.015;
				const floatX = Math.sin(particle.phase) * 0.8;
				const floatY = Math.cos(particle.phase * 0.8) * 0.8;

				// Keep particles within sphere bounds
				const dx = particle.x - centerX;
				const dy = particle.y - centerY;
				const distSq = dx * dx + dy * dy;

				if (distSq > radius * radius * 0.7) {
					particle.vx *= -0.9;
					particle.vy *= -0.9;
				}

				// Pulsating opacity
				const opacityPulse = Math.sin(particle.phase * 1.5) * 0.3 + 0.7;

				// Draw bright blue particle
				ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity * opacityPulse})`;
				ctx.beginPath();
				ctx.arc(
					particle.x + floatX,
					particle.y + floatY,
					particle.size,
					0,
					Math.PI * 2,
				);
				ctx.fill();
			}

			// Draw rotating purple ring around the sphere
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(rotation);

			// Purple ring gradient
			const ringGradient = ctx.createLinearGradient(
				-radius * 1.5,
				0,
				radius * 1.5,
				0,
			);
			ringGradient.addColorStop(0, `rgba(147, 51, 234, ${0.2 * pulse})`);
			ringGradient.addColorStop(0.5, `rgba(168, 85, 247, ${pulse})`);
			ringGradient.addColorStop(1, `rgba(147, 51, 234, ${0.2 * pulse})`);

			ctx.strokeStyle = ringGradient;
			ctx.lineWidth = 3 * pulse;
			ctx.shadowColor = `rgba(168, 85, 247, ${0.9 * pulse})`;
			ctx.shadowBlur = 20 * pulse;

			// Draw tilted ring (ellipse)
			ctx.beginPath();
			ctx.ellipse(
				0,
				0,
				radius * 1.5 * pulse,
				radius * 0.35 * pulse,
				0,
				0,
				Math.PI * 2,
			);
			ctx.stroke();

			ctx.restore();

			// Continue animation
			animationFrameId = requestAnimationFrame(drawSphere);
		};

		drawSphere();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<motion.div
			animate={{
				scale: [1, 1.08, 1],
			}}
			transition={{
				duration: 3.5,
				repeat: Infinity,
				ease: [0.45, 0, 0.55, 1], // Custom smooth easing
			}}
			className="relative"
		>
			<motion.canvas
				ref={canvasRef}
				animate={{
					filter: [
						"drop-shadow(0 0 40px rgba(139,92,246,0.6))",
						"drop-shadow(0 0 60px rgba(139,92,246,0.9))",
						"drop-shadow(0 0 40px rgba(139,92,246,0.6))",
					],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Additional animated glow layers */}
			<motion.div
				animate={{
					opacity: [0.3, 0.6, 0.3],
					scale: [1, 1.1, 1],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="absolute inset-0 -z-10 rounded-full bg-purple-500/30 blur-3xl"
			/>
		</motion.div>
	);
}

export default memo(GlowingSphere);
