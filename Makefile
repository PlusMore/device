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
	meteor run --settings ./config/$(APP_ENV)/settings.json android-device -p $(PORT) --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

build-android-qa:
	rm -rf ~/cordova-builds/qa
	APP_ENV=qa \
	meteor build ~/cordova-builds/qa --server=qa-device.plusmoretablets.com --mobile-settings ./config/$(APP_ENV)/settings.json 
	cd ~/cordova-builds/qa/android/
	jarsigner -digestalg SHA1 ~/cordova-builds/qa/android/unaligned.apk qa-device
	~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign 4 ~/cordova-builds/qa/android/unaligned.apk ~/cordova-builds/qa/android/qa-device.apk
	cp -f ~/cordova-builds/qa/android/qa-device.apk /Users/pat/Box\ Sync/Plus\ More/For\ Pat

build-prod:
	meteor build ../cordova-builds/prod --server=device.plusmoretablets.com	

ios-device:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios-device -p $(PORT) --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

all-platforms:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios-device android-device -p $(PORT) --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

debug:
	NODE_OPTIONS='--debug' \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	meteor debug -p $(PORT) --settings ./config/$(APP_ENV)/settings.json

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