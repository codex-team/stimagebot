# @stimagebot

Get a link to image for any Telegram sticker.

[![](assets/example.gif)](//t.me/stimagebot)

Now you can easily add stickers to your comments on GitHub :wink:

```markdown
![](https://capella.pics/dfacc6ad-88b6-47df-ab90-4048a2af8bdd.jpg)
```

## Development

Clone a repository.

```shell
git clone https://github.com/codex-team/stimagebot
cd stimagebot
```

Install Node.js packages.

```shell
npm install
```

Create a config file.

```shell
cp config.sample.js config.js
```

Enter a token of your bot into this config.

Run a bot with `npm`, `node` or `forever`

```shell
npm run start
```

```shell
node index.js
```

```shell
forever index.js
```

For development you can run bot with `nodemon` to enable auto restart app on changes.

```shell
npm run start:dev
```

```shell
nodemon index.js
```
