# See: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
# See: https://www.createjs.com/easeljs

.PHONY: clean demo_support

ORDERED_COMPONENTS_LIST := \
	src/animator.js \
	src/sprite.js \
	src/box.js \
	src/circle.js

all: build/static/spritez.js

demo_support: all
	@cp examples/* build/static/

build/static/d3.min.js: build/static
	@curl -q -s https://d3js.org/d3.v5.min.js -o $@

build/static/spritez.js: src/*.js build/static
	@(echo '"use strict"'";\n"; for name in $(ORDERED_COMPONENTS_LIST); do cat $${name}; echo '\n'; done) > $@

build/static:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
