const { Telegraf } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

console.log('BOT_TOKEN:', BOT_TOKEN ? 'установлен' : 'ОТСУТСТВУЕТ');
console.log('OPENROUTER_KEY:', OPENROUTER_KEY ? 'установлен' : 'ОТСУТСТВУЕТ');

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('[333]: Диагностика успешна.'));

bot.on('text', async (ctx) => {
    try {
        const resp = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [{ role: 'user', content: ctx.message.text }],
            max_tokens: 100
        }, {
            headers: {
                'Authorization': 'Bearer ' + OPENROUTER_KEY,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        await ctx.reply('[333]: Ответ: ' + resp.data.choices[0].message.content);
    } catch (e) {
        await ctx.reply('[333]: Ошибка: ' + e.message);
    }
});

bot.launch().then(() => {
    console.log('Бот запущен успешно');
}).catch(err => {
    console.error('КРИТИЧЕСКАЯ ОШИБКА:', err);
    process.exit(1);
});
