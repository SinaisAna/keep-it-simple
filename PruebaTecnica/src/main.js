
let selectedFile;
let rows = 15;
let currentPage = 1;
const listElement = document.getElementById('alldataM');
const paginationElemnent = document.getElementById('pagination');
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})
//convertir archivo
document.getElementById('changes').addEventListener("click", () => {
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
         workbook.SheetNames.forEach(sheet => {
              let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              

            //Ordenamiento por "nombre"
              rowObject = rowObject.sort((a, b) => {
                return a.Nombre.localeCompare(b.Nombre);
              });

              localStorage.setItem('data', JSON.stringify(rowObject));
         });
        }

        LlenarTabla('data');

         document.getElementById('btn-dowload').classList.remove('hidden');
         document.getElementById('container-select').classList.remove('hidden');
         document.getElementById('container-changes-file').classList.add('hidden');
         document.getElementById('btn-changes-view').classList.remove('hidden');
         document.getElementById('container-data').classList.remove('hidden');
         
    }   
});
//btn-volver
function btnChangesView(){
    document.getElementById('btn-changes-view').classList.add('hidden');
    document.getElementById('container-changes-file').classList.remove('hidden');
    document.getElementById('btn-dowload').classList.add('hidden');
    document.getElementById('container-select').classList.add('hidden');
    document.getElementById('container-data').classList.add('hidden');
    
}
// //Filtros
document.getElementById('btn-filter').addEventListener("click", () => {
    var dataJSON = localStorage.getItem('data');

    var objJSON = JSON.parse(dataJSON);
    console.log(objJSON);
    var supervisorFilter = document.getElementById('supervisor').value;
    console.log(supervisorFilter);
    var claseFilter = document.getElementById('clase').value;
    console.log(claseFilter);
    var departamentoFilter = document.getElementById('departamento').value;
    console.log(departamentoFilter);
    var subsidiariaFilter = document.getElementById('subsidiaria').value;
    console.log(subsidiariaFilter);

    objJSON = objJSON.filter(function(item){
        return item.Supervisor.toLowerCase().includes(supervisorFilter.toLowerCase()) 
        && item.Clase.toLowerCase().includes(claseFilter.toLowerCase()) 
        && item.Departamento.toLowerCase().includes(departamentoFilter.toLowerCase())
        && item.Subsidiaria.toLowerCase().includes(subsidiariaFilter.toLowerCase());
     })
    localStorage.setItem('filterData', JSON.stringify(objJSON));

    LlenarTabla('filterData');
    getCharacters('dafilterDatata');
});
//inicializar paginación con data
function LlenarTabla(allData){
    
    var dataJSON = localStorage.getItem(allData);
    objJSON = JSON.parse(dataJSON);
    console.log(objJSON);
    displayList(objJSON, listElement, rows, currentPage);
    setupagination(objJSON, paginationElemnent, rows);
    
}
//cabecera principal
function CabTabla(tableCab){
    var cabTable =  '<thead><tr><th class="px-1 align-items-md-center" scope="col">Nombre</th>' +
                    '<th class="px-1 mx-auto" scope="col">Cargo</th>' +
                    '<th class="px-1 mx-auto" scope="col">Supervisor</th>' +
                    '<th class="px-1 mx-auto" scope="col">Clase</th>' +
                    '<th class="px-1 mx-auto" scope="col">Subsidiaria</th>' +
                    '<th class="px-1 mx-auto" scope="col">Departamento</th></tr></thead>';
    tableCab.innerHTML = cabTable
    return tableCab;
    
}
//paginación
const displayList = (items, wrapper, rows_per_page, page) => {
    var table = document.getElementById('table');
	wrapper.innerHTML = '<h1 class="app-title">Total de Personal(' + items.length + ')</h1>';
	page--;
	let start = rows_per_page * page;
	let end = start + rows_per_page;
	let paginationItems = items.slice(start, end);
    let test = '';
	for (let i = 0; i < paginationItems.length; i++) {
		let item = paginationItems[i];
        
		test += getCharacters(item);

        
	}
    table = CabTabla(table);
    table.innerHTML += test;
}
//data mostrar
const getCharacters = (object) => {
    var tr = document.createElement('tr');
    let test2 =  '<tr><td>' + object.Nombre + '</td>' +
                    '<td>' + object.Cargo + '</td>' +
                    '<td>' + object.Supervisor + '</td>' +
                    '<td>' + object.Clase + '</td>' +
                    '<td>' + object.Subsidiaria + '</td>' +
                    '<td>' + object.Departamento + '</td></tr>';
                    return test2;
    //table.appendChild(tr);

}
//botones de paginación
const paginationbuttons = (page, items) => {
	const buttons = document.createElement('button');
	buttons.innerText = page;

	if (currentPage == page) buttons.classList.add('active');

	buttons.addEventListener('click', function () {
		currentPage = page;
		displayList(items, listElement, rows, currentPage);
		let currentBtn = document.querySelector('.pagenumbers button.active');
		currentBtn.classList.remove('active');
		buttons.classList.add('active');
	});

    return buttons;
}
//refrescar paginación
const setupagination = (items, wrapper, rows_per_page) => {
	wrapper.innerHTML = "";
    
	let pageCount = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < pageCount + 1; i++) {
		let btns = paginationbuttons(i, items);
		wrapper.appendChild(btns);
	}
}
//convertir PDF
function tableToPDF(){
        
    
    if(localStorage.getItem('filterData')){
        var dataJSON = localStorage.getItem('filterData'); 
    }else{
    var dataJSON = localStorage.getItem('data');
    }
    objJSON = JSON.parse(dataJSON);
    console.log(objJSON);
    let doc = new jsPDF();
    var temp = objJSON;
    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");
    var col = ["Nombre","Cargo","supervisor", "clase","subsidiaria","departamento"];
    var rows = [];
    for(var item in objJSON){
        console.log(item);
        var temp = [objJSON[item].Nombre, objJSON[item].Cargo, objJSON[item].Supervisor, objJSON[item].Clase, objJSON[item].Subsidiaria, objJSON[item].Departamento,];
        rows.push(temp);
    }
    doc.autoTable(col, rows, {  
        startY: false, 
        theme: 'grid',  
        //tableWidth: 'auto', 
        columnWidth: 'wrap', 
        showHeader: 'everyPage',
        columnStyles: {
            0: {columnWidth: 25},
            1: {columnWidth: 25},
            2: {columnWidth: 31},
            3: {columnWidth: 25},
            4: {columnWidth: 25},
            5: {columnWidth: 25}
            
        },
        headerStyles: {theme: 'grid'},
        styles: {overflow: 'linebreak', columnWidth: '100', fontSize: 10, cellPadding: 1, overflowColumns: 'linebreak'},
    });
    doc.save('Test.pdf');
}
//convertir EXCEL
function tableToExcel(){
    if(localStorage.getItem('filterData')){
        var dataJSON = localStorage.getItem('filterData'); 
    }else{
    var dataJSON = localStorage.getItem('data');
    }
    objJSON = JSON.parse(dataJSON);
    var col = ["Nombre","Cargo","supervisor", "clase","subsidiaria","departamento"];
    var rows = [];
    var temp = objJSON;
    var ws_data = [];
    ws_data.push(col);
    for(var item in objJSON){
        var temp = [objJSON[item].Nombre, objJSON[item].Cargo, objJSON[item].Supervisor, objJSON[item].Clase, objJSON[item].Subsidiaria, objJSON[item].Departamento];
        ws_data.push(temp);
    }

    var wb = XLSX.utils.book_new();
        wb.Props = {
        Title: "SheetJS Tutorial",
        Subject: "Test",
        Author: "Red Stapler",
        CreatedDate: new Date(2017,12,19)
        };
    wb.SheetNames.push("Test Sheet");

       // var ws_data = [col,rows];

        var ws = XLSX.utils.aoa_to_sheet(ws_data);

        wb.Sheets["Test Sheet"] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s) { 
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;    
            }
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
}
//convertir CSV
function arrayObjToCsv(ar) {
	//comprobamos compatibilidad
	if(window.Blob && (window.URL || window.webkitURL)){
		var contenido = "",
			d = new Date(),
			blob,
			reader,
			save,
			clicEvent;
		//creamos contenido del archivo
		for (var i = 0; i < ar.length; i++) {
			//construimos cabecera del csv
			if (i == 0)
				contenido += Object.keys(ar[i]).join(";") + "\n";
			//resto del contenido
			contenido += Object.keys(ar[i]).map(function(key){
							return ar[i][key];
						}).join(",") + "\n";
		}
		//creamos el blob
		blob =  new Blob(["\ufeff", contenido], {type: 'text/csv'});
		//creamos el reader
		var reader = new FileReader();
		reader.onload = function (event) {
			//escuchamos su evento load y creamos un enlace en dom
			save = document.createElement('a');
			save.href = event.target.result;
			save.target = '_blank';
			//aquí le damos nombre al archivo
			save.download = "log_"+ d.getDate() + "_" + (d.getMonth()+1) + "_" + d.getFullYear() +".csv";
			try {
				//creamos un evento click
				clicEvent = new MouseEvent('click', {
					'view': window,
					'bubbles': true,
					'cancelable': true
				});
			} catch (e) {
				//si llega aquí es que probablemente implemente la forma antigua de crear un enlace
				clicEvent = document.createEvent("MouseEvent");
				clicEvent.initEvent('click', true, true);
			}
			//disparamos el evento
			save.dispatchEvent(clicEvent);
			//liberamos el objeto window.URL
			(window.URL || window.webkitURL).revokeObjectURL(save.href);
		}
		//leemos como url
		reader.readAsDataURL(blob);
	}else {
		//el navegador no admite esta opción
		alert("Su navegador no permite esta acción");
	}
};
//invocar CSV
function tableToCSV() {
    if(localStorage.getItem('filterData')){
        var dataJSON = localStorage.getItem('filterData'); 
    }else{
    var dataJSON = localStorage.getItem('data');
    }
    objJSON = JSON.parse(dataJSON);
    var col = ["Nombre","Cargo","supervisor", "clase","subsidiaria","departamento"];
    var rows = [];
    var temp = objJSON;
    var ws_data = [];
    ws_data.push(col);
    for(var item in objJSON){
        var temp = [objJSON[item].Nombre, objJSON[item].Cargo, objJSON[item].Supervisor, objJSON[item].Clase, objJSON[item].Subsidiaria, objJSON[item].Departamento];
        ws_data.push(temp);
    }
	var miArrayDeObjetos = ws_data;
	arrayObjToCsv(miArrayDeObjetos);
}