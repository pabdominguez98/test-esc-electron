const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  imprimirTicket: (datos) => ipcRenderer.send("imprimir-ticket", datos),
});