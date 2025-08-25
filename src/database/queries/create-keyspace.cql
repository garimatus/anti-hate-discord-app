CREATE KEYSPACE IF NOT EXISTS anti_hate_discord_bot
WITH REPLICATION = { 
    'class' : 'SimpleStrategy',
    'replication_factor' : 1
};