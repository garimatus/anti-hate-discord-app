CREATE TABLE IF NOT EXISTS anti_hate_discord_bot.guild_user(
    user_warnings INT
    ,user_is_banned BOOLEAN
    ,guild_id BIGINT
    ,user_id BIGINT
    ,PRIMARY KEY(guild_id, user_id)
);