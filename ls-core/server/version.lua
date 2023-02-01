LS_CORE.Functions.GetVersionScript = function(CURRENT_VERSION, SCRIPT_NAME)
    PerformHttpRequest("https://raw.githubusercontent.com/LquenS/ls-core/main/versions.json", function (_, data, __)
        if data ~= nil then
            local SCRIPT_LIST = json.decode(data)
            for _, value in pairs ( SCRIPT_LIST ) do 
                if value.name == SCRIPT_NAME then
                    print("[ls-core] " .. SCRIPT_NAME .. " checking started.")
                    Citizen.Wait(500)
                    if value.version == CURRENT_VERSION then
                        print("[ls-core] " ..SCRIPT_NAME.. " version is latest\n[ls-core] Version name " .. value.version_name..".\n".."[ls-core] " .. value.version_desc..".")
                    else
                        print("[ls-core] " ..SCRIPT_NAME.. " is outdated, needs to be updated!\n[ls-core] Latest version is " .. value.version .. ".")
                    end
                end
            end
        else
            print("[ls-core] Versions cannot accessiable. Wait do not distrub dev, it\'s will pass soon!")
        end
    end)
end

Citizen.CreateThread(function()
    Citizen.Wait(1000)
    LS_CORE.Functions.GetVersionScript(LS_CORE.Config.VERSION, "ls-core")
end)

exports("CheckVersion", LS_CORE.Functions.GetVersionScript)
