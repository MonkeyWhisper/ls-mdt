local LS_CORE = exports["ls-core"]:GetCoreObject()

LS_CORE.Callback.Functions.CreateCallback("ls-mdt:s:getMDTData", function(source, cb)
    local Player = LS_CORE.Functions.GetPlayer(source)
    if Player == nil then return end

    local new_player = Player
    new_player.identifier = Player.Player.PlayerData.citizenid
    if Config.Functions.GetJob(Player.Player.PlayerData.job.name) then new_player.department = Config.Functions.GetJob(Player.Player.PlayerData.job.name).label or "NULL" end
    new_player.job = Player.Player.PlayerData.job
    new_player.charinfo = Player.Player.PlayerData.charinfo

    local MDT_DATA = {
        employees = {},
        bulletin_board = {},
        dispatchs = Config.Functions.GetDispatches(),
        users = {},
        incidents = {},
        reports = {},
        bolo = {},
        vehicles = {},
        penal = Config.Penal,
        currentuser = new_player,
        departments = Config.PoliceJobs,
        jobs = Config.Functions.GetAllJobs(),
        licenses = Config.Functions.GetAllLicenses(LS_CORE),
    }

    local users = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `players` ORDER BY `id`', {})
    local vehicles = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `player_vehicles` ORDER BY `id`', {})

    local incidents = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `mdt_incidents` ORDER BY `id`', {})
    local report = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `mdt_report` ORDER BY `id`', {})
    local bolo = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `mdt_bolo` ORDER BY `id`', {})
    local data = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `mdt_data` ORDER BY `id`', {})

    local bulletin = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM `mdt_bulletin` ORDER BY `id`', {})

    local listedData = {}
    for k,v in pairs ( data ) do
        v.data = json.decode(v.data)
        listedData[v.identifier] = v.data
    end

    local listedPlayers = {}
    for k,v in pairs(users) do
        v.job = json.decode(v.job)
        v.charinfo = json.decode(v.charinfo)
        listedPlayers[v.citizenid] = v
    end
    
    for k,v in pairs(vehicles) do
		local error_text = ""
		if v.plate == nil then error_text = error_text .. " Code 9 - Plate Empty" v.plate = "None" end
		if v.vehicle == nil then error_text = error_text .. " Code 10 - Model Empty" v.vehicle = { model= "None" } end
		if error_text ~= "" then print(error_text) end
		
        local new_vehicle = {
            identifier = v.plate,
            class = "Vehicle",
            model = v.vehicle,
            owner = Config.Functions.GetName(listedPlayers[v.citizenid], "both"),
            color = Config.Functions.FindColor(json.decode(v.mods).color1),
        }
        local vehicle_data = listedData[new_vehicle.identifier] or { description = "", tags = {}, gallery = {}, profileimage = "https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg" }

        new_vehicle.tags = vehicle_data.tags
        new_vehicle.gallery = vehicle_data.gallery
        new_vehicle.description = vehicle_data.description
        new_vehicle.profileimage = vehicle_data.profileimage
        MDT_DATA.vehicles[new_vehicle.identifier] = new_vehicle
    end

    for k,v in pairs(users) do
		local error_text = ""
		if v.citizenid == nil then error_text = error_text .. " Code 3 - Identifier Empty" v.citizenid = "None" end
		if v.charinfo.firstname == nil then error_text = error_text .. " Code 4 - Firstname Empty" v.charinfo.firstname = "None" end
		if v.charinfo.lastname == nil then error_text = error_text .. " Code 5 - Lastname Empty" v.charinfo.lastname = "None" end
		if v.charinfo.birthdate == nil then error_text = error_text .. " Code 6 - Date Of Birth Empty" v.charinfo.birthdate = "00/00/0000" end
		if v.job.name == nil then error_text = error_text .. " Code 7 - Job Empty" v.job.name = "unemployed" end
		if v.job.grade == nil then error_text = error_text .. " Code 8 - Job Grade Empty" end
		if error_text ~= "" then print(error_text) end
		
        local new_user = {
            identifier = v.citizenid,
            charinfo = {
                firstname = Config.Functions.GetName(v, "firstname"),
                lastname = Config.Functions.GetName(v, "surname"),
                dob = v.charinfo.birthdate,
            },
            job = {
                name = v.job.name,
                label = v.job.label,
                grade = v.job.grade.name,
            },

            properties = {"Inteii"},
            gallery = { "https://s.abcnews.com/images/US/george-floyd-ap-jt-200529_hpMain_2_4x3t_608.jpg" },
            profileimage = "https://s.abcnews.com/images/US/george-floyd-ap-jt-200529_hpMain_2_4x3t_608.jpg",
            tags = { "Wanted", "Idiot" },
            vehicles = {"5MD31 - Taurus"},
            licenses = Config.Functions.GetPlayerLicenses(LS_CORE, v),
        }

        local get_user = LS_CORE.Functions.GetPlayerFrameworkIdentifier(v.citizenid)
        if get_user then
            new_user.user = get_user
            new_user.job = {
                name = get_user.PlayerData.job.name,
                label = get_user.PlayerData.job.label,
                grade = get_user.PlayerData.job.grade.name,
            }
            new_user.licenses = get_user.PlayerData.metadata.licences
        end

        local user_data = listedData[new_user.identifier] or { vehicles = {}, properties = {}, licenses = {}, tags = {}, gallery = {}, profileimage = "https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg" }
        new_user.properties = user_data.properties or {}
        new_user.tags = user_data.tags or {}
        new_user.gallery = user_data.gallery or {}
        new_user.vehicles = GetOwnedVehicles(vehicles, v.identifier) or {}
        new_user.profileimage = user_data.profileimage or "https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg"

        MDT_DATA.users[new_user.identifier] = new_user
    end

    for k,v in pairs(incidents) do
        MDT_DATA.incidents[v.identifier] = json.decode(v.data)
    end
    for k,v in pairs(report) do
        MDT_DATA.reports[v.identifier] = json.decode(v.data)
    end
    for k,v in pairs(bolo) do
        MDT_DATA.bolo[v.identifier] = json.decode(v.data)
    end
    for k,v in pairs(bulletin) do
        MDT_DATA.bulletin_board[v.identifier] = json.decode(v.data)
    end

    for k,v in pairs( users ) do
        local get_user = LS_CORE.Functions.GetPlayerFrameworkIdentifier(v.citizenid)
        if get_user then
            local user_get = MDT_DATA.users[v.citizenid]
            if user_get and Config.Functions.GetJob(get_user.PlayerData.job.name) then
                local new_employee = {
                    identifier = user_get.identifier,
                    employee_identifier = user_get.identifier.."_employee",
                    name = Config.Functions.GetName(listedPlayers[user_get.identifier], "both"),
                    onduty = true,
                    department = Config.Functions.GetJob(get_user.PlayerData.job.name).label,
                    callsign = "NO CALLSIGN",
                    radio = 0,
                    source_id = get_user.PlayerData.source,
                    user_employee = get_user,
                    history = {
                        responded_week = 0,
                    }
                }
				
				local user_id = LS_CORE.Functions.GetPlayer(get_user.PlayerData.source)
				
                new_employee.callsign = user_id.DATA.callsign or "NO CALLSIGN"
                new_employee.radio = user_id.DATA.radio or 0
                new_employee.onduty = user_id.DATA.onduty or false
                new_employee.history = user_id.DATA.history or { responded_week = 0 }

                MDT_DATA.employees[user_get.identifier] = new_employee
            end
        end
    end

    cb(MDT_DATA)
end)

function GetOwnedVehicles(VEHICLES, identifier)
    local OWNED_VEHICLES = {}
    for k,v in pairs ( VEHICLES ) do
        if v.citizenid == identifier then
            OWNED_VEHICLES[#OWNED_VEHICLES+1] = v.plate .. " - " .. v.vehicle 
        end
    end
    return OWNED_VEHICLES
end

RegisterNetEvent("ls-mdt:s:respondDispatch", function(data)

    local Player = LS_CORE.Functions.GetPlayer(source)
    if Player == nil then return end

    local newPlayer = {
        identifier = Player.Player.PlayerData.citizenid,
        job = { name = Player.Player.PlayerData.job.name },
        fullname = Config.Functions.GetName(Player.Player.PlayerData, "both"),
        callsign = data.UNIT_DATA.callsign,
    }

    TriggerEvent('dispatch:addUnit', data.RESPONSE_DATA.callId, newPlayer, function(returnData)
        if returnData ~= nil then
            TriggerClientEvent('ls-mdt:c:respondDispatch', -1, returnData)
        end
    end)

end)

RegisterNetEvent("ls-mdt:s:detachDispatch", function(data)

    local Player = LS_CORE.Functions.GetPlayer(source)
    if Player == nil then return end

    local newPlayer = {
        identifier = Player.Player.PlayerData.citizenid,
        job = { name = Player.Player.PlayerData.job.name },
        fullname = Config.Functions.GetName(Player.Player.PlayerData, "both"),
    }

    TriggerEvent('dispatch:removeUnit', data.RESPONSE_DATA.callId, newPlayer, function(returnData)
        if returnData ~= nil then
            TriggerClientEvent('ls-mdt:c:respondDispatch', -1, returnData)
        end
    end)
end)

RegisterNetEvent("ls-mdt:s:setUnitData", function(data)
    local src = source

    Config.Functions.SetUnitData(LS_CORE, data.UNIT_DATA)

    TriggerClientEvent("ls-mdt:c:setUnitData", -1, data)

    if data.TYPE == "set_radio" then
        TriggerClientEvent("ls-mdt:c:setRadio", src, data.UNIT_DATA.radio)
    end
end)

RegisterNetEvent("ls-mdt:s:setDepartment", function(data)
    if (data.TYPE == "grade") then
        LS_CORE.Functions.GetPlayerFrameworkIdentifier(data.UNIT_DATA.identifier).Functions.SetJob(data.UNIT_DATA.user_employee.PlayerData.job.name, tostring(data.NEW_GRADE))
    elseif (data.TYPE == "fire") then
        LS_CORE.Functions.GetPlayerFrameworkIdentifier(data.UNIT_DATA.identifier).Functions.SetJob("unemployed", 0)
        TriggerClientEvent("ls-mdt:c:closeMDT", data.UNIT_DATA.source_id)
    elseif (data.TYPE == "add") then
        LS_CORE.Functions.GetPlayerFrameworkIdentifier(data.UNIT_DATA.identifier).Functions.SetJob(data.CURRENT_DATA.job.name, 0)
    end
end)

RegisterNetEvent("ls-mdt:s:saveData", function(data)
    if data.TYPE == "profile" then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM mdt_data where identifier = ?', { data.NEW_DATA.identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `mdt_data` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = data.NEW_DATA.identifier,
                ['@data']       = json.encode(data.NEW_DATA),
            })
        else
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `mdt_data` (identifier, data) VALUES (:identifier, :data)', {
                identifier = data.NEW_DATA.identifier,
                data = json.encode(data.NEW_DATA),
            })
        end
        Config.Functions.SetPlayerData(LS_CORE, data.NEW_DATA)
    elseif data.TYPE == "vehicle" then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM mdt_data where identifier = ?', { data.NEW_DATA.identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `mdt_data` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = data.NEW_DATA.identifier,
                ['@data']       = json.encode(data.NEW_DATA),
            })
        else
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `mdt_data` (identifier, data) VALUES (:identifier, :data)', {
                identifier = data.NEW_DATA.identifier,
                data = json.encode(data.NEW_DATA),
            })
        end
    elseif data.TYPE == "bolo" then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM mdt_bolo where identifier = ?', { data.NEW_DATA.identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `mdt_bolo` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = data.NEW_DATA.identifier,
                ['@data']       = json.encode(data.NEW_DATA),
            })
        else
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `mdt_bolo` (identifier, data) VALUES (:identifier, :data)', {
                identifier = data.NEW_DATA.identifier,
                data = json.encode(data.NEW_DATA),
            })
        end
    elseif data.TYPE == "report" then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM mdt_report where identifier = ?', { data.NEW_DATA.identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `mdt_report` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = data.NEW_DATA.identifier,
                ['@data']       = json.encode(data.NEW_DATA),
            })
        else
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `mdt_report` (identifier, data) VALUES (:identifier, :data)', {
                identifier = data.NEW_DATA.identifier,
                data = json.encode(data.NEW_DATA),
            })
        end
    elseif data.TYPE == "incident" then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM mdt_incidents where identifier = ?', { data.NEW_DATA.identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `mdt_incidents` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = data.NEW_DATA.identifier,
                ['@data']       = json.encode(data.NEW_DATA),
            })
        else
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `mdt_incidents` (identifier, data) VALUES (:identifier, :data)', {
                identifier = data.NEW_DATA.identifier,
                data = json.encode(data.NEW_DATA),
            })
        end
    elseif data.TYPE == "bulletin" then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM mdt_bulletin where identifier = ?', { data.NEW_DATA.identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `mdt_bulletin` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = data.NEW_DATA.identifier,
                ['@data']       = json.encode(data.NEW_DATA),
            })
        else
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `mdt_bulletin` (identifier, data) VALUES (:identifier, :data)', {
                identifier = data.NEW_DATA.identifier,
                data = json.encode(data.NEW_DATA),
            })
        end
    end
    TriggerClientEvent("ls-mdt:c:saveData", -1, data)
end)


LS_CORE.Callback.Functions.CreateCallback("ls-mdt:s:getWebhook",function(source,cb)
	if Config.Webhook ~= "" then
		cb(Config.Webhook)
	else
		print('Set your webhook from Config!')
		cb(nil)
	end
end)

Citizen.CreateThread(function()
	Citizen.Wait(1000)
	LS_CORE.Functions.GetVersionScript(Config.Version, "ls-mdt")
end)