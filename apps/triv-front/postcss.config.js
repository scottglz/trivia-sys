process.env.TAILWIND_MODE = process.argv.join(' ').includes('build') ? 'build' : 'watch';

module.exports = {
  plugins: {
    tailwindcss: { config: './apps/triv-front/tailwind.config.js'},
    autoprefixer: {},
  },
}
