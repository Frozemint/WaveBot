# WaveBot
A Discord bot coded for my [Poolandia Minecraft Guild](https://hypixel.net/guilds/537dd406ed509575cbc7fcb5).

It adds useful features to the official Discord server of the guild.

# Features
- Automated removal of bot messages from unwanted text channels
- Poll users with a question, with the option to vote YES, NO, or ABSTAIN.

# Commands

Grant users permission to run admin only commands by assigning them ```ADMINISTRATOR``` permissions or a role named ```Bot Commander```.

- /ping - Pings the Bot. Useful for checking up on WaveBot
- /say [text] - The Bot writes [text] into text channel
- /help - Shows a helpful list of command in Discord
- /info - Shows info about WaveBot, including some interesting statistics like uptime
- /vote [yes/no/abstain] - Vote your selected option when a poll is underway
- /results - Display voting results when a poll is underway

*Admin only commands*

- /clear - Clear all the output by WaveBot in the channel this command was typed in.
- /clrcom - Clear all user commands to WaveBot in the channel this command was typed in.
- /antispam - Toggle antispam for automatically deleting bot outputs in non-bot channels.
- /sayin [Delay in Minute] [Text] - After delay, writes [Text] to the text channel this command was typed in.
 * Note that \ characters are escaped, use them to prevent spamming @everyone by writing @\everyone
- /eval [Javascript Code] - Execute arbitrary javascript code. USE WITH CAUTION.
- /poll [Question] - Start a poll with the typed question as title. If a poll is already running, running /poll ends the poll.
- /exit - Exits the bot.


# Config
There are currently 3 options in the ```config.json``` file avaliable for tweaking.

- ```passiveClear``` - If set to ``false``, antispam will not run when the bot starts and needs to be toggled on by hand.
Set to ``true`` to automatically start antispam.
- ``botChannel`` - An array of whitelisted Discord Text Channel IDs where bot messages are allowed in those channel. Paste the
designated bot only channel IDs in the array.
- ``whitelistedWords`` - If a bot prints a message containing these words, they will not be filtered.


# Installation

After this repo is downloaded, do ```npm install```, edit the ```auth.json``` file with the token of your bot's account,
and use ```node start.js``` to start the bot. Also checkout ```config.json``` if you want to use the antispam function.

