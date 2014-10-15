NODE_ENV?=development
NODE_OPTIONS?=''
APP_ENV=development
HOST?=patleet.local
PORT?=4000
APP_OPTIONS?=
MONGO_URL?=mongodb://localhost:27017/plusmore
MONGO_OPLOG_URL?=mongodb://localhost:27017/local

start:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor -p $(PORT) --settings ./config/$(APP_ENV)/settings.json $(APP_OPTIONS)

ios:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios -p $(PORT) $(APP_OPTIONS)

android:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json android -p $(PORT) $(APP_OPTIONS)

android-device:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json android-device -p $(PORT) --mobile-port $(HOST):$(PORT) $(APP_OPTIONS)

ios-device:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios-device -p $(PORT) --mobile-port $(HOST):$(PORT) $(APP_OPTIONS)

all-platforms:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios-device android-device -p $(PORT) --mobile-port $(HOST):$(PORT) $(APP_OPTIONS)

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