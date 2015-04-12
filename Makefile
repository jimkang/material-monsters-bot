HOMEDIR = $(shell pwd)
GITDIR = /var/repos/material-monsters-bot.git

run:
	node post-material-monster.js

sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

post-receive: sync-worktree-to-git npm-install
