CREATE TABLE IF NOT EXISTS Anti_Hate_Discord_Bot.Guilds_Users(
    User_Warnings INT
    ,User_Ban BOOLEAN
    ,Guild_Id BIGINT
    ,User_Id BIGINT
    ,PRIMARY KEY(Guild_Id, User_Id)
);