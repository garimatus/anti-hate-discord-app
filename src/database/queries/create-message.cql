CREATE TABLE IF NOT EXISTS anti_hate_discord_bot.message(
    message_id BIGINT PRIMARY KEY
    ,content TEXT
    ,date TIMESTAMP
    ,guild_id BIGINT
    ,user_id BIGINT
);