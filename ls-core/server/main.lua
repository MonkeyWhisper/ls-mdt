LS_CORE = { }
LS_CORE.Config = LS_CORE_CONFIG
LS_CORE.Functions = {}
LS_CORE.Player = {} 
LS_CORE.Players = {} 


if (LS_CORE.Config.FRAMEWORK == "QB") then
    QBCore = exports['qb-core']:GetCoreObject()
elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
    ESX = nil

    Citizen.CreateThread(function() while ESX == nil do TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end) Citizen.Wait(30) end end)
end

LS_CORE.Functions.GetPlayer = function (source)
    local Player = LS_CORE.Players[source]
	if Player == nil then return nil end
	Player.RefreshPlayer()
	
    return Player
end
exports('GetPlayer', function(source)
    return LS_CORE.Functions.GetPlayer(source)
end)

LS_CORE.Functions.GetIdentifier = function (id)
    for src in pairs(LS_CORE.Players) do
        if LS_CORE.Players[src].DATA.identifier == id then
            local Player = LS_CORE.Players[src]
            Player.RefreshPlayer()

            return Player
        end
    end
    return nil
end
exports('GetIdentifier', function(id)
    return LS_CORE.Functions.GetIdentifier(id)
end)

LS_CORE.Functions.GetPlayerFramework = function (source)
    local Player = nil
    if (LS_CORE.Config.FRAMEWORK == "QB") then
        Player =  QBCore.Functions.GetPlayer(source)
    elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
        Player =  ESX.GetPlayerFromId(source)
    end
     

    return Player
end

LS_CORE.Functions.GetPlayerFrameworkIdentifier = function (identifier)
    local Player = nil
    if (LS_CORE.Config.FRAMEWORK == "QB") then
        Player =  QBCore.Functions.GetPlayerByCitizenId(identifier)
    elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
        Player =  ESX.GetPlayerFromIdentifier(identifier)
    end
     

    return Player
end


LS_CORE.Functions.GetPlayerIdentifier = function (source)
    local Identifier = nil
    if (LS_CORE.Config.FRAMEWORK == "QB") then
        Identifier=  LS_CORE.Functions.GetPlayerFramework(source).PlayerData.citizenid
    elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
        Identifier=  LS_CORE.Functions.GetPlayerFramework(source).identifier
    end
     

    return Identifier
end


LS_CORE.Player.CreatePlayerData = function(source)
    local identifier = LS_CORE.Functions.GetPlayerIdentifier(source)
	
	local Database = {}
	local result = LS_CORE.Config.DATABASE(LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM ls_core where identifier = ?', { identifier })
	if result[1] ~= nil then
		Database = json.decode(result[1].data)
	end
    local Data = Database

    Data.identifier = identifier
    Data.Reputation = Data.Reputation or 0
    Data.XP = Data.XP or 0
    Data.Skills = Data.Skills or { }
    

    local createdUser = LS_CORE.Player.CreatePlayer(source, Data)

    TriggerClientEvent("LS_CORE:PLAYER:CREATED", source, createdUser)
    TriggerEvent("LS_CORE:PLAYER:CREATED", createdUser)
end

LS_CORE.Player.CreatePlayer = function(source, PLAYER_DATA)
    local self = {}
    self.Functions = {}
    
    self.Source = source
    self.Identifier = PLAYER_DATA.identifier
    self.DATA = PLAYER_DATA
    self.Player = LS_CORE.Functions.GetPlayerFramework(self.Source)
	
	self.RefreshPlayer = function ()
		self.Player = LS_CORE.Functions.GetPlayerFramework(self.Source)
	end
    
    
    self.Functions.GetPlayerData = function ()
        return self.DATA
    end

    self.Functions.SetPlayerData = function (PlayerInfo)
        self.DATA = PlayerInfo

        TriggerEvent('LS_CORE:PLAYER:SETPLAYERDATA', self.DATA)
        TriggerClientEvent('LS_CORE:PLAYER:SETPLAYERDATA', self.Source, self.DATA)

        return self.DATA
    end




    self.Functions.Experience = function(type, amount)
        if (type == "ADD") then
            self.DATA.XP = tonumber(self.DATA.XP) + tonumber(amount)
        elseif (type == "REMOVE") then
            self.DATA.XP = tonumber(self.DATA.XP) - tonumber(amount)
        elseif (type == "RESET") then
            self.DATA.XP = 0
        end

        self.Functions.SetPlayerData(self.DATA)

        if tonumber(self.DATA.XP) >= LS_CORE.Config.Reputation[tostring(tonumber(self.DATA.Reputation) + 1)] then
            self.Functions.Reputation("ADD", 1)
            self.Functions.Experience("RESET", nil)
        end
    end

    
    
    self.Functions.Reputation = function(type, amount)
        if (type == "ADD") then
            self.DATA.Reputation = tonumber(self.DATA.Reputation) + tonumber(amount)
        elseif (type == "REMOVE") then
            self.DATA.Reputation = tonumber(self.DATA.Reputation) - tonumber(amount)
        elseif (type == "RESET") then
            self.DATA.Reputation = 0
        end

        self.Functions.SetPlayerData(self.DATA)
    end



    self.Functions.AddItem = function(item, amount, slot, info)
        if GetResourceState("ls-inventoryhud") ~= 'missing' then
            exports["ls-inventoryhud"]:AddItem(self.Source, item, amount, info)
        else
            if (LS_CORE.Config.FRAMEWORK == "QB") then
                self.Player.Functions.AddItem(item, amount, slot, info)
            elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
                self.Player.addInventoryItem(item, amount)
            end 
        end
    end

    self.Functions.RemoveItem = function(item, amount, slot)
        if GetResourceState("ls-inventoryhud") ~= 'missing' then
            exports["ls-inventoryhud"]:RemoveItem(self.PlayerData.source, slot, amount)
        else
            if (LS_CORE.Config.FRAMEWORK == "QB") then
                self.Player.Functions.RemoveItem(item, amount, slot)
            elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
                self.Player.removeInventoryItem(item, amount)
            end 
        end
    end

    self.Functions.GetItem = function(item)
        if GetResourceState("ls-inventoryhud") ~= 'missing' then
            local foundItem = exports["ls-inventoryhud"]:GetItem(self.PlayerData.source, item)
            if foundItem == nil then
                for _,v in pairs ( exports["ls-inventoryhud"]:GetItems(self.PlayerData.source) ) do
                    if (v._tpl == item) then
                        foundItem = v
                        break
                    end
                end
            end

            return foundItem
        else
            if (LS_CORE.Config.FRAMEWORK == "QB") then
                return self.Player.Functions.GetItemByName(item)
            elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
                return self.Player.getItem(item)
            end 
        end
    end

    

    self.Functions.GetPlayerMoney = function(type)
        if (LS_CORE.Config.FRAMEWORK == "QB") then
			local PlayerFUN = QBCore.Functions.GetPlayer(self.Source)
            return PlayerFUN.PlayerData.money[type]
        elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
			if type == "cash" then type = "money" end
            return self.Player.getAccount(type).money
        end 
    end

    self.Functions.AddMoney = function(type, amount, reason)
        if (LS_CORE.Config.FRAMEWORK == "QB") then
            self.Player.Functions.AddMoney(type, amount, reason)
        elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
			if type == "cash" then type = "money" end
            self.Player.addAccountMoney(type, amount)
        end 
    end

    self.Functions.RemoveMoney = function(type, amount, reason)
        if (LS_CORE.Config.FRAMEWORK == "QB") then
            self.Player.Functions.RemoveMoney(type, amount, reason)
        elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
			if type == "cash" then type = "money" end
            self.Player.removeAccountMoney(type, amount)
        end 
    end

    self.Functions.GetProfile = function()
        if (LS_CORE.Config.FRAMEWORK == "QB") then
            return self.Player.PlayerData.charinfo
        elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
            local result = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM users where identifier = ?', { self.Identifier })
            return result[1]
        end 
    end




    self.Functions.Save = function()
        LS_CORE.Player.Save(self.Source)
    end

    LS_CORE.Players[self.Source] = self
    self.Functions.SetPlayerData(self.DATA)

    RconPrint("[ls-core] Player "..self.Identifier.." has succesfully logged!\n")
    return self
end

function LS_CORE.Player.Save(source)
    local PlayerData = LS_CORE.Players[source]
    if PlayerData then
        local IsValid = LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'fetchAll', 'SELECT * FROM ls_core where identifier = ?', { PlayerData.Identifier })
        if IsValid[1] then
            LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'UPDATE `ls_core` SET `data` = @data WHERE `identifier` = @identifier', {
                ['@identifier'] = PlayerData.Identifier,
                ['@data']       = json.encode(PlayerData.DATA),
            })
        else
            -- LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `ls_core` (identifier, data) VALUES (:identifier, :data)', {
                -- identifier = PlayerData.Identifier,
                -- data = json.encode(PlayerData.DATA),
            -- })
			LS_CORE.Config.DATABASE( LS_CORE.Config.DATABASE_NAME, 'execute', 'INSERT INTO `ls_core` (identifier, data) VALUES (@identifier, @data)', {
                ["@identifier"] = PlayerData.Identifier,
                ["data"] = json.encode(PlayerData.DATA),
            })
        end

    else
        RconPrint("[ls-core] PLAYER CANNOT FOUND\n")
    end
end


AddEventHandler('playerDropped', function()
    local src = source
    if not LS_CORE.Players[src] then return end
    local Player = LS_CORE.Players[src]
    
    Player.Functions.Save()
    LS_CORE.Players[src] = nil
end)

exports('GetCoreObject', function()
    return LS_CORE
end)