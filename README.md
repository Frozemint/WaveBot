# WaveBot
A Discord bot coded for my [Poolandia Minecraft Guild](https://hypixel.net/guilds/537dd406ed509575cbc7fcb5).

It adds useful function to the Discord Server.

# Features
Edit user permissions by adding them into config.json

Tweak what channels to whitelist bot messages, and what servers to enforce antispam in config.json

- /ping - Pings the Bot. Useful for checking up on WaveBot.
- /say [text] - The Bot writes [text] into text channel.
- /help - Shows a helpful list of command in Discord
- /about - Shows info about WaveBot
- /stat - Shows some statistics about the WaveBot

*Admin only commands*

- /clear - Clear all the output by WaveBot in the channel this command was typed in.
- /clrcom - Clear all user commands to WaveBot in the channel this command was typed in.
- /antispam - Toggle antispam for automatically deleting bot outputs in non-bot channels.
- /sayin [Delay in Minute] [Text] - After delay, writes [Text] to the text channel this command was typed in.
 * Note that \ characters are escaped, use them to prevent spamming @everyone by writing @\everyone
- /eval [Javascript Code] - Execute arbitrary javascript code. USE WITH CAUTION.
- /exit - Exits the bot.


# Config
There are currently 3 options in the ```config.json``` file avaliable for tweaking.
- ```allowedUsers``` - An array of Discord User ID that is allowed to run admin only commands. Paste the desired user
IDs in the array.
- ```passiveClear``` - If set to ``false``, antispam will not run when the bot starts and needs to be toggled on by hand.
Set to ``true`` to automatically start antispam.
- ``botChannel`` - An array of whitelisted Discord Text Channel IDs where bot messages are allowed in those channel. Paste the
designated bot only channel IDs in the array.
- ``whitelistedWords`` - If a bot prints a message containing these words, they will not be filtered.


# Installation

After this repo is downloaded, do ```npm install```, edit the ```auth.json``` file with the token of your bot's account,
and use ```node start.js``` to start the bot. Also checkout ```config.json``` if you want to use the antispam function.

