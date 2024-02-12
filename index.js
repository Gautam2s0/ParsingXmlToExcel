let data = []; // Array to store data for text file
let gname;
// hiding table before parsing
let table = document.getElementById("result");
table.style.display = "none";

// Parse XML Function

function parseXML() {
  // Getting file from  input tag
  let fileInput = document.getElementById("fileInput");
  let resultDiv = document.getElementById("tbody");

  resultDiv.innerHTML = "";

  

  let file = fileInput.files[0];
 let count=0
  const groupName = file.name
    .split(".xml")[0]
    .split("_Jansen")
    .join(".Jansen")
    .split("_")
    .join(" ");

gname=groupName


  if (file) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let xmlString = e.target.result;
      // Character encoding
      let textDecoder = new TextDecoder("windows-1252");
      xmlString = textDecoder.decode(new Uint8Array(e.target.result));

      // DOM Parser
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(xmlString, "text/xml");

      let preferences = xmlDoc.querySelectorAll("preference");

      // Reset data array on each parse
      data = [];

      for (let i = 0; i < preferences.length; i++) {
        let name = preferences[i]
          .getAttribute("name")
          .split("_release_procedure")[0]
          .split("TC_")[1];
        let p1=name.split("JAG5_").length
        let p2=name.split("BCT4_").length
        let p3=name.split("Revision").length
        
        let values = preferences[i].querySelectorAll(
          'context[name="Teamcenter"] > value'
        );

        for (let j = 0; j < values.length; j++) {
          let el=values[j].textContent.split("Unterprozess")
        
          if(el.length<2){
            if(p1>=2 || p2>=2||p3>=2){
            displayTable(resultDiv, values[j].textContent, name, groupName,count++);
            }

          }
          

          // Push data for text file
          data.push([name, values[j].textContent]);
        }
      }
      // showing table after parse
  table.style.display = "block";
    };

    reader.readAsArrayBuffer(file);
  } else {
    alert("Please select an XML file.");
  }
}

function openTextFile() {
  if (data.length === 0) {
    alert("Please parse an XML file first.");
    return;
  }

  /* Open a new window and display the content */
  let content = data.map((row) => row.join("\t")).join("\n");
  let newWindow = window.open("", "_blank");
  newWindow.document.write("<pre>" + content + "</pre>");
}

function downloadExcel() {
  if (data.length === 0) {
    alert("Please parse an XML file first.");
    return;
  }

  /* Create worksheet data */
  let wsData = [["Workflow Name", "Object type","Group Name"]];
  for (let i = 0; i < data.length; i++) {
    wsData.push([data[i][0], data[i][1],gname]);
  }

  /* Create a worksheet */
  let ws = XLSX.utils.aoa_to_sheet(wsData);

  /* Create a workbook with a single sheet */
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  /* Convert workbook to data URI */
  let dataUri = XLSX.write(wb, { bookType: "xlsx", type: "base64" });

  /* Create download link */
  let link = document.createElement("a");
  link.href =
    "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
    dataUri;
  link.download = "preferences.xlsx";

  /* Simulate a click on the link to trigger the download */
  link.click();
}

function displayTable(div, td1, td2, td3,count) {
  let row = document.createElement("tr");
  let r1 = document.createElement("td");
  let r2 = document.createElement("td");
  let r3 = document.createElement("td");
  let r4=document.createElement("td");

  // inner text ;

  r1.innerText = td1;
  r2.innerText = td2;
  r3.innerText = td3;
  r4.innerText=count
  
  row.append(r4,r1, r2, r3);

  // appending tr in div

  div.append(row);
}
