/** @type {import('tailwindcss').Config} */
/*
 * IFLEON design system (light editorial):
 * warm paper background, ink text, ONE accent (brand green). Headlines in Newsreader (serif),
 * body in Figtree, labels/code in JetBrains Mono. Fonts are loaded in app/layout.tsx.
 */
module.exports = {
	darkMode: ["class"],
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: '1.25rem',
			screens: { '2xl': '1280px' }
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
				display: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
				mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace']
			},
			colors: {
				paper: { DEFAULT: '#FAF8F4', 2: '#F3EFE7', 3: '#ECE6DA' },
				ink: { DEFAULT: '#1C1B19', 2: '#45423C', 3: '#6F6B62', 4: '#9A958B' },
				line: { DEFAULT: '#E5DFD4', strong: '#D4CCBE' },
				brand: {
					50: '#EEF5F0',
					100: '#D8E9DE',
					200: '#B3D3BF',
					300: '#84B699',
					400: '#4F9470',
					500: '#2E7A55',
					600: '#1F6A47',
					700: '#17583B',
					800: '#134731',
					900: '#0F3A28',
					950: '#0A2419'
				},
				/* shadcn tokens used by components/ui */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
				secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
				destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
				muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
				accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' }
			},
			boxShadow: {
				/* Warm-tinted shadows from one light source (top) */
				soft: '0 1px 2px rgba(60, 48, 30, 0.05), 0 8px 24px -12px rgba(60, 48, 30, 0.12)',
				lift: '0 2px 4px rgba(60, 48, 30, 0.05), 0 24px 48px -20px rgba(60, 48, 30, 0.22)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			letterSpacing: {
				tightest: '-0.035em'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
