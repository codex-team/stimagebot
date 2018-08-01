const config = require('./config');

const webp = require('webp-converter');
const Capella = require('@codexteam/capella-pics');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.token, {polling: true});

/**
 * Process command /start
 */
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Send me a sticker and I\'ll return you a link to this image');
});

/**
 * Process message with a sticker
 */
bot.on('sticker', (msg) => {
  const chatId = msg.chat.id,
        uploadsDir = './uploads';

  bot.downloadFile(msg.sticker.file_id, uploadsDir)
    .then(pathToImage => {
      const pathToImagePng = `${pathToImage}.png`;

      bot.sendChatAction(chatId, 'upload_photo');

      webp.dwebp(pathToImage, pathToImagePng, "-o", status => {
        const capella = new Capella();

        capella.uploadFile(pathToImagePng, resp => {
          bot.sendMessage(chatId, resp.url);
        });
      });
    })
    .catch(err => {
      bot.sendMessage(chatId, 'Something went wrong');

      console.log(err);
    });
});
