const { app, BrowserWindow } = require('electron');
const net = require('net');
const path = require('path');

let win;

function checkServer() {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.connect(3000, 'localhost', () => {
      client.end();
      resolve();
    });
    client.on('error', () => {
      setTimeout(() => {
        checkServer().then(resolve).catch(reject);
      }, 100);
    });
  });
}


function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  win.maximize(); // Maximiza la ventana
  win.loadURL('http://localhost:3000');
}


app.whenReady().then(async () => {
  try {
    await checkServer();
    createWindow();
  } catch (error) {
    console.error('Failed to connect to Next.js server', error);
    app.quit();
  }

  app.on('activate', () => {
    if (win === null) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

