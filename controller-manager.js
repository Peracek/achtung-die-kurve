class ControllerManager {
    constructor() {
        this.peer = null;
        this.connections = new Map();
        this.onInputCallback = null;
        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
        this.onPeerIdCallback = null;
        this.nextControllerId = 0;
        this.isHost = false;
        this.peerId = null;
        this.myControllerId = null;
    }
    
    initHost() {
        this.isHost = true;
        
        this.peer = new Peer();
        
        this.peer.on('open', (id) => {
            this.peerId = id;
            console.log('Host peer ID:', id);
            if (this.onPeerIdCallback) {
                this.onPeerIdCallback(id);
            }
        });
        
        this.peer.on('connection', (conn) => {
            const controllerId = this.nextControllerId++;
            this.connections.set(controllerId, conn);
            
            console.log('Controller connected:', controllerId);
            
            conn.on('open', () => {
                conn.send({
                    type: 'assign-id',
                    controllerId: controllerId
                });
                
                if (this.onConnectCallback) {
                    this.onConnectCallback(controllerId);
                }
            });
            
            conn.on('data', (data) => {
                if (data.type === 'input' && this.onInputCallback) {
                    this.onInputCallback(controllerId, data.data);
                }
            });
            
            conn.on('close', () => {
                console.log('Controller disconnected:', controllerId);
                this.connections.delete(controllerId);
                if (this.onDisconnectCallback) {
                    this.onDisconnectCallback(controllerId);
                }
            });
            
            conn.on('error', (err) => {
                console.error('Connection error:', err);
            });
        });
        
        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
        });
    }
    
    initController(hostPeerId) {
        this.isHost = false;
        
        this.peer = new Peer();
        
        this.peer.on('open', () => {
            console.log('Connecting to host:', hostPeerId);
            const conn = this.peer.connect(hostPeerId);
            
            conn.on('open', () => {
                console.log('Connected to host');
                this.hostConnection = conn;
            });
            
            conn.on('data', (data) => {
                if (data.type === 'assign-id') {
                    this.myControllerId = data.controllerId;
                    console.log('Assigned controller ID:', this.myControllerId);
                    if (this.onConnectCallback) {
                        this.onConnectCallback(this.myControllerId);
                    }
                }
            });
            
            conn.on('close', () => {
                console.log('Disconnected from host');
            });
            
            conn.on('error', (err) => {
                console.error('Connection error:', err);
            });
        });
        
        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
        });
    }
    
    sendInput(action, value) {
        if (!this.isHost && this.hostConnection) {
            this.hostConnection.send({
                type: 'input',
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
    
    onPeerId(callback) {
        this.onPeerIdCallback = callback;
    }
    
    getConnectedCount() {
        return this.connections.size;
    }
    
    getPeerId() {
        return this.peerId;
    }
    
    disconnect() {
        if (this.hostConnection) {
            this.hostConnection.close();
        }
        if (this.peer) {
            this.peer.destroy();
        }
    }
}
