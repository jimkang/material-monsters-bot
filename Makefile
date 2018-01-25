HOMEDIR = $(shell pwd)
USER = bot
SERVER = smidgeo
SSHCMD = ssh $(USER)@$(SERVER)
PROJECTNAME = material-monsters-bot
APPDIR = /opt/$(PROJECTNAME)

pushall: sync
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt --exclude node_modules/
	$(SSHCMD) "cd $(APPDIR) && npm install"

run:
	node post-material-monster.js

prettier:
	prettier --single-quote --write "**/*.js"
