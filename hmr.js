export default function hmr() {
    return {
        name: 'custom-hmr',
        enforce: 'post',
        // HMR
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.js')) {
                console.log('Reloading...');

                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
            }
        },
    }
}