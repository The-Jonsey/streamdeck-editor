module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss')("./tailwind.config.js"),
        require('autoprefixer'),
        // require("cssnano")({
        //     preset: 'default'
        // }),
        // require("@fullhuman/postcss-purgecss")({
        //     content: ['./public/*.html', './src/*.js', 'src/components/*.js'],
        //     defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        // })
    ]
};
