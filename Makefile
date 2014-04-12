PORT?=4000
MONGO_URL?=mongodb://localhost:27017/plusmore
MONGO_OPLOG_URL?=mongodb://localhost:27017/local
USE_JSESSIONID?=1

start:
	USE_JSESSIONID=$(USE_JSESSIONID) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor -p $(PORT)

start-production:
	USE_JSESSIONID=$(USE_JSESSIONID) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor -p $(PORT) --production

ddp:
	ddp-analyzer-proxy

start-ddp:
	DDP_DEFAULT_CONNECTION_URL=http://localhost:3030 \
	meteor