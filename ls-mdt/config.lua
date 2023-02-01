-- Variable declaration --
Config                                  = {}
Config.Functions                        = {}

Config.Webhook                          = ""

Config.PoliceJobs = {
    ["police"] = {
        label = "LSPD",
        canuse = true,
        sherrifgrade = 4,
    },
    ["sheriff"] = {
        label = "BCSO",
        canuse = true,
        sherrifgrade = 5,
    }
}

Config.Version 				= "1.0.2"

Config.Functions.MDTCommand = "openmdt"

Config.Functions.GetDispatches = function () 
	return exports["ls-dispatch"]:GetDispatchCalls()
end

Config.Functions.SetRadio = function (radio)
    exports["pma-voice"]:setVoiceProperty("radioEnabled", true)
    exports["pma-voice"]:setRadioChannel(tonumber(radio))
end

Config.Functions.GetJob = function (JOB)
    for k,v in pairs(Config.PoliceJobs) do
        if k == JOB then
            return v
        end
    end

    return false
end

Config.Functions.GetAllJobs = function ()
    local QBCore = exports["qb-core"]:GetCoreObject()

    return QBCore.Shared.Jobs
end

Config.Functions.GetName = function(USER_DATA, TYPE)
	if USER_DATA == nil then
		print("Code 2 - empty UserData detected")
		return " "
	end
	
    if TYPE == "both" then
        return USER_DATA.charinfo.firstname .. " " .. USER_DATA.charinfo.lastname
    elseif TYPE == "firstname" then
        return USER_DATA.charinfo.firstname
    elseif TYPE == "surname" then
        return USER_DATA.charinfo.lastname
    end
end

Config.Functions.FindColor = function(color_code)
    local colorName = ""
    for _,v in pairs( Config.Colors ) do
        for key, value in pairs( v ) do
            if value == color_code then
                colorName = key
                break
            end
        end
    end
    return colorName
end

Config.Functions.GetProperties = function(LS_CORE, identifier)
    local ap = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `apartments` ORDER BY `id`', {})
	local fin = {}
	for k, v in pairs (ap) do
		if v.citizenid == identifier then
			fin[#fin+1] = v.label
		end
	end
	return fin
end

Config.Functions.SetUnitData = function(LS_CORE, NewData)
    local Player = LS_CORE.Functions.GetIdentifier(NewData.identifier)
	if Player ~= nil then 
		CurrentData = Player.Functions.GetPlayerData()
		CurrentData.callsign = NewData.callsign
		CurrentData.radio = NewData.radio
		CurrentData.onduty = NewData.onduty
		CurrentData.history = NewData.history
		Player.Functions.SetPlayerData(CurrentData)
	end
end

Config.Functions.SetPlayerData = function(LS_CORE, NewData)
    local Player = LS_CORE.Functions.GetIdentifier(NewData.identifier)
	if Player ~= nil then
		Player.Player.Functions.SetMetaData("licences", NewData.licenses)
	else
		local user_data = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM players where citizenid = ?', { NewData.identifier })
		local metadata = json.decode(user_data[1].metadata)
		metadata.licences = NewData.licenses
	
		LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `players` SET `metadata` = @metadata WHERE `citizenid` = @citizenid', {
            ['@citizenid'] = NewData.identifier,
            ['@metadata'] = json.encode(metadata),
        })
	end
end

Config.Functions.GetAllLicenses = function(LS_CORE)
    local license_list = { 'driver', 'business', 'weapon' }

	return license_list
end

Config.Functions.GetPlayerLicenses = function(LS_CORE, DATA_BASE)
	return json.decode(DATA_BASE.metadata).licences
end


Config.Colors = {
    Metallic = {
        ['Black'] = 0,
        ['Carbon Black'] = 147,
        ['Graphite'] = 1,
        ['Anhracite Black'] = 11,
        ['Black Steel'] = 2,
        ['Dark Steel'] = 3,
        ['Silver'] = 4,
        ['Bluish Silver'] = 5,
        ['Rolled Steel'] = 6,
        ['Shadow Silver'] = 7,
        ['Stone Silver'] = 8,
        ['Midnight Silver'] = 9,
        ['Cast Iron Silver'] = 10,
        ['Red'] = 27,
        ['Torino Red'] = 28,
        ['Formula Red'] = 29,
        ['Lava Red'] = 150,
        ['Blaze Red'] = 30,
        ['Grace Red'] = 31,
        ['Garnet Red'] = 32,
        ['Sunset Red'] = 33,
        ['Cabernet Red'] = 34,
        ['Wine Red'] = 143,
        ['Candy Red'] = 35,
        ['Hot Pink'] = 135,
        ['Pfsiter Pink'] = 137,
        ['Salmon Pink'] = 136,
        ['Sunrise Orange'] = 36,
        ['Orange'] = 38,
        ['Bright Orange'] = 138,
        ['Gold'] = 99,
        ['Bronze'] = 90,
        ['Yellow'] = 88,
        ['Race Yellow'] = 89,
        ['Dew Yellow'] = 91,
        ['Dark Green'] = 49,
        ['Racing Green'] = 50,
        ['Sea Green'] = 51,
        ['Olive Green'] = 52,
        ['Bright Green'] = 53,
        ['Gasoline Green'] = 54,
        ['Lime Green'] = 92,
        ['Midnight Blue'] = 141,
        ['Galaxy Blue'] = 61,
        ['Dark Blue'] = 62,
        ['Saxon Blue'] = 63,
        ['Blue'] = 64,
        ['Mariner Blue'] = 65,
        ['Harbor Blue'] = 66,
        ['Diamond Blue'] = 67,
        ['Surf Blue'] = 68,
        ['Nautical Blue'] = 69,
        ['Racing Blue'] = 73,
        ['Ultra Blue'] = 70,
        ['Light Blue'] = 74,
        ['Chocolate Brown'] = 96,
        ['Bison Brown'] = 101,
        ['Creeen Brown'] = 95,
        ['Feltzer Brown'] = 94,
        ['Maple Brown'] = 97,
        ['Beechwood Brown'] = 103,
        ['Sienna Brown'] = 104,
        ['Saddle Brown'] = 98,
        ['Moss Brown'] = 100,
        ['Woodbeech Brown'] = 102,
        ['Straw Brown'] = 99,
        ['Sandy Brown'] = 105,
        ['Bleached Brown'] = 106,
        ['Schafter Purple'] = 71,
        ['Spinnaker Purple'] = 72,
        ['Midnight Purple'] = 142,
        ['Bright Purple'] = 145,
        ['Cream'] = 107,
        ['Ice White'] = 111,
        ['Frost White'] = 112,
    },
    
    Matte = {
        ['Black'] = 12,
        ['Gray'] = 13,
        ['Light Gray'] = 14,
        ['Ice White'] = 131,
        ['Blue'] = 83,
        ['Dark Blue'] = 82,
        ['Midnight Blue'] = 84,
        ['Midnight Purple'] = 149,
        ['Schafter Purple'] = 148,
        ['Red'] = 39,
        ['Dark Red'] = 40,
        ['Orange'] = 41,
        ['Yellow'] = 42,
        ['Lime Green'] = 55,
        ['Green'] = 128,
        ['Forest Green'] = 151,
        ['Foliage Green'] = 155,
        ['Olive Darb'] = 152,
        ['Dark Earth'] = 153,
        ['Desert Tan'] = 154,
    },
    
    Metals = {
        ['Brushed Steel'] = 117,
        ['Brushed Black Steel'] = 118,
        ['Brushed Aluminum'] = 119,
        ['Pure Gold'] = 158,
        ['Brushed Gold'] = 159,
    },
    
    Chameleon = {
        ['	RED ORANGE FLIP'] = 190,
        ['	ANOD PURPLE'] = 163,
        ['	TURQ PURP FLIP'] = 178,
        ['	MAGEN CYAN FLIP'] = 187,
        ['	PURP GREEN FLIP'] = 183,
        ['	BLACK PRISMA'] = 218,
        ['	YKTA CHRISTMAS'] = 237,
        ['	YKTA NITE DAY'] = 224,
        ['	YKTA FOUR SEASO'] = 229,
        ['	CREAM PEARL'] = 210,
        ['	RED PRISMA'] = 216,
        ['	GREEN BLUE FLIP'] = 171,
        ['	YKTA MONOCHROME'] = 223,
        ['	YKTA THE SEVEN'] = 234,
        ['	RAINBOW PRISMA'] = 220,
        ['	ORANG BLUE FLIP'] = 192,
        ['	DARKTEALPEARL'] = 197,
        ['	YKTA VERLIERER2'] = 225,
        ['	OIL SLIC PRISMA'] = 219,
        ['	YKTA M9 THROWBA'] = 230,
        ['	YKTA FUBUKI'] = 242,
        ['	DARKBLUEPEARL'] = 198,
        ['	WHITE HOLO'] = 222,
        ['	ANOD WINE'] = 162,
        ['	ANOD BRONZE'] = 168,
        ['	LIT BLUE PEARL'] = 202,
        ['	ANOD RED'] = 161,
        ['	GREEN PURP FLIP'] = 175,
        ['	GREEN TURQ FLIP'] = 174,
        ['	BLUE GREEN FLIP'] = 181,
        ['	LIT PURP PEARL'] = 203,
        ['	LIT PINK PEARL'] = 204,
        ['	GREEN BROW FLIP'] = 173,
        ['	YKTA ELECTRO'] = 240,
        ['	TEAL PURP FLIP'] = 176,
        ['	GREEN PRISMA'] = 217,
        ['	YKTA SYNTHWAVE'] = 228,
        ['	BLUE PEARL'] = 209,
        ['	YELLOW PEARL'] = 207,
        ['	DARKBLUEPRISMA'] = 213,
        ['	OIL SLICK PEARL'] = 200,
        ['	DARKGREENPEARL'] = 196,
        ['	ANOD COPPER'] = 167,
        ['	GREEN PEARL'] = 208,
        ['	ORANG PURP FLIP'] = 191,
        ['	ANOD GOLD'] = 170,
        ['	DARKPURPPRISMA'] = 214,
        ['	WHITE PRISMA'] = 211,
        ['	TURQ RED FLIP'] = 177,
        ['	CYAN PURP FLIP'] = 179,
        ['	MAGEN ORAN FLIP'] = 189,
        ['	MAGEN GREE FLIP'] = 184,
        ['	DARKPURPLEPEARL'] = 199,
        ['	YKTA FULL RBOW'] = 232,
        ['	ANOD GREEN'] = 165,
        ['	PURP RED FLIP'] = 182,
        ['	WHITE PURP FLIP'] = 193,
        ['	HOT PINK PRISMA'] = 215,
        ['	YKTA BUBBLEGUM'] = 231,
        ['	MAGEN YELL FLIP'] = 185,
        ['	BLUE PINK FLIP'] = 180,
        ['	BURG GREEN FLIP'] = 186,
        ['	LIT GREEN PEARL'] = 201,
        ['	ANOD LIME'] = 166,
        ['	OFFWHITE PRISMA'] = 205,
        ['	RED RAINBO FLIP'] = 194,
        ['	COPPE PURP FLIP'] = 188,
        ['	YKTA HSW'] = 239,
        ['	ANOD CHAMPAGNE'] = 169,
        ['	YKTA KAMENRIDER'] = 235,
        ['	YKTA MONIKA'] = 241,
        ['	YKTA SPRUNK EX'] = 226,
        ['	YKTA VICE CITY'] = 227,
        ['	BLACK HOLO'] = 221,
        ['	BLU RAINBO FLIP'] = 195,
        ['	GRAPHITE PRISMA'] = 212,
        ['	GREEN RED FLIP'] = 172,
        ['	PINK PEARL'] = 206,
        ['	YKTA SUNSETS'] = 233,
        ['	ANOD BLUE'] = 164,
        ['	YKTA CHROMABERA'] = 236,
        ['	YKTA TEMPERATUR'] = 238,
    }
}

Config.Penal = {
	[1] = {
		title = "Offenses to Persons",
		values = {
			[1] = {
				['months'] = 15,
				['color'] = 'mid',
				['title'] = 'Assault',
				['fine'] = 850
			},
			[2] = {
				['months'] = 30,
				['color'] = 'high',
				['title'] = 'Assault Deadly Weapon',
				['fine'] = 3750
			},
			[3] = {
				['months'] = 50,
				['color'] = 'high',
				['title'] = 'Attempted Murder Civilian',
				['fine'] = 7500
			},
			[4] = {
				['months'] = 50,
				['color'] = 'high',
				['title'] = 'Accessory to Second Degree Murder',
				['fine'] = 5000
			},
			[5] = {
				['months'] = 0,
				['color'] = 'high',
				['title'] = 'First Degree Murder',
				['fine'] = 0
			},
			[6] = {
				['months'] = 5,
				['color'] = 'mid',
				['title'] = 'Criminal Threats',
				['fine'] = 500
			},
			[7] = {
				['months'] = 20,
				['color'] = 'mid',
				['title'] = 'Hostage Taking',
				['fine'] = 1200
			},
			[8] = {
				['months'] = 0,
				['color'] = 'high',
				['title'] = 'Accessory to the murder public employee',
				['fine'] = 0
			},
			[9] = {
				['months'] = 15,
				['color'] = 'mid',
				['title'] = 'Kidnapping',
				['fine'] = 900
			}
		}
	},
	[2] = {
		title = "Offenses to Fraud",
		values = {
			[1] = {
				['months'] = 25,
				['color'] = 'low',
				['title'] = 'Robbery',
				['fine'] = 2000
			},
			[2] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Grand Theft',
				['fine'] = 600
			},
			[3] = {
				['months'] = 15,
				['color'] = 'mid',
				['title'] = 'Sale of items used in crime',
				['fine'] = 1000
			},
			[4] = {
				['months'] = 30,
				['color'] = 'mid',
				['title'] = 'Carjacking',
				['fine'] = 2000
			},
			[5] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Burglary',
				['fine'] = 500
			},
			[6] = {
				['months'] = 20,
				['color'] = 'low',
				['title'] = 'Theft of an Aircraft',
				['fine'] = 1000
			}
		}
	},
	[3] = {
		title = "Offenses to Fraud",
		values = {
			[1] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Possession of Stolen Identification',
				['fine'] = 750
			},
			[2] = {
				['months'] = 15,
				['color'] = 'low',
				['title'] = 'Impersonating',
				['fine'] = 1250
			},
			[3] = {
				['months'] = 15,
				['color'] = 'low',
				['title'] = 'Forgery',
				['fine'] = 750
			}
		}
	},
	[4] = {
		title = "Offenses to Damage Property",
		values = {
			[1] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Trespassing',
				['fine'] = 450
			},
			[2] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Vandalism',
				['fine'] = 300
			}
		}
	},
	[5] = {
		title = "Offenses to Law",
		values = {
			[1] = {
				['months'] = 25,
				['color'] = 'mid',
				['title'] = 'Accessory to Jailbreak',
				['fine'] = 2000
			},
			[2] = {
				['months'] = 20,
				['color'] = 'mid',
				['title'] = 'Attempted Jailbreak',
				['fine'] = 1500
			},
			[3] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Perjury',
				['fine'] = 0
			},
			[4] = {
				['months'] = 20,
				['color'] = 'low',
				['title'] = 'Violation of a Restraining Order',
				['fine'] = 2250
			},
			[5] = {
				['months'] = 5,
				['color'] = 'mid',
				['title'] = 'Resisting Arrest',
				['fine'] = 300
			},
			[6] = {
				['months'] = 30,
				['color'] = 'mid',
				['title'] = 'Jailbreak',
				['fine'] = 2500
			}
		}
	},
	[6] = {
		title = "Offenses to Order",
		values = {
			[1] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Disobeying a Officer',
				['fine'] = 750
			},
			[2] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'False Reporting',
				['fine'] = 750
			},
			[3] = {
				['months'] = 10,
				['color'] = 'mid',
				['title'] = 'Harassment',
				['fine'] = 500
			},
			[4] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Misdemeanor Obstruction of Justice',
				['fine'] = 500
			},
			[5] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Tampering',
				['fine'] = 500
			},
			[6] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Harboring a Fugitive',
				['fine'] = 1000
			},
			[7] = {
				['months'] = 15,
				['color'] = 'mid',
				['title'] = 'Aiding and Abetting',
				['fine'] = 450
			},
			[8] = {
				['months'] = 15,
				['color'] = 'low',
				['title'] = 'Failure to Provide Identification',
				['fine'] = 1500
			},
			[9] = {
				['months'] = 10,
				['color'] = 'mid',
				['title'] = 'Unlawful Assembly',
				['fine'] = 750
			}
		}
	},
	[7] = {
		title = "Offenses to Health",
		values = {
			[1] = {
				['months'] = 30,
				['color'] = 'mid',
				['title'] = 'Cultivation of Drug',
				['fine'] = 1500
			},
			[2] = {
				['months'] = 5,
				['color'] = 'low',
				['title'] = 'Misdemeanor Possession Drug',
				['fine'] = 250
			},
			[3] = {
				['months'] = 15,
				['color'] = 'low',
				['title'] = 'Felony Possession of Drug',
				['fine'] = 1000
			},
			[4] = {
				['months'] = 0,
				['color'] = 'high',
				['title'] = 'Drug Trafficking',
				['fine'] = 0
			}
		}
	},
	[8] = {
		title = "Offenses to Vehicle",
		values = {
			[1] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Illegal Turn',
				['fine'] = 150
			},
			[2] = {
				['months'] = 5,
				['color'] = 'low',
				['title'] = 'Driving While High',
				['fine'] = 300
			},
			[3] = {
				['months'] = 5,
				['color'] = 'low',
				['title'] = 'Evading',
				['fine'] = 400
			},
			[4] = {
				['months'] = 10,
				['color'] = 'mid',
				['title'] = 'Reckless Evading',
				['fine'] = 800
			},
			[5] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Driving without Headlights/Signals',
				['fine'] = 300
			},
			[6] = {
				['months'] = 15,
				['color'] = 'low',
				['title'] = 'Street Racing',
				['fine'] = 1500
			},
			[7] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Nonfunctional Vehicle',
				['fine'] = 75
			},
			[8] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Negligent Driving',
				['fine'] = 300
			},
			[9] = {
				['months'] = 10,
				['color'] = 'mid',
				['title'] = 'Reckless Driving',
				['fine'] = 750
			},
			[10] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Speeding',
				['fine'] = 750
			},
			[11] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Illegal Passing',
				['fine'] = 300
			},
			[12] = {
				['months'] = 10,
				['color'] = 'low',
				['title'] = 'Hit and Run',
				['fine'] = 500
			},
			[13] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Failure to Stop',
				['fine'] = 600
			}
		}
	},
	[9] = {
		title = "Offenses to Wildlife",
		values = {
			[1] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Hunting in Restricted Areas',
				['fine'] = 450
			},
			[2] = {
				['months'] = 0,
				['color'] = 'low',
				['title'] = 'Unlicensed Hunting',
				['fine'] = 450
			}
		}
	}
}
