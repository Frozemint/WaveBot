# WaveBot
A Discord bot coded for my [Poolandia Minecraft Guild](https://hypixel.net/guilds/537dd406ed509575cbc7fcb5).

It adds useful function to the Discord Server.

**Note that permissions is WIP, add the User ID of the admin to use admin-only commands in start.js**

# Features
**Beta** Added detection for bot outputs in non-bot channels, and the option to delete them automatically.

**Beta** Added proper permissions for bot.
- /ping - Pings the Bot. Useful for checking up on WaveBot.
- /say [text] - The Bot writes [text] into text channel.
- /help - Shows a helpful list of command in Discord
- /about - Shows info about WaveBot

*Admin only commands*

- /clear - Clear all the output by WaveBot in the channel this command was typed in.
- /clrcom - Clear all user commands to WaveBot in the channel this command was typed in.
- /clearall - Clear ALL bot outputs in a text channel, including WaveBot.
- /antispam - Toggle antispam for automatically deleting bot outputs in non-bot channels.
- /civin [Delay in Minute] [Text] - After delay, writes [Text] to the text channel this command was typed in.
 * Note that \ characters are escaped, use them to prevent spamming @everyone by writing @\everyone
- /exit - Exits the bot.


# Config
There are currently 3 options in the ```config.json``` file avaliable for tweaking.
- ```allowedUsers``` - An array of Discord User ID that is allowed to run admin only commands. Paste the desired user
IDs in the array.
- ```passiveClear``` - If set to ``false``, antispam will not run when the bot starts and needs to be toggled on by hand.
Set to ``true`` to automatically start antispam.
- ``botChannel`` - An array of whitelisted Discord Text Channel IDs where bot messages are allowed in those channel. Paste the
designated bot only channel IDs in the array.


# Installation

After this repo is downloaded, do ```npm install```, edit the ```auth.json``` file with the token of your bot's account,
and use ```node start.js``` to start the bot.

