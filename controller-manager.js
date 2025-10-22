class ControllerManager {
    constructor() {
        this.controllers = new Map();
        this.onInputCallback = null;
        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
        this.nextControllerId = 0;
        this.channel = null;
        this.isHost = false;
    }
    
    initHost() {
        this.isHost = true;
        this.channel = new BroadcastChannel('game-controller');
        
        this.channel.onmessage = (event) => {
            const { type, controllerId, data } = event.data;
            
            if (type === 'connect') {
                const newId = this.nextControllerId++;
                this.controllers.set(newId, { connected: true });
                
                this.channel.postMessage({
                    type: 'assign-id',
                    controllerId: newId
                });
                
                if (this.onConnectCallback) {
                    this.onConnectCallback(newId);
                }
            } else if (type === 'input') {
                if (this.onInputCallback && this.controllers.has(controllerId)) {
                    this.onInputCallback(controllerId, data);
                }
            } else if (type === 'disconnect') {
                if (this.controllers.has(controllerId)) {
                    this.controllers.delete(controllerId);
                    if (this.onDisconnectCallback) {
                        this.onDisconnectCallback(controllerId);
                    }
                }
            }
        };
    }
    
    initController() {
        this.isHost = false;
        this.channel = new BroadcastChannel('game-controller');
        
        this.channel.onmessage = (event) => {
            const { type, controllerId } = event.data;
            
            if (type === 'assign-id') {
                this.myControllerId = controllerId;
                if (this.onConnectCallback) {
                    this.onConnectCallback(controllerId);
                }
            }
        };
        
        this.channel.postMessage({ type: 'connect' });
    }
    
    sendInput(action, value) {
        if (!this.isHost && this.myControllerId !== undefined) {
            this.channel.postMessage({
                type: 'input',
                controllerId: this.myControllerId,
                data: { action, value }
            });
        }
    }
    
    onConnect(callback) {
        this.onConnectCallback = callback;
    }
    
    onDisconnect(callback) {
        this.onDisconnectCallback = callback;
    }
    
    onInput(callback) {
        this.onInputCallback = callback;
    }
    
    getConnectedCount() {
        return this.controllers.size;
    }
    
    disconnect() {
        if (!this.isHost && this.myControllerId !== undefined) {
            this.channel.postMessage({
                type: 'disconnect',
                controllerId: this.myControllerId
            });
        }
        if (this.channel) {
            this.channel.close();
        }
    }
}
