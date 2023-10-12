CREATE TABLE IF NOT EXISTS Anti_Hate_Discord_Bot.Users(
    User_Id BIGINT PRIMARY KEY
    ,Username VARCHAR
    ,Global_Username VARCHAR
    ,Avatar VARCHAR
    ,Total_Warnings BIGINT
    ,Total_Bans BIGINT
);