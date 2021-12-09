import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Persona } from './clases/persona';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { style } from '@angular/animations';

@Component({
  selector: 'app-excelsheet',
  templateUrl: './excelsheet.component.html',
  styleUrls: ['./excelsheet.component.css']
})
export class ExcelsheetComponent implements OnInit {


  file: File;
  arrayBuffer: any;
  data: any[];
  personas: Array<Persona>;
  persona: Persona;
  id: number;
  @Input()
  nombre: string;
 
  constructor() {
   
  }


  ngOnInit(): void {
    this.persona = new Persona();
  }

  addfile(event) {

    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.data = arraylist;
      this.personas = this.getPersona(this.data)
    }

  }

  getPersona(json: any[]): Array<Persona> {
    return (json as any);
  }

  buscar(): void {
    this.personas.forEach(element => {
      if (element.CEDULA == this.id) {
        this.persona = element;
        this.nombre = element.NOMBRE;
      }
    });
  }


  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('l', 'mm', 'a4');
    //const options = {
   //   background: ' ',
     // scale: 3,

    //};
    

    html2canvas(DATA).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const pdfWidth = 297;
      const pdfHeight = 210;
      doc.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });

  }


}

