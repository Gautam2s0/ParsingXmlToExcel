let data = []; // Array to store data for text file
let gname;
let filenames = [];
let count = 1;
// hiding table before parsing
let table = document.getElementById("result");
table.style.display = "none";

// Parse XML Function

function parseXML() {
  // Getting file from  input tag
  let fileInput = document.getElementById("fileInput");
  let resultDiv = document.getElementById("tbody");
  let result = document.getElementById("result");


  resultDiv.innerHTML = "";

  for (let file of fileInput.files) {

    // Appending all file names
    filenames.push(file.name);
    const groupName = file.name
      .split(".xml")[0]
      .split("_Jansen")
      .join(".Jansen")
      .split("_")
      .join(" ");

    gname = groupName;
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
        //data = [];

        for (let i = 0; i < preferences.length; i++) {
          let name = preferences[i]
            .getAttribute("name")
            .split("_release_procedure")[0]
            .split("TC_")[1];

          let p1 = name?.split("JAG5_").length;
          let p2 = name?.split("BCT4_").length;
          let p3 = name?.split("Revision").length;

          let values = preferences[i].querySelectorAll(
            'context[name="Teamcenter"] > value'
          );

          for (let j = 0; j < values.length; j++) {
            let el = values[j].textContent.split("Unterprozess");

            if (el.length < 2) {
              if (p1 >= 2 || p2 >= 2 || p3 >= 2) {
                displayTable(
                  resultDiv,
                  values[j].textContent,
                  name,
                  groupName,
                  count++
                );
                data.push([values[j].textContent, name, groupName]);
              }
            }

            // Push data for text file
            // data.push([values[j].textContent], name, groupName]);
            
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

  if (data.length == 0) {
    alert("No workflows are present");
    return;
  }
}

let obj = {};


function openTextFile() {
  for (let i = 0; i < data.length; i = i + 1) {
   

    
        //console.log({el})
        if (obj[data[i][0]] == undefined) {
            obj[data[i][0]] = {
              object_type: [data[i][1]],
              group: [data[i] [2]],
            };
          } else {
            obj[data[i][0]] = {
              object_type: obj[data[i][0]].object_type.includes(data[i ] [1])
                ? obj[data[i][0]].object_type
                : [...obj[data[i][0]].object_type, data[i][1]],
              group: obj[data[i][0]].group.includes(data[i][2])
                ? obj[data[i][0]].group
                : [...obj[data[i][0]].group, data[i][2]],
            };
          }
    

    //console.log({el:obj[data[i][0]]})
    
  }
  console.log({ obj });

  //   if (data.length === 0) {
  //     alert("Please parse an XML file first.");
  //     return;
  //   }

  /* Open a new window and display the content */
  //   let content = data.map((row) => row.join("\t")).join("\n");
  //   let newWindow = window.open("", "_blank");
  //   newWindow.document.write("<pre>" + content + "</pre>");
}
console.log({ obj });

function displayTable(div, td1, td2, td3, num) {
  let row = document.createElement("tr");
  let r1 = document.createElement("td");
  let r2 = document.createElement("td");
  let r3 = document.createElement("td");
  let r4 = document.createElement("td");

  // inner text ;

  r1.innerText = td1;
  r2.innerText = td2;
  r3.innerText = td3;
  r4.innerText = num;

  row.append(r4, r1, r2, r3);

  // appending tr in div

  div.append(row);
}
