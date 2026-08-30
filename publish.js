#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

// Получаем тег из аргументов (первый аргумент после имени скрипта)
const tag = process.argv[2];

if (!tag) {
    console.error("❌ Please specify tag: pnpm release v1.0.5");
    console.error("   or: npm run release -- v1.0.5");
    process.exit(1);
}

// Проверяем формат тега (опционально)
if (!tag.startsWith("v")) {
    console.warn('⚠️  Warning: tag should start with "v" (e.g., v1.0.5)');
}

console.log(`🚀 Starting release process for tag: ${tag}`);

try {
    // 1. Версия из тега -> package.json (её же вшивает сборка в бандл)
    const version = tag.replace(/^v/, "");
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));

    if (pkg.version !== version) {
        console.log(`🔖 Bumping version ${pkg.version} -> ${version}`);
        pkg.version = version;
        writeFileSync("package.json", `${JSON.stringify(pkg, null, 4)}\n`);
    }

    // 2. Сборка
    console.log("📦 Building...");
    execSync("pnpm build", { stdio: "inherit" });

    // 3. Коммит и пуш изменений
    console.log("📝 Committing changes...");
    execSync("git add .", { stdio: "inherit" });

    try {
        execSync(`git commit -m "${tag}"`, { stdio: "inherit" });
    } catch (e) {
        console.log("📝 No changes to commit or commit failed, continuing...");
    }

    execSync("git push", { stdio: "inherit" });

    // 4. Создание и пуш тега
    console.log(`🏷️  Creating tag ${tag}...`);
    execSync(`git tag -a "${tag}" -m "${tag}"`, { stdio: "inherit" });
    execSync(`git push origin "${tag}"`, { stdio: "inherit" });

    // 5. Создание релиза
    console.log(`🎉 Creating release ${tag}...`);
    execSync(`gh release create "${tag}" --generate-notes --title "${tag}"`, { stdio: "inherit" });

    console.log("✅ Release completed successfully!");
} catch (error) {
    console.error("❌ Release failed:", error.message);
    process.exit(1);
}
