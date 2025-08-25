CREATE TABLE IF NOT EXISTS anti_hate_discord_bot.user(
    user_id BIGINT PRIMARY KEY
    ,username VARCHAR
    ,global_username VARCHAR
    ,avatar VARCHAR
    ,total_warnings BIGINT
    ,total_bans BIGINT
);