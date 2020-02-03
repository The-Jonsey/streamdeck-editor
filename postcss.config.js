module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss')("./tailwind.config.js"),
        require('autoprefixer'),
        require("cssnano")({
            preset: 'default'
        }),
        require("@fullhuman/postcss-purgecss")({
            content: ['./webroot/*.html', './webroot/js/*'],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        })
    ]
};
