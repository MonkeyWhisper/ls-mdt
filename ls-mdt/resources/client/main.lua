local LS_CORE = exports["ls-core"]:GetCoreObject()
local MDT_IS_OPEN = false


local TABLET = {
    DICT = "amb@code_human_in_bus_passenger_idles@female@tablet@base",
    ANIM = "base",
    PROP = "prop_cs_tablet",
    BONE = 60309,
    ROTATION = vector3(10.0, 160.0, 0.0),
}

function MDT_ANIMATION()
    if not MDT_IS_OPEN then return end

    RequestAnimDict(TABLET.DICT)
    while not HasAnimDictLoaded(TABLET.DICT) do 
		Citizen.Wait(10) 
	end

    RequestModel(TABLET.PROP)
    while not HasModelLoaded(TABLET.PROP) do 
		Citizen.Wait(10)
	end

    local PED, TABLET_OBJ = PlayerPedId(), CreateObject(TABLET.PROP, 0.0, 0.0, 0.0, true, true, false)
    local BONE_INDEX = GetPedBoneIndex(PED, TABLET.BONE)

    AttachEntityToEntity(TABLET_OBJ, PED, BONE_INDEX, 0.0, 0.0, 0.0, TABLET.ROTATION.x, TABLET.ROTATION.y, TABLET.ROTATION.z, true, false, false, false, 2, true)
	
    CreateThread(function()
        while MDT_IS_OPEN do
            Wait(100)
            if not IsEntityPlayingAnim(PED, TABLET.DICT, TABLET.ANIM, 3) then TaskPlayAnim(PED, TABLET.DICT, TABLET.ANIM, 3.0, 3.0, -1, 49, 0, 0, 0, 0) end
        end

        ClearPedSecondaryTask(PED)
        DetachEntity(TABLET_OBJ, true, false)
        DeleteEntity(TABLET_OBJ)
    end)
end


function CanOpenMDT()
    local USER_DATA = LS_CORE.Functions.GetPlayerData()
	
	if USER_DATA.PlayerData == nil then 
		print("Code 1 - empty PlayerData detected")
		return false
	end

    local PED = PlayerPedId()

    if not Config.Functions.GetJob(USER_DATA.PlayerData.job.name) then return end
    if not Config.Functions.GetJob(USER_DATA.PlayerData.job.name).canuse then return end

    if IsPedRagdoll(PED) or IsPedJumping(PED) or IsPedInHighCover(PED) or IsPedInCover(PED) or IsPedInParachuteFreeFall(PED) or IsPedClimbing(PED) or IsPedSwimming(PED) then return false end
    return true
end


if Config.Functions.MDTCommand ~= "" then
	RegisterCommand(Config.Functions.MDTCommand, function()
		OpenMDT()
	end)
end

function OpenMDT() 
	if not MDT_IS_OPEN and CanOpenMDT() then
        LS_CORE.Callback.Functions.TriggerCallback('ls-mdt:s:getMDTData', function(DATA)
            MDT_IS_OPEN = true
            SendNUIMessage({
                action = "ui",
                type = true,
                MDT_DATA = DATA
            })
            SetNuiFocus(true, true)

            MDT_ANIMATION()
		end)
    end
end
exports("OpenMDT", OpenMDT)

RegisterNetEvent("ls-mdt:c:closeMDT", function(DATA)
    SendNUIMessage({
        action = "ui",
        type = false,
        MDT_DATA = DATA
    })
end)

RegisterNetEvent("ls-mdt:c:setUnitData", function(data)
    SendNUIMessage({
        action = "setUnitData",
        INFO = data,
    })
end)

RegisterNetEvent("ls-mdt:c:saveData", function(data)
    SendNUIMessage({
        action = "saveData",
        INFO = data,
    })
end)

RegisterNetEvent('ls-mdt:c:respondDispatch', function(data)
    SendNUIMessage({ 
        action = "updateDispatch", 
        NEW_DATA = data,
    })
end)

RegisterNetEvent('dispatch:clNotify', function(sNotificationData, sNotificationId)
    if sNotificationData ~= nil then
		if sNotificationData.origin ~= nil then
            SendNUIMessage({
                action = "newCallAdd",
                callID = sNotificationId,
                data = sNotificationData,
            })
        end
    end
end)

RegisterNetEvent("ls-mdt:c:setRadio", function(radio)
    Config.Functions.SetRadio(radio)
end)

RegisterNetEvent("ls-mdt:c:respondToCall", function()
    SendNUIMessage({ 
        action = "respondToCall", 
    })
end)




































RegisterNUICallback("closeNUI", function()
    MDT_IS_OPEN = false
    SetNuiFocus(false, false)
end)

RegisterNUICallback("setWaypoint", function( data )
    
    local UNIT = data.UNIT_DATA

    local coords = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(UNIT.source_id)))
    SetNewWaypoint(coords.x, coords.y)
end)

RegisterNUICallback("setWaypointResponse", function( data )
    
    local RESPONSE = data.RESPONSE_DATA

    SetNewWaypoint(RESPONSE.origin.x, RESPONSE.origin.y)
end)

RegisterNUICallback("respondDispatch", function( data )
    TriggerServerEvent("ls-mdt:s:respondDispatch", data)
end)
RegisterNUICallback("detachDispatch", function( data )
    TriggerServerEvent("ls-mdt:s:detachDispatch", data)
end)

RegisterNUICallback("setUnitData", function( data )
    TriggerServerEvent("ls-mdt:s:setUnitData", data)
end)

RegisterNUICallback("setDepartment", function( data )
    TriggerServerEvent("ls-mdt:s:setDepartment", data)
end)

RegisterNUICallback("saveData", function( data )
    TriggerServerEvent("ls-mdt:s:saveData", data)
end)

RegisterNUICallback("takePhoto", function( __, cb )
    SetNuiFocus(false, false)
    CreateMobilePhone(1)
    CellCamActivate(true, true)
    local takePhoto = true
    while takePhoto do
        if IsControlJustPressed(1, 177) then
            DestroyMobilePhone()
            CellCamActivate(false, false)
            cb(nil)
            break
        elseif IsControlJustPressed(1, 176) then
            LS_CORE.Callback.Functions.TriggerCallback("ls-mdt:s:getWebhook",function(hook)
                if hook then
                    exports['screenshot-basic']:requestScreenshotUpload(tostring(hook), "files[]", function(data)
                        local image = json.decode(data)
                        DestroyMobilePhone()
                        CellCamActivate(false, false)
                        Wait(1000)
                        cb(image.attachments[1].proxy_url)
                    end)
                else
                    return
                end
            end)
            takePhoto = false
        end
        HideHudComponentThisFrame(7)
        HideHudComponentThisFrame(8)
        HideHudComponentThisFrame(9)
        HideHudComponentThisFrame(6)
        HideHudComponentThisFrame(19)
        HideHudAndRadarThisFrame()
        EnableAllControlActions(0)
        Wait(0)
    end
    Wait(1000)
    MDT_IS_OPEN = true
    SendNUIMessage({
        action = "ui_partly",
        type = true,
    })
    MDT_ANIMATION()
    SetNuiFocus(true, true)
end)