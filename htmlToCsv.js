var h2Elements = document.querySelectorAll('h2');
var h2TextArray = [];

for (var i = 0; i < h2Elements.length; i++) {
  var h2Element = h2Elements[i];
  var text = h2Element.textContent;
  
  var beforeContent = window.getComputedStyle(h2Element, '::before').getPropertyValue('content');
  if (beforeContent && beforeContent !== 'none') {
    text = (i + 1) + ' ' + text;
  }
  h2TextArray.push(text);
}

for (var i = 1; i < h2TextArray.length; i++) {
  if (!h2TextArray[i].match(/^\d+/)) {
    h2TextArray[i - 1] += ' ' + h2TextArray[i];
    h2TextArray.splice(i, 1);
    i--;
  }
}

for (var i = 1; i < h2TextArray.length; i++) {
  if (h2TextArray[i].match(/^\d+\.\d+/)) {
    h2TextArray[i - 1] += ' ' + h2TextArray[i];
    h2TextArray.splice(i, 1);
    i--;
  }
}

for (var i = 0; i < h2TextArray.length; i++) {
  var spaceIndex = h2TextArray[i].indexOf(' ');
  if (spaceIndex !== -1) {
    var position = (i + 1) + '.- ';
    h2TextArray[i] = position + h2TextArray[i].substring(spaceIndex + 1);
  }
}

var pElements = document.querySelectorAll('p, table tr');

var contentArray = Array.from(pElements).reduce(function(array, element) {
  if (element.tagName === 'P') {
    var beforeContent = window.getComputedStyle(element, '::before').getPropertyValue('content');
    if (beforeContent && beforeContent !== 'none') {
      var content = element.textContent.trim();
      array.push(content);
    }
  } else if (element.tagName === 'TR') {
    var rowContent = Array.from(element.querySelectorAll('td')).map(function(td) {
      return td.textContent.trim();
    }).join(' ');
    if (rowContent) {
      array.push(rowContent);
    }
  }
  return array;
}, []);

for (var i = 0; i < contentArray.length; i++) {
  var element = contentArray[i];
  if (element.includes(';')) {
    element = element.replace(/;/g, '');
  }
  contentArray[i] = element;
}

var prefixRegex = /^[a-d]\)/;
var prefixes = ['a)', 'b)', 'c)', 'd)'];

for (var i = 0; i < contentArray.length; i++) {
  var element = contentArray[i];

  if (!prefixRegex.test(element)) {
    var prefix = prefixes[i % prefixes.length];
    element = prefix + ' ' + element;
  }
  contentArray[i] = element;
}


let colA = [];
let colB = [];
let colC = [];
let colD = [];

for (let i = 0; i < contentArray.length; i++) {
  let elemento = contentArray[i];
  
  if (elemento.startsWith('a)')) {
    colA.push(elemento);
  } else if (elemento.startsWith('b)')) {
    colB.push(elemento);
  } else if (elemento.startsWith('c)')) {
    colC.push(elemento);
  } else if (elemento.startsWith('d)')) {
    colD.push(elemento);
  }
}

function exportToCsv(filename, h2TextArray, colA, colB, colC, colD) {
  var csvFile = '';

  for (var i = 0; i < h2TextArray.length; i++) {
    var row = [
      h2TextArray[i],
      colA[i] || '',
      colB[i] || '',
      colC[i] || '',
      colD[i] || ''
    ];
    var csvRow = row.join(';');
    csvFile += csvRow + '\n';
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

exportToCsv('examen.csv', h2TextArray, colA, colB, colC, colD);
