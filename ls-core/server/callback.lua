--//#    CALLBACK STUFF  #\\--

LS_CORE.Callback = {}
LS_CORE.Callback.Functions = {}
LS_CORE.Callback.ServerCallbacks = {}

LS_CORE.Callback.Functions.CreateCallback = function(name, cb)
    LS_CORE.Callback.ServerCallbacks[name] = cb
end

LS_CORE.Callback.Functions.TriggerCallback = function(name, source, cb, ...)
    local src = source
    if LS_CORE.Callback.ServerCallbacks[name] then
        LS_CORE.Callback.ServerCallbacks[name](src, cb, ...)
    end
end


RegisterNetEvent('ls-core:Server:TriggerCallback', function(name, ...)
    local src = source
    LS_CORE.Callback.Functions.TriggerCallback(name, src, function(...)
        TriggerClientEvent('ls-core:Client:TriggerCallback', src, name, ...)
    end, ...)
end)

--//#                     #\\--


