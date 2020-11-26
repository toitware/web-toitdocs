TOIT_API_PROTO_DIR := third_party/api/proto
WEB_PROTO_FLAGS := --proto_path $(TOIT_API_PROTO_DIR) $(PROTO_FLAGS)
WEB_PROTO_SOURCES := $(shell find $(TOIT_API_PROTO_DIR) -name '*.proto')
WEB_PROTO_TARGETS := $(WEB_PROTO_SOURCES:$(TOIT_API_PROTO_DIR)/%.proto=src/proto/%_pb.js)
BUILD_WEB_PROTO_OUT := ./src/proto

WEB_SRC := $(shell find ./src -name '*.js') $(shell find ./src -name '*.ts') $(shell find ./src -name '*.tsx')

yarn.lock: package.json
	(yarn)

node_modules: yarn.lock
	(yarn install)

node_modules/.bin/protoc-gen-ts: node_modules
	@# $(MAKE) web_deps

$(BUILD_WEB_PROTO_OUT):
	@mkdir -p $(BUILD_WEB_PROTO_OUT)

src/proto/%_pb.js: $(TOIT_API_PROTO_DIR)/%.proto node_modules/.bin/protoc-gen-ts $(BUILD_WEB_PROTO_OUT)
	protoc $< --plugin=protoc-gen-ts=node_modules/.bin/protoc-gen-ts --js_out=import_style=commonjs,binary:$(BUILD_WEB_PROTO_OUT) --ts_out=service=true:$(BUILD_WEB_PROTO_OUT) $(WEB_PROTO_FLAGS)
	bash -c 'echo -e "/* eslint-disable */\n$$(cat $@)" > $@'

protobuf: $(WEB_PROTO_TARGETS)

build: node_modules $(WEB_PROTO_TARGETS) $(WEB_SRC) ifdefs.json
	(yarn run build)

.env.production.local.noop:
	mv -f ./.env.production.local ./.env.production.local.noop

.env.production.local:
	mv -f ./.env.production.local.noop ./.env.production.local

.bridge.before:
	mv -f ./login/.env.production ./login/.env.production.noop
	cp -f ./login/.env.production.bridge ./login/.env.production
	mv -f local_ifdefs.json local_ifdefs.json.noop
	cp -f online_ifdefs.json local_ifdefs.json
	mv -f .env.production.local .env.production.local.noop
	cp -f .env.production.bridge .env.production.local

.bridge.after:
	mv -f ./login/.env.production.noop ./login/.env.production
	mv -f local_ifdefs.json.noop local_ifdefs.json
	mv -f .env.production.local.noop .env.production.local

build_local: node_modules $(WEB_PROTO_TARGETS) $(WEB_SRC)
	cp -rf local_ifdefs.json ifdefs.json
	$(MAKE) build
	mkdir -p web_console_build/local
	mv build web_console_build/local

build_online: node_modules $(WEB_PROTO_TARGETS) $(WEB_SRC)
	cp -rf online_ifdefs.json ifdefs.json
	$(MAKE) .env.production.local.noop
	$(MAKE) build
	$(MAKE) .env.production.local
	mkdir -p web_console_build/online
	mv build web_console_build/online

build_web_console: build_local build_online
	mkdir build
	mv web_console_build/local build
	mv web_console_build/online build
	rm -rf web_console_build

build_web_console_bridge:
	rm -rf build
	$(MAKE) .bridge.before
	$(MAKE) build_local
	$(MAKE) .bridge.after
	mkdir build
	mv web_console_build/local build
	rm -rf web_console_build

.PHONY: clean
clean:
	rm -rf ./node_modules/ ./build/ ./web_console_build/ ./coverage/ ./junit.xml $(BUILD_WEB_PROTO_OUT)