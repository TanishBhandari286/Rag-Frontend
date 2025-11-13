"use client";

import { memo, useEffect, useRef } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	opacity: number;
	baseOpacity: number;
}

function ParticleField() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		const setCanvasSize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		setCanvasSize();
		window.addEventListener("resize", setCanvasSize);

		// Reduce particles significantly for better performance
		const particleCount = Math.min(
			60, // Reduced from 150
			Math.floor((canvas.width * canvas.height) / 30000), // Less dense
		);
		const particles: Particle[] = [];

		for (let i = 0; i < particleCount; i++) {
			const baseOpacity = Math.random() * 0.4 + 0.3;
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 2 + 0.5,
				opacity: baseOpacity,
				baseOpacity: baseOpacity,
			});
		}

		let animationFrameId: number;
		let time = 0;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			time += 0.016; // Approx 60fps

			// Disable shadow for better performance
			ctx.shadowBlur = 0;

			// Update and draw particles
			for (let i = 0; i < particles.length; i++) {
				const particle = particles[i];

				// Update position
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Wrap around screen
				if (particle.x < 0) particle.x = canvas.width;
				if (particle.x > canvas.width) particle.x = 0;
				if (particle.y < 0) particle.y = canvas.height;
				if (particle.y > canvas.height) particle.y = 0;

				// Simple pulsating opacity (cached calculation)
				particle.opacity =
					particle.baseOpacity + Math.sin(time + i * 0.5) * 0.2;

				// Draw particle without shadow for performance
				ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fill();

				// Draw connections - limit to nearby particles only
				// Only check forward to avoid duplicates
				for (let j = i + 1; j < particles.length; j++) {
					const otherParticle = particles[j];
					const dx = particle.x - otherParticle.x;
					const dy = particle.y - otherParticle.y;

					// Quick distance check without sqrt for far particles
					const distSq = dx * dx + dy * dy;
					if (distSq < 25000) {
						// 158px squared for performance
						const distance = Math.sqrt(distSq);
						const opacity = (1 - distance / 158) * 0.15 * particle.opacity;

						ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
						ctx.lineWidth = 0.5;
						ctx.beginPath();
						ctx.moveTo(particle.x, particle.y);
						ctx.lineTo(otherParticle.x, otherParticle.y);
						ctx.stroke();
					}
				}
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", setCanvasSize);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-0"
			style={{ background: "transparent" }}
		/>
	);
}

export default memo(ParticleField);
