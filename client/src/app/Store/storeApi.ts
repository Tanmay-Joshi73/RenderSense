import {create} from 'zustand';
interface Apistore{
    api:string
    setApi:(newApi:string)=>void
    removeApi:()=>void,
    updateApi:(updatedApi:string)=>void;
};
export const renderAPiStore = create<Apistore>((set) => ({
  api: 'null',

  setApi: (newApi) => set({ api: newApi }),

  removeApi: () => set({ api: 'null' }),

  updateApi: (updatedApi) => set({ api: updatedApi }),
}))
