# WaveBot
A Discord bot coded for my [Poolandia Minecraft Guild](https://hypixel.net/guilds/537dd406ed509575cbc7fcb5).

It adds useful features to the official Discord server of the guild.

# Features
- Automated removal of bot messages from unwanted text channels
- Poll users with a question, with unlimited options for voting

# Commands

Grant users permission to run admin only commands by assigning them ```ADMINISTRATOR``` permissions or a role named ```Bot Commander```.

- /ping - Pings the Bot. Useful for checking up on WaveBot
- /say [text] - The Bot writes [text] into text channel
- /help - Shows a helpful list of command in Discord
- /info - Shows info about WaveBot, including some interesting statistics like uptime
- /vote [option] - Vote your selected option when a poll is underway, options are set by admins when creating the poll
- /results - Display voting results when a poll is underway
- /[custom command] - Display the pre-defined response for custom commands

*Admin only commands*

- /clear - Clear all the input/output directed to/by WaveBot in the channel this command was typed in.
- /antispam - Toggle antispam for automatically deleting bot outputs in non-bot channels.
- /sayin [Delay in Minute] [Text] - After delay, writes [Text] to the text channel this command was typed in.
 * Note that \ characters are escaped, use them to prevent spamming @everyone by writing @\everyone
- /eval [Javascript Code] - Execute arbitrary javascript code. USE WITH CAUTION.
- /poll [parameters...] - Used to setup a poll and start it. Follow the instructions given by WaveBot
- /exit - Exits the bot.
- /addcom [command] [response] - Add and save a custom command with the response WaveBot should output when the command is ran
- /delcom [command] - Delete a custom command


# Config
There are currently 3 options in the ```config.json``` file avaliable for tweaking.

- ```passiveClear``` - If set to ``false``, antispam will not run when the bot starts and needs to be toggled on by hand.
Set to ``true`` to automatically start antispam.
- ``botChannel`` - An array of whitelisted Discord Text Channel IDs where bot messages are allowed in those channel. Paste the
designated bot only channel IDs in the array.
- ``whitelistedWords`` - If a bot prints a message containing these words, they will not be filtered.


# Installation

After this repo is downloaded, do ```npm install```, Create a ```auth.json``` file with a field called "token" with the value of your bot's account token,
and use ```node start.js``` to start the bot.

# Additional Information

WaveBot will NEVER remove user messages in the antispam function; WaveBot only deletes user messages if an admin runs the ```/clear``` command, which clear WaveBot commands entered by users.

WaveBot also collects Username/nicknames for logging purposes. This information is usually used to debug the bot, such as diagnosing user permission problems. When you run the ```/vote``` command, your username and user ID is also collected for vote counting and to perform checks against voting more than twice. This information is retained even after a poll closes so votes may be checked even after the poll is close. The retained information is cleared when another poll is started.
 
Contact your server admin if you have any inquiries or concerns about the use of such data.

