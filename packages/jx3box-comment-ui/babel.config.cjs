// module.exports = {
//   presets: [
//     '@vue/cli-plugin-babel/preset'
//   ],
//   plugins: [
//     "@babel/plugin-proposal-nullish-coalescing-operator",
//     "@babel/plugin-proposal-optional-chaining"
//   ]
// }

module.exports = {
    presets: ["@babel/preset-env", "@vue/babel-preset-jsx"],
    plugins: [
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining",
    ],
};
