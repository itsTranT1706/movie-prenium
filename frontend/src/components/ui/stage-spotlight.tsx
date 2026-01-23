'use client';

interface StageSpotlightProps {
    /** Color theme: 'purple' | 'blue' | 'red' | 'gold' | 'green' */
    color?: 'purple' | 'blue' | 'red' | 'gold' | 'green';
    /** Intensity of the spotlight: 'low' | 'medium' | 'high' */
    intensity?: 'low' | 'medium' | 'high';
    /** Show floating particles */
    showParticles?: boolean;
    /** Show vignette effect */
    showVignette?: boolean;
}

const COLOR_SCHEMES = {
    purple: {
        beam: 'rgba(147, 51, 234, 0.12)',
        beamMid: 'rgba(139, 92, 246, 0.06)',
        beamEnd: 'rgba(124, 58, 237, 0.02)',
        left: 'rgba(168, 85, 247, 0.1)',
        leftMid: 'rgba(192, 132, 252, 0.05)',
        right: 'rgba(216, 180, 254, 0.1)',
        rightMid: 'rgba(233, 213, 255, 0.05)',
        glow: 'rgba(147, 51, 234, 0.12)',
        glowMid: 'rgba(139, 92, 246, 0.05)',
        particles: [
            'rgba(216, 180, 254, 0.5)',
            'rgba(192, 132, 252, 0.4)',
            'rgba(233, 213, 255, 0.45)',
            'rgba(168, 85, 247, 0.35)',
            'rgba(139, 92, 246, 0.3)',
            'rgba(147, 51, 234, 0.4)',
        ],
    },
    blue: {
        beam: 'rgba(59, 130, 246, 0.12)',
        beamMid: 'rgba(96, 165, 250, 0.06)',
        beamEnd: 'rgba(37, 99, 235, 0.02)',
        left: 'rgba(99, 102, 241, 0.1)',
        leftMid: 'rgba(129, 140, 248, 0.05)',
        right: 'rgba(147, 197, 253, 0.1)',
        rightMid: 'rgba(191, 219, 254, 0.05)',
        glow: 'rgba(59, 130, 246, 0.12)',
        glowMid: 'rgba(96, 165, 250, 0.05)',
        particles: [
            'rgba(147, 197, 253, 0.5)',
            'rgba(96, 165, 250, 0.4)',
            'rgba(191, 219, 254, 0.45)',
            'rgba(59, 130, 246, 0.35)',
            'rgba(37, 99, 235, 0.3)',
            'rgba(29, 78, 216, 0.4)',
        ],
    },
    red: {
        beam: 'rgba(239, 68, 68, 0.12)',
        beamMid: 'rgba(248, 113, 113, 0.06)',
        beamEnd: 'rgba(220, 38, 38, 0.02)',
        left: 'rgba(251, 146, 60, 0.1)',
        leftMid: 'rgba(253, 186, 116, 0.05)',
        right: 'rgba(252, 165, 165, 0.1)',
        rightMid: 'rgba(254, 202, 202, 0.05)',
        glow: 'rgba(239, 68, 68, 0.12)',
        glowMid: 'rgba(248, 113, 113, 0.05)',
        particles: [
            'rgba(252, 165, 165, 0.5)',
            'rgba(248, 113, 113, 0.4)',
            'rgba(254, 202, 202, 0.45)',
            'rgba(239, 68, 68, 0.35)',
            'rgba(220, 38, 38, 0.3)',
            'rgba(185, 28, 28, 0.4)',
        ],
    },
    gold: {
        beam: 'rgba(245, 158, 11, 0.12)',
        beamMid: 'rgba(251, 191, 36, 0.06)',
        beamEnd: 'rgba(217, 119, 6, 0.02)',
        left: 'rgba(251, 191, 36, 0.1)',
        leftMid: 'rgba(252, 211, 77, 0.05)',
        right: 'rgba(253, 224, 71, 0.1)',
        rightMid: 'rgba(254, 240, 138, 0.05)',
        glow: 'rgba(245, 158, 11, 0.12)',
        glowMid: 'rgba(251, 191, 36, 0.05)',
        particles: [
            'rgba(253, 224, 71, 0.5)',
            'rgba(251, 191, 36, 0.4)',
            'rgba(254, 240, 138, 0.45)',
            'rgba(245, 158, 11, 0.35)',
            'rgba(217, 119, 6, 0.3)',
            'rgba(180, 83, 9, 0.4)',
        ],
    },
    green: {
        beam: 'rgba(34, 197, 94, 0.12)',
        beamMid: 'rgba(74, 222, 128, 0.06)',
        beamEnd: 'rgba(22, 163, 74, 0.02)',
        left: 'rgba(52, 211, 153, 0.1)',
        leftMid: 'rgba(110, 231, 183, 0.05)',
        right: 'rgba(134, 239, 172, 0.1)',
        rightMid: 'rgba(187, 247, 208, 0.05)',
        glow: 'rgba(34, 197, 94, 0.12)',
        glowMid: 'rgba(74, 222, 128, 0.05)',
        particles: [
            'rgba(134, 239, 172, 0.5)',
            'rgba(74, 222, 128, 0.4)',
            'rgba(187, 247, 208, 0.45)',
            'rgba(34, 197, 94, 0.35)',
            'rgba(22, 163, 74, 0.3)',
            'rgba(21, 128, 61, 0.4)',
        ],
    },
};

const INTENSITY_MULTIPLIER = {
    low: 0.5,
    medium: 1,
    high: 1.5,
};

export function StageSpotlight({
    color = 'purple',
    intensity = 'medium',
    showParticles = true,
    showVignette = true,
}: StageSpotlightProps) {
    const scheme = COLOR_SCHEMES[color];
    const mult = INTENSITY_MULTIPLIER[intensity];

    return (
        <div className="stage-spotlight">
            {/* Soft ambient glow at top */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[300px]"
                style={{
                    background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${scheme.glow}, ${scheme.glowMid} 50%, transparent 100%)`,
                    animation: 'glow-pulse 3s ease-in-out infinite alternate',
                    opacity: mult,
                }}
            />

            {/* Center spotlight beam */}
            <div
                className="absolute top-[-10%] w-full h-[70%]"
                style={{
                    background: `radial-gradient(ellipse 50% 100% at 50% 0%, ${scheme.beam}, ${scheme.beamMid} 30%, ${scheme.beamEnd} 50%, transparent 70%)`,
                    animation: 'spotlight-pulse 4s ease-in-out infinite',
                    opacity: mult,
                }}
            />

            {/* Left spotlight beam */}
            <div
                className="absolute top-[-15%] left-[-10%] w-1/2 h-[80%] -rotate-[15deg]"
                style={{
                    background: `radial-gradient(ellipse 80% 100% at 30% 0%, ${scheme.left}, ${scheme.leftMid} 40%, transparent 70%)`,
                    animation: 'spotlight-pulse 5s ease-in-out 1s infinite',
                    opacity: mult,
                }}
            />

            {/* Right spotlight beam */}
            <div
                className="absolute top-[-15%] right-[-10%] w-1/2 h-[80%] rotate-[15deg]"
                style={{
                    background: `radial-gradient(ellipse 80% 100% at 70% 0%, ${scheme.right}, ${scheme.rightMid} 40%, transparent 70%)`,
                    animation: 'spotlight-pulse 5s ease-in-out 2s infinite',
                    opacity: mult,
                }}
            />

            {/* Dust particles in spotlight */}
            {showParticles && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(1px 1px at 20% 30%, ${scheme.particles[0]} 0%, transparent 100%),
                            radial-gradient(1px 1px at 40% 70%, ${scheme.particles[1]} 0%, transparent 100%),
                            radial-gradient(1px 1px at 60% 40%, ${scheme.particles[2]} 0%, transparent 100%),
                            radial-gradient(1px 1px at 80% 60%, ${scheme.particles[3]} 0%, transparent 100%),
                            radial-gradient(1.5px 1.5px at 30% 50%, ${scheme.particles[4]} 0%, transparent 100%),
                            radial-gradient(1px 1px at 70% 20%, ${scheme.particles[5]} 0%, transparent 100%)
                        `,
                        backgroundSize: '200px 200px',
                        animation: 'particle-float 20s linear infinite',
                        opacity: 0.5 * mult,
                    }}
                />
            )}

            {/* Vignette effect for cinema feel */}
            {showVignette && (
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
                    }}
                />
            )}
        </div>
    );
}
