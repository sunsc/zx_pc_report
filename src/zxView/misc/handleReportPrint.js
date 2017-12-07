let filesaver = require('filesaver.js/FileSaver.min.js');
let htmlDocx = require('html-docx-js/dist/html-docx.js');

function handleReportPrint(html) {
    let srt='';
    for(let i=0;i<html.length;i++){
        srt+=html[i];
    }
    html = `<!DOCTYPE html><html>${srt}</html>`;
    let converted = htmlDocx.asBlob(html, {orientation: 'portrait'});
    filesaver.saveAs(converted, 'report.docx');
}
export default handleReportPrint;
