AddEventHandler(LS_CORE_CONFIG.EVENTS.PlayerLoaded[LS_CORE_CONFIG.FRAMEWORK], function(Player)
    if (LS_CORE_CONFIG.FRAMEWORK == "QB") then
        LS_CORE.Player.CreatePlayerData(Player.PlayerData.source)
    else
        LS_CORE.Player.CreatePlayerData(Player)
    end
end)