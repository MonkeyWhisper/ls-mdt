--//#    CALLBACK STUFF  #\\--

LS_CORE.Callback = {}
LS_CORE.Callback.Functions = {}
LS_CORE.Callback.ServerCallbacks = {}
LS_CORE.Callback.ClientCallbacks = {}

function LS_CORE.Callback.Functions.TriggerCallback(name, cb, ...)
    LS_CORE.Callback.ServerCallbacks[name] = cb
    TriggerServerEvent('ls-core:Server:TriggerCallback', name, ...)
end

RegisterNetEvent('ls-core:Client:TriggerCallback', function(name, ...)
    if LS_CORE.Callback.ServerCallbacks[name] then
        LS_CORE.Callback.ServerCallbacks[name](...)
        LS_CORE.Callback.ServerCallbacks[name] = nil
    end
end)

--//#                     #\\--