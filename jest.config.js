module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$": "<rootDir>/fileTransformer.js",
    },
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy",
    },
    modulePaths: [],
    testMatch: ["**/*/*.(spec|test|tests).js?(x)", "**/*/*.(spec|test|tests).ts?(x)"],
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/lib/"],
    transformIgnorePatterns: ["/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$", "^.+\\.module\\.(css|sass|scss)$"],
    collectCoverage: true,
    automock: false,
    reporters: ["default", "jest-junit"],
    testURL: "http://localhost",
};
