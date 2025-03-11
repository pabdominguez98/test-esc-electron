const { app, BrowserWindow, ipcMain } = require("electron");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: __dirname + "/preload.js", // Comunicación segura con la UI
    },
  });

  mainWindow.loadFile("index.html");
});

// Función para imprimir el ticket
ipcMain.on("imprimir-ticket", (event, datos) => {
  try {
    const device = new escpos.USB();
    const options = { encoding: "GB18030" };
    const printer = new escpos.Printer(device, options);

    device.open((error) => {
      if (error) {
        console.error("Error abriendo la impresora:", error);
        return;
      }

      printer
        .align("ct")
        .style("b")
        .size(1, 1)
        .text("Bienvenido a Dupin")
        .text("")
        .style("normal")
        .size(1, 1)
        .text("Te van a llamar con el número")
        .text("")
        .style("bu")
        .size(2, 2)
        .text(datos.numeroTurno)
        .text("")
        .size(1, 1)
        .text("Escanea este código QR")
        .qrimage(`https://dupinsystem.com/turno/${datos.turnoID}`, function (err) {
          if (err) {
            console.error("Error generando QR:", err);
          }

          this.cut();
          this.close();
        });
    });
  } catch (err) {
    console.error("No se encontró una impresora USB:", err);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});