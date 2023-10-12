import { Client, mapping } from "cassandra-driver";
import fs from "node:fs";

const { pathname : path } = new URL("./", import.meta.url);
const createKeyspaceCql = fs.readFileSync(path + "./queries/create-keyspace.cql").toString();
const createMessageCql = fs.readFileSync(path + "./queries/create-messages.cql").toString();
const createGuildCql = fs.readFileSync(path + "./queries/create-guilds.cql").toString();
const createUserCql = fs.readFileSync(path + "./queries/create-users.cql").toString();
const createGuildUserCql = fs.readFileSync(path + "./queries/create-guilds-users.cql").toString();

const client = new Client({
	contactPoints : ["0.0.0.0:9042"],
	localDataCenter : "datacenter1",
	keyspace : "anti_hate_discord_bot"
});

client.connect();

client.execute(createKeyspaceCql);
client.execute(createMessageCql);
client.execute(createGuildCql);
client.execute(createUserCql);
client.execute(createGuildUserCql);

const mapper = new mapping.Mapper(client, {
		models : {
			"Anti_Hate_Discord_Bot" : { tables : [
					"messages",
					"guilds",
					"users",
					"guilds_users"
				]
			}
		}
	}
);

export { mapper };