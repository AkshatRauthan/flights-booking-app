module.exports = {
    baseDir: "src",

    // Exclude folders/files you don’t want to scan
    excludeRegExp: ["node_modules", "migrations", "seeders", "\\.test\\.js$"],

    // Only include certain file extensions (keep it JS for now)
    fileExtensions: ["js"],

    // Don't scan npm packages (only internal project files)
    includeNpm: false,

    // Always warn if madge detects weird stuff
    warning: true,

    // Output format for graphs (use when generating images)
    layout: "dot",

    // (Optional) treat circular dependencies as errors
    // Will cause madge --fail to exit with non-zero code if circular deps exist
    detectCircular: true,
};
