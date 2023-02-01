LS_CORE = { }
LS_CORE.Config = LS_CORE_CONFIG
LS_CORE.PLAYER_DATA = {}

LS_CORE.Functions = {}

if (LS_CORE.Config.FRAMEWORK == "QB") then
    QBCore = exports['qb-core']:GetCoreObject()
elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
    ESX = nil
    Citizen.CreateThread(function() while ESX == nil do TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end) Citizen.Wait(30) end end)
end

RegisterNetEvent('LS_CORE:PLAYER:SETPLAYERDATA', function(val)
    LS_CORE.PLAYER_DATA = val
end)

LS_CORE.Functions.GetPlayerData = function()
	LS_CORE.PLAYER_DATA.PlayerData = LS_CORE.Functions.GetPlayerDataFromFramework()
	
    return LS_CORE.PLAYER_DATA
end

LS_CORE.Functions.GetPlayerDataFromFramework = function ()
    local Player = nil
    if (LS_CORE.Config.FRAMEWORK == "QB") then
        Player =  QBCore.Functions.GetPlayerData()
    elseif (LS_CORE.Config.FRAMEWORK == "ESX") then
        Player =  ESX.GetPlayerData()
    end
	
    return Player
end

LS_CORE.Functions.GetPeds = function(ignoreList)
    local pedPool = GetGamePool('CPed')
    local peds = {}
    ignoreList = ignoreList or {}
    for i = 1, #pedPool, 1 do
        local found = false
        for j = 1, #ignoreList, 1 do
            if ignoreList[j] == pedPool[i] then
                found = true
            end
        end
        if not found then
            peds[#peds + 1] = pedPool[i]
        end
    end
    return peds
end

LS_CORE.Functions.GetCoords = function(entity)
    local coords = GetEntityCoords(entity)
    return vector4(coords.x, coords.y, coords.z, GetEntityHeading(entity))
end

LS_CORE.Functions.RequestAnimDict = function(animDict)
	if HasAnimDictLoaded(animDict) then return end
	RequestAnimDict(animDict)
	while not HasAnimDictLoaded(animDict) do Wait(10) end
end

LS_CORE.Functions.PlayAnim = function(animDict, animName, upperbodyOnly, duration)
    local flags = upperbodyOnly and 16 or 0
    local runTime = duration or -1
    LS_CORE.Functions.RequestAnimDict(animDict)
    TaskPlayAnim(PlayerPedId(), animDict, animName, 8.0, 1.0, runTime, flags, 0.0, false, false, true)
    RemoveAnimDict(animDict)
end

LS_CORE.Functions.GetClosestPed = function(coords, ignoreList)
    local ped = PlayerPedId()
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    ignoreList = ignoreList or {}
    local peds = LS_CORE.Functions.GetPeds(ignoreList)
    local closestDistance = -1
    local closestPed = -1
    for i = 1, #peds, 1 do
        local pedCoords = GetEntityCoords(peds[i])
        local distance = #(pedCoords - coords)

        if closestDistance == -1 or closestDistance > distance then
            closestPed = peds[i]
            closestDistance = distance
        end
    end
    return closestPed, closestDistance
end

LS_CORE.Functions.GetClosestPlayer = function(coords)
    local ped = PlayerPedId()
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    local closestPlayers = LS_CORE.Functions.GetPlayersFromCoords(coords)
    local closestDistance = -1
    local closestPlayer = -1
    for i = 1, #closestPlayers, 1 do
        if closestPlayers[i] ~= PlayerId() and closestPlayers[i] ~= -1 then
            local pos = GetEntityCoords(GetPlayerPed(closestPlayers[i]))
            local distance = #(pos - coords)

            if closestDistance == -1 or closestDistance > distance then
                closestPlayer = closestPlayers[i]
                closestDistance = distance
            end
        end
    end
    return closestPlayer, closestDistance
end

LS_CORE.Functions.GetPlayersFromCoords = function(coords, distance)
    local players = GetActivePlayers()
    local ped = PlayerPedId()
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    distance = distance or 5
    local closePlayers = {}
    for _, player in pairs(players) do
        local target = GetPlayerPed(player)
        local targetCoords = GetEntityCoords(target)
        local targetdistance = #(targetCoords - coords)
        if targetdistance <= distance then
            closePlayers[#closePlayers + 1] = player
        end
    end
    return closePlayers
end

LS_CORE.Functions.GetClosestVehicle = function(coords)
    local ped = PlayerPedId()
    local vehicles = GetGamePool('CVehicle')
    local closestDistance = -1
    local closestVehicle = -1
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    for i = 1, #vehicles, 1 do
        local vehicleCoords = GetEntityCoords(vehicles[i])
        local distance = #(vehicleCoords - coords)

        if closestDistance == -1 or closestDistance > distance then
            closestVehicle = vehicles[i]
            closestDistance = distance
        end
    end
    return closestVehicle, closestDistance
end

LS_CORE.Functions.GetClosestObject = function(coords)
    local ped = PlayerPedId()
    local objects = GetGamePool('CObject')
    local closestDistance = -1
    local closestObject = -1
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    for i = 1, #objects, 1 do
        local objectCoords = GetEntityCoords(objects[i])
        local distance = #(objectCoords - coords)
        if closestDistance == -1 or closestDistance > distance then
            closestObject = objects[i]
            closestDistance = distance
        end
    end
    return closestObject, closestDistance
end






exports('GetCoreObject', function()
    return LS_CORE
end)