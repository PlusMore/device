NODE_ENV?=development
NODE_OPTIONS?=''
APP_ENV?=development
HOST?=patleet.local
PORT?=4000
APP_OPTIONS?=
MONGO_URL?=mongodb://localhost:27017/plusmore
MONGO_OPLOG_URL?=mongodb://localhost:27017/local
CLUSTER_DISCOVERY_URL?=mongodb://localhost:27017/cluster
CLUSTER_SERVICE?=device
CLUSTER_PUBLIC_SERVICES="hotel"
SUBDOMAIN?=dev-device
TAG?=

start:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor -p $(PORT) --settings ./config/$(APP_ENV)/settings.json --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

ios:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios -p $(PORT) $(APP_OPTIONS)

android:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	meteor run --settings ./config/$(APP_ENV)/settings.json android -p $(PORT) $(APP_OPTIONS)

android-device:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor run --settings ./config/$(APP_ENV)/settings.json android-device -p $(PORT) --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

build:
	rm -rf ~/cordova-builds/$(APP_ENV)
	APP_ENV=$(APP_ENV) \
	SUBDOMAIN=$(SUBDOMAIN) \
	VERSION=$(VERSION) \
	meteor build ~/cordova-builds/$(APP_ENV) --server=https://$(SUBDOMAIN).plusmoretablets.com
	cd ~/cordova-builds/$(APP_ENV)/android/
	jarsigner -digestalg SHA1 ~/cordova-builds/$(APP_ENV)/android/unaligned.apk $(SUBDOMAIN)
	~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign 4 ~/cordova-builds/$(APP_ENV)/android/unaligned.apk ~/cordova-builds/$(APP_ENV)/android/$(SUBDOMAIN)-$(VERSION).apk
	cp -f ~/cordova-builds/$(APP_ENV)/android/$(SUBDOMAIN)-$(VERSION).apk /Users/pat/Box\ Sync/Plus\ More/For\ Pat

ios-device:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios-device -p $(PORT) --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

all-platforms:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor run --settings ./config/$(APP_ENV)/settings.json ios-device android-device -p $(PORT) --mobile-server $(HOST):$(PORT) $(APP_OPTIONS)

debug:
	NODE_OPTIONS='--debug' \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor debug -p $(PORT) --settings ./config/$(APP_ENV)/settings.json

start-prod:
	NODE_OPTIONS=$(NODE_OPTIONS) \
	MONGO_URL=$(MONGO_URL) \
	MONGO_OPLOG_URL=$(MONGO_OPLOG_URL) \
	CLUSTER_DISCOVERY_URL=$(CLUSTER_DISCOVERY_URL) \
	CLUSTER_SERVICE=$(CLUSTER_SERVICE) \
	CLUSTER_PUBLIC_SERVICES=$(CLUSTER_PUBLIC_SERVICES) \
	meteor -p $(PORT) --production --settings ./config/$(APP_ENV)/settings.json

ddp:
	ddp-analyzer-proxy

start-ddp:
	DDP_DEFAULT_CONNECTION_URL=http://localhost:3030 \
	meteor

tag:
	git tag -a $(TAG) -m 'tagging release'
	git push origin $(TAG)
