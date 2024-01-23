all:
	@echo hi,

pull:
	pnpm exec clasp pull

push:
	pnpm exec clasp push

open:
	pnpm exec clasp logs --open

test: push
	pnpm exec clasp run testing

run: push
	pnpm exec clasp run main
