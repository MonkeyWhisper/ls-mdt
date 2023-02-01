fx_version 'cerulean'
game 'gta5'

description 'ls-core'
version '1.1.0'

shared_scripts {
	'config.lua'
}

client_scripts {
	'client/main.lua',
	'client/callback.lua'
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
	'server/main.lua',
	'server/callback.lua',
	'server/version.lua',
	'server/events.lua'
}

lua54 'yes'
