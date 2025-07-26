CREATE TABLE IF NOT EXISTS Anti_Hate_Discord_Bot.Guild_User(
    User_Warnings INT
    ,User_Is_Banned BOOLEAN
    ,Guild_Id BIGINT
    ,User_Id BIGINT
    ,PRIMARY KEY(Guild_Id, User_Id)
);