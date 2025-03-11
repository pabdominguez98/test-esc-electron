const { app, BrowserWindow, ipcMain } = require("electron");
const { Printer } = require("@node-escpos/core");
const USB = require("@node-escpos/usb-adapter");

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
    const device = new USB();
    const options = { encoding: "GB18030" };
    let printer = new Printer(device, options);

    device.open(async (error) => {
      if (error) {
        console.error("Error abriendo la impresora:", error);
        return;
      }
      printer
        .font("a")
        .align("ct")
        .style("bu")
        .size(1, 1)
        .text("May the gold fill your pocket")
        .text("恭喜发财")
        .barcode(112233445566, "EAN13", { width: 50, height: 50 })
        .table(["One", "Two", "Three"])
        .tableCustom(
          [
            { text: "Left", align: "LEFT", width: 0.33, style: "B" },
            { text: "Center", align: "CENTER", width: 0.33 },
            { text: "Right", align: "RIGHT", width: 0.33 },
          ],
          { encoding: "cp857", size: [1, 1] }, // Optional
        )
      printer = await printer.qrimage("https://github.com/node-escpos/driver")
      printer
        .cut()
        .close()
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