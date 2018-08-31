/**
 * Load config params
 */
const config = require('./config');

/**
 * Require necessary packages
 */
const webp = require('webp-converter');
const Capella = require('@codexteam/capella-pics');
const TelegramBot = require('node-telegram-bot-api');

/**
 * Throw error if bot toke is missing
 */
if (!config.token) {
  throw new Error('Bot token is missing. Check config file.');
}

/**
 * Create a Bot's instance
 */
const bot = new TelegramBot(config.token, {polling: true});

/**
 * Process command /start
 */
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Send me a sticker and I\'ll return you a link to the image');
});

/**
 * Process message with a sticker
 */
bot.on('sticker', (msg) => {
  /**
   * Define chatId and directory for uploaded files
   */
  const chatId = msg.chat.id,
        uploadsDir = './uploads';

  /**
   * Download webp file by sticker's id
   */
  bot.downloadFile(msg.sticker.file_id, uploadsDir)
    .then(pathToImage => {
      /**
       * Define path to png image
       * Add '.png' at the end of name of webp archive
       */
      const pathToImagePng = `${pathToImage}.png`;

      /**
       * Send chat action
       */
      bot.sendChatAction(chatId, 'upload_photo');

      /**
       * Convert webp to png
       */
      webp.dwebp(pathToImage, pathToImagePng, "-o", status => {
        const capella = new Capella();

        /**
         * Upload image to Capella
         */
        capella.uploadFile(pathToImagePng, resp => {
          /**
           * Send link to image back to user
           */
          bot.sendMessage(chatId, resp.url);
        });
      });
    })
    .catch(error => {
      /**
       * On error we just send a message to user
       */
      bot.sendMessage(chatId, 'Something went wrong');

      console.log(error);
    });
});
