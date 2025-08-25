CREATE TABLE IF NOT EXISTS anti_hate_discord_bot.guild(
    guild_id BIGINT PRIMARY KEY
    ,command_prefix VARCHAR
    ,warnings_allowed INT
    ,bans BIGINT
    ,locale VARCHAR
);