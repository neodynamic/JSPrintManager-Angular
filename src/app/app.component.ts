import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
  title = 'JSPrintManager in Angular';
  printers: string[];
  selectedPrinter: any;
  isDefaultPrinterSelected = false;

  constructor() { }

  ngOnInit() {
    // WebSocket settings
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();
    JSPM.JSPrintManager.WS.onStatusChanged = () => {
        if (this.jspmWSStatus()) {
            // get client installed printers
            JSPM.JSPrintManager.getPrinters().then((myPrinters: string[]) => {
              this.printers = myPrinters;
              console.log(this.printers);
            });
        }
    };
  }

  // Check JSPM WebSocket status
  jspmWSStatus() {
    if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
        return true;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
        alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
        return false;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.BlackListed) {
        alert('JSPM has blacklisted this website!');
        return false;
    }
  }
  // Do Zebra ZPL printing...
  doPrintZPL() {
    console.log(this.selectedPrinter);
    if (this.selectedPrinter !== 'undefined' && this.jspmWSStatus()) {
        // Create a ClientPrintJob
        const cpj = new JSPM.ClientPrintJob();
        // Set Printer type (Refer to the help, there many of them!)
		//https://www.neodynamic.com/Products/Help/JSPrintManager2.0/articles/jsprintmanager.html#client-printer-types
        if ( this.isDefaultPrinterSelected ) {
          cpj.clientPrinter = new JSPM.DefaultPrinter();
        } else {
          cpj.clientPrinter = new JSPM.InstalledPrinter(this.selectedPrinter);
        }

        // Set content to print...
        //Create Zebra ZPL commands for sample label
		var cmds =  "^XA";
		cmds += "^FO20,30^GB750,1100,4^FS";
		cmds += "^FO20,30^GB750,200,4^FS";
		cmds += "^FO20,30^GB750,400,4^FS";
		cmds += "^FO20,30^GB750,700,4^FS";
		cmds += "^FO20,226^GB325,204,4^FS";
		cmds += "^FO30,40^ADN,36,20^FDShip to:^FS";
		cmds += "^FO30,260^ADN,18,10^FDPart number #^FS";
		cmds += "^FO360,260^ADN,18,10^FDDescription:^FS";
		cmds += "^FO30,750^ADN,36,20^FDFrom:^FS";
		cmds += "^FO150,125^ADN,36,20^FDAcme Printing^FS";
		cmds += "^FO60,330^ADN,36,20^FD14042^FS";
		cmds += "^FO400,330^ADN,36,20^FDScrew^FS";
		cmds += "^FO70,480^BY4^B3N,,200^FD12345678^FS";
		cmds += "^FO150,800^ADN,36,20^FDMacks Fabricating^FS";
		cmds += "^XZ";
		cpj.printerCommands = cmds;

        console.log(cmds);
        // Send print job to printer!
        cpj.sendToClient();
    }
  }
  
  
  // Do PDF printing...
  doPrintPDF() {
    console.log(this.selectedPrinter);
    if (this.selectedPrinter !== 'undefined' && this.jspmWSStatus()) {
        // Create a ClientPrintJob
        const cpj = new JSPM.ClientPrintJob();
        // Set Printer type (Refer to the help, there many of them!)
		if ( this.isDefaultPrinterSelected ) {
          cpj.clientPrinter = new JSPM.DefaultPrinter();
        } else {
          cpj.clientPrinter = new JSPM.InstalledPrinter(this.selectedPrinter);
        }

        // Set content to print...
        //Set PDF file... for more advanced PDF settings please refer to 
		//https://www.neodynamic.com/Products/Help/JSPrintManager2.0/apiref/classes/jspm.printfilepdf.html
		var my_file = new JSPM.PrintFilePDF('https://neodynamic.com/temp/LoremIpsum.pdf', JSPM.FileSourceType.URL, 'MyFile.pdf', 1);
		
		cpj.files.push(my_file);

        // Send print job to printer!
        cpj.sendToClient();
    }
  }
  
}
