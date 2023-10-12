CREATE KEYSPACE IF NOT EXISTS Anti_Hate_Discord_Bot
WITH REPLICATION = { 
    'class' : 'SimpleStrategy', 'replication_factor' : 1
};