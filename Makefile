NODE_ENV?=development
NODE_OPTIONS?=''
APP_ENV=development
PORT?=4000
MONGO_URL?=mongodb://localhost:27017/plusmore
MONGO_OPLOG_URL?=mongodb://localhost:27017/local

start:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor -p $(PORT) --settings ./config/$(APP_ENV)/settings.json

ios:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios -p $(PORT) 

android:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run android -p $(PORT) 

start-debug:
	NODE_OPTIONS='--debug' \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor -p $(PORT) --settings ./config/$(APP_ENV)/settings.json

start-prod:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor -p $(PORT) --production --settings ./config/$(APP_ENV)/settings.json

ddp:
	ddp-analyzer-proxy

start-ddp:
	DDP_DEFAULT_CONNECTION_URL=http://localhost:3030 \
	meteor