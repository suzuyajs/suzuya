import {App as CordisApp,Plugin,Context as CordisContext} from 'cordis'

import ServiceOptions = CordisContext.ServiceOptions;

CordisContext.service('service')

declare module 'cordis'{
    interface Context{
        service : (service:keyof any,options?:ServiceOptions)=>void
    }
}

export class App{
    app : CordisApp
    plugins : Map<string,Plugin>
    constructor() {
        this.app=new CordisApp
        this.app.service = (service:keyof any,options?:ServiceOptions)=>{
            CordisContext.service(service,options)
        }
        this.plugins = new Map<string, Plugin>()
    }
    async addPlugin(id,path){
        const plugin = await import(/* @vite-ignore */path);
        this.plugins.set(id,plugin)
        this.app.plugin(plugin)
    }
    deletePlugin(id){
        this.plugins.has(id)&&(this.app.dispose(this.plugins.get(id)) && this.plugins.delete(id))
    }
    start(){
        this.app.start()
    }
    stop(){
        this.app.stop()
    }
}
export * from 'cordis'
export {Context} from 'cordis'