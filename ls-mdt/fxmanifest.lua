fx_version 'cerulean'
game 'gta5'

lua54 'yes'

description 'LquenS made MDT system'
version '1.0'

shared_scripts {
    'config.lua',
}

server_scripts {
    'resources/server/main.lua',
}

client_scripts {
    'resources/client/main.lua',
}

ui_page {
    'html/ui.html'
}

files {
    'html/ui.html',
    'html/main.js',
    'html/dispatch.js',
    'html/*.css',
    'html/images/*.png',
}

escrow_ignore {
	'config.lua',
}