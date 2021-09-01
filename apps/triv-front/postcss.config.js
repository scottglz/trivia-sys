
const mode = process.env.NODE_ENV;
const dev = mode !== 'production';
process.env.TAILWIND_MODE = dev ? 'watch' : 'build';

module.exports = {
  plugins: {
    tailwindcss: { config: './apps/triv-front/tailwind.config.js'},
    autoprefixer: {},
  },
}
