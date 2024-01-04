/**
 * Load config params
 */
const config = require('./config');

/**
 * Require necessary packages
 */
const webp = require('webp-converter');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

const { uploadByBuffer } = require('telegraph-uploader');


const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.rmdirSync(uploadsDir, { recursive: true });
}

/**
 * Throw error if bot toke is missing
 */
if (!config.token) {
  throw new Error('Bot token is missing. Check config file.'); 
}

/**
 * Bot connection settings
 */
let botParams = {
  polling: true
};

/**
 * Create a Bot's instance
 */
const bot = new TelegramBot(config.token, botParams);

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
  const chatId = msg.chat.id;

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (msg.sticker.is_animated) {
      bot.sendMessage(chatId, 'Sorry, I cannot process animated stickers yet.');
      return;
    }

    /**
     * Download webp file by sticker's id
     */
    bot.downloadFile(msg.sticker.file_id, uploadsDir)
      .then(async (pathToImage) => {
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
        webp.dwebp(pathToImage, pathToImagePng, "-o")
          .then((status, error) => {
            return uploadByBuffer(fs.readFileSync(pathToImagePng), 'image/png');
          })
          .then(({ link, path }) => {
            bot.sendMessage(chatId, link);

            try { fs.unlinkSync(pathToImage); } catch(e) {}
            try { fs.unlinkSync(pathToImagePng); } catch(e) {}
          })
          .catch(error => {
            /**
             * On error we just send a message to user
             */
            bot.sendMessage(chatId, 'Send me another sticker please');
            console.log(error);
          });
      })
      .catch(error => {
        bot.sendMessage(chatId, 'Something went wrong');
        console.log(error);
      });

  } catch (error) {
    bot.sendMessage(chatId, 'Something bad went wrong');
    console.log(error);
  }
});

/**
 * Process message with a photo or photos
 */
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // get the last image item from array
    const photoItem = msg.photo[msg.photo.length - 1];
    const photoFileId = photoItem.file_id;

    /**
     * Download image file by id
     */
    bot.downloadFile(photoFileId, uploadsDir)
      .then(async (pathToImage) => {
        /**
         * Send chat action
         */
        bot.sendChatAction(chatId, 'upload_photo');

        uploadByBuffer(fs.readFileSync(pathToImage), 'image/png')
          .then(({ link, path }) => {
            bot.sendMessage(chatId, link);

            try { fs.unlinkSync(pathToImage); } catch(e) {}
          })
          .catch(error => {
            /**
             * On error we just send a message to user
             */
            bot.sendMessage(chatId, 'Send me another image please');
            console.log(error);
          });
      })
      .catch(error => {
        bot.sendMessage(chatId, 'Something went wrong');
        console.log(error);
      });

  } catch (error) {
    bot.sendMessage(chatId, 'Something bad went wrong');
    console.log(error);
  }
})

