import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { ink: '#070A12', panel: '#0D1422', cyan: '#35DDF5', violet: '#9B7BFF' }, boxShadow: { neon: '0 0 35px rgba(53,221,245,.13)' } } },
  plugins: []
};
export default config;
