#!/usr/bin/env node

import { execSync } from "child_process";

// Получаем тег из аргументов
const tagArg = process.argv.find(arg => arg.startsWith("--tag="));
const tag = tagArg ? tagArg.split("=")[1] : process.env.npm_config_tag;

if (!tag) {
    console.error("❌ Please specify tag: pnpm publish --tag v1.0.5");
    process.exit(1);
}

console.log(`🚀 Starting publish process for tag: ${tag}`);

try {
    // 1. Сборка
    console.log("📦 Building...");
    execSync("pnpm build", { stdio: "inherit" });

    // 2. Коммит и пуш изменений
    console.log("📝 Committing changes...");
    execSync("git add .", { stdio: "inherit" });
    execSync(`git commit -m "${tag}"`, { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });

    // 3. Создание и пуш тега
    console.log(`🏷️  Creating tag ${tag}...`);
    execSync(`git tag -a "${tag}" -m "${tag}"`, { stdio: "inherit" });
    execSync(`git push origin "${tag}"`, { stdio: "inherit" });

    // 4. Создание релиза
    console.log(`🎉 Creating release ${tag}...`);
    execSync(`gh release create "${tag}" --generate-notes --title "${tag}"`, { stdio: "inherit" });

    console.log("✅ Publish completed successfully!");
} catch (error) {
    console.error("❌ Publish failed:", error.message);
    process.exit(1);
}
