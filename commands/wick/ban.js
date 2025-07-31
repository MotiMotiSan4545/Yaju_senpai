const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('メンバーをBANします'),

  async execute(interaction) {
    await interaction.reply({ content: '処理を開始しました...', ephemeral: true });

    const delaySeconds = Math.floor(Math.random() * 6) + 10; // 10〜15秒
    setTimeout(async () => {
      try {
        await interaction.user.send(':x: 実行中に内部的なエラーが発生しました。再度お試しください');
      } catch (err) {
        console.error('DM送信失敗:', err);
      }
    }, delaySeconds * 1000);
  }
};
