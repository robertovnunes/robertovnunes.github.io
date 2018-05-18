/*
* Copyright (c) 2006-2011 Marlon Reghert Alves dos Santos & Lucas de Souza Albuquerque
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
*/


/*

var n=window.localStorage.getItem('(n');
var m=window.localStorage.getItem('m');
var reduced = window.localStorage.getItem('reduced') === 'true';

*/
var n = 0,
  m = 0,
  reduced = false;
var runningStep = false; // prevent two clicks on step-by-step button

function getMatrix() { //search on span whose id is "holdMatrix"

    for (var i = 0; i < n; i++) { // init matrix
        matrix[i] = [];
        for (var j = 0; j < m; j++) {
            matrix[i][j] = 0;
        }
    };

    var matrixInput = document.getElementById('holdMatrix');
    var rows = matrixInput.getElementsByTagName('div');
    // get the matrix from inputs \/
    for (var i = 0; i < n; i++) {
        var cols = rows[i].getElementsByTagName('input');
        for (var j = 0; j < m; j++) {
            if(cols[j].value === "-") matrix[i][j] = 0;
            else if (cols[j].value !== "") matrix[i][j] = parseFloat(cols[j].value);
            //else matrix[i][j] = Math.floor(Math.random() * 99999); // use to debug
            else matrix[i][j] = 0;

        }

    }
}

function generateMatrix(n, m) {
  /*
  Generate a \/ n by m
  as id="holdMatrix" chield
       <div class="row" >
        <input type="number" class="form-control" placeholder="0">
        <input type="number" class="form-control" placeholder="0">                      
        <input type="number" class="form-control" placeholder="0">
      </div>  */

  //restart this span
  var oldHoldMatrix = document.getElementById('holdMatrix');
  var neWHoldMatrix = document.createElement('span');
  neWHoldMatrix.setAttribute('id', 'holdMatrix');
  oldHoldMatrix.parentNode.replaceChild(neWHoldMatrix, oldHoldMatrix);


  for (var i = 0; i < n; i++) {
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    holdMatrix.appendChild(row);
    for (var j = 0; j < m; j++) {
      var input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("class", "form-control");
      input.setAttribute("placeholder", "0");
      input.setAttribute("id", "elementInput");

      row.appendChild(input);
    }
  }


  $("input[id='elementInput']").numeric();

}



function restartElement(id, el, callback) { // restart a element and preserve id and class

  var old = document.getElementById(id);
  var aux = document.createElement(el);
  aux.setAttribute('id', old.getAttribute('id'));
  aux.setAttribute('class', old.getAttribute('class'));


  old.parentNode.replaceChild(aux, old);

  if (!isNaN(callback) && !(callback == undefined) && !(callback == null) && (typeof callback == "function")) callback();

}

function restartDiv(id) {
  var old = document.getElementById(id);

}

function htmlToString(objHtml) {

}


function setTableWidth(matrix, table){
  var maxElementLength = getMaxELementLength(matrix);
  table.style.width = (1.5*maxElementLength)*m;
}

function designMatrixBorders(m){
    if(m==1) {
      $(".box").removeClass('multipleCols');
      $(".box").addClass('oneCol');
    }
    else {
      $(".box").removeClass('oneCol');
      $(".box").addClass('multipleCols');      
    } // verify matrix bounds to design a friendly border
}

$(document).ready(function() {



  // hide results and step pages
  $("#myContainer").hide();
  $("#myContainerResults").hide();
  $("#mySteps").hide();
  $("#myPALUResults").hide();


  $("#indexGo").click(function() {

    var select = document.getElementsByTagName('select');
    n = select[0].options[select[0].selectedIndex].text;
    m = select[1].options[select[1].selectedIndex].text;
    reduced = document.getElementById('checkboxes-0').checked;

    if(n!=m) {
      singular = true;
      square = false;
    }
    else square = true;
    //restart the amtrix
    var echelonButtonText = 'Echelon';
    var echelonButtonGlyph = 'glyphicon glyphicon-sort-by-attributes';
    if(reduced) {
      echelonButtonText = 'Reduce';
      echelonButtonGlyph = 'glyphicon glyphicon-sort';
    }
    document.getElementById('echelonButtonText').innerHTML = echelonButtonText;
    document.getElementById('echelonButtonGlyph').setAttribute('class', echelonButtonGlyph);


    $("#myIndexContainer").fadeOut("fast", function() {
      generateMatrix(n, m);
      $("elementInput");
      $("#myContainer").ready(function() {
        //var width = $("input.form-control:number").css('width');
        var width = parseInt($("input.form-control").css('width'));
        document.getElementById('myContainer').style.minWidth = width * m;
        $("#myContainer").fadeIn("fast");
      });


    });
  });


  var matrixResultsHolder;
  var detCheck = document.getElementById('detCheck');
  // set all button's events
  $("#echelonButton").click(function() {
    // restart matrix
    matrix = [];
    matrixL = [];
    matrixP = [];
    idendityMatrix = [];
    elementMatrix = [];
    initMatrix(matrix, n , m );
    initMatrix(matrixL, n, m);
    initMatrix(matrixP, n,m,true); 
    initMatrix(idendityMatrix, n,m, true);
    initMatrix(elementMatrix, n,m, true);
    permutationsNumber=0;
    getMatrix(); // get the matrix via html tags


    //call echelon main method   
    echelonMatrix(matrix);

    $("#detCalc").hide();
    detCheck.innerHTML = "Determinant";
    detCheck.value=0;
    if (reduced) {
      matrixU = cloneMatrix(matrix);
      fixMatrixEchelon(matrixU, 0.0001);
      reduceMatrix(matrix);
    }


    fixMatrix(matrix, DIGITS); // round results
    
   


    var resultFix = fixMatrixEchelon(matrix, 0.0001);
    if(!reduced) matrixU = cloneMatrix(matrix);
    //alert(resultFix.fixed);
    if (!resultFix.fixed) { // alert about bug
      console.log("Not fixed at:" + resultFix.i + ' ' + resultFix.j + '  m:'+m+' n:'+n);
      console.log("Matrix:");
      logMatrix(matrix);
      alert('Bad inputs, are you trying to bug my code? Change your inputs.');
    } else {

      steps.saveStep(matrix, "We've done this matrix, just " + (steps.size) + (steps.size > 1 || !steps.size ? ' steps':' step' ) + "." , idendityMatrix);
      restartElement('matrixResultsHolder', 'table'); // erase all old results


      tableMatrix = htmlMatrix(matrix);
      matrixResultsHolder = document.getElementById('matrixResultsHolder');
      matrixResultsHolder.appendChild(tableMatrix);
      
/*      if(!singular) {
        generatePALUContainerHtml(matrixP, matrixA, matrixL, matrix);
      }*/
      setTableWidth(matrix, matrixResultsHolder);
      designMatrixBorders(m);

      var squareStatus = document.getElementById('squareStatus');
      var detResult = document.getElementById('detResult');

      glyph = document.createElement('span');
      glyph.setAttribute('id', 'glyphSingular');      
      if(square) {
        glyph.setAttribute('class', 'glyphicon glyphicon-th-large');
        squareStatus.innerHTML = 'Square';
      }
      else {
        glyph.setAttribute('class', 'glyphicon glyphicon-align-center');
        squareStatus.innerHTML = 'Non-square';
      }
      squareStatus.appendChild(glyph);

      var glyph = document.createElement('span');
      var PALUButon = document.getElementById('PALUbutton');
     
      var singularStatus = document.getElementById('singularStatus');
      glyph.setAttribute('id', 'glyphSingular');
      if(singular) {
        detCheck.disabled=true;
        PALUButon.disabled = true;
        singularStatus.innerHTML = 'Singular';
        glyph.setAttribute('class', 'glyphicon glyphicon-link');
//        document.getElementById('singularStatus').appendChild(glyph);
        detResult.innerHTML = "Determinant equals 0, it's a singular matrix"
        $("#detInfo").hide();
      }
      else {
        detCheck.disabled=false;
        fixMatrix(matrixL, DIGITS);        
        fixMatrix(matrixA, DIGITS);

        if(reduced) fixMatrix(matrixU, DIGITS);        
        PALUButon.disabled = false;

        glyph.setAttribute('class', 'glyphicon glyphicon-transfer');

        singularStatus.innerHTML = 'Non-singular';  
        var det = determinant(matrixU);
        // get info to det
        var detCalcInfo = document.getElementById("detCalcInfo");
        document.getElementById("detCalcInfo").innerHTML="TESTETE";

        var detInfoStr = "";
        detInfoStr += "Our pivot product it's aprox. equals:  " + fixNumber(det.diagonalProduct, DIGITS) + "</br>";
        detInfoStr += "And we did: " + (permutationsNumber) + " permutation" + ((permutationsNumber==1) ? "" : "s") + "</br>"; 
        detInfoStr += "And we know that: for each row permutation, our determinant invert his signal" + "</br>";
        detInfoStr += "So we must to multiply our digonal product by: (-1)^("+permutationsNumber+") <br> that  is: " + det.signal + "</br>";
        detInfoStr += "(" + fixNumber(det.diagonalProduct, DIGITS) +") * ("+det.signal+")" + "</br>";
        detInfoStr += " = " + fixNumber(det.result, DIGITS);

        document.getElementById("detCalcInfo").innerHTML = detInfoStr;
        //detInfoStr = "First we must know how many permutations we did, in this case we did: " + (permutationsNumber) + " permutation" + (permutationsNumber==1) ? "" : "s" + " to get our echelon form"; 
        //detCalcInfo.innerHTML= detInfoStr;

        detResult.innerHTML = "Determinant: " +  fixNumber(det.result, DIGITS);
        $("#detInfo").show(); 
        logMatrix('resultado:');
        logMatrix(multiplyMatrices(matrixL, matrixU) );

      }
      singularStatus.appendChild(glyph);




      $("#myContainer").fadeOut("fast", function() {
        $("#matrixTableResult").show();
        $("#myContainerResults").fadeIn("fast");

      });
    }
  });

  $("#back").click(function() {
    $("#myContainerResults").fadeOut("fast", function() {
      $("#myContainer").fadeIn("fast", function() {
        restartElement('matrixResultsHolder', 'table'); // erase all old results
        steps.restart();


      });
    });
  });


  $("#backIndex").click(function() {
    $("#myContainer").fadeOut("fast", function() {
      $("#myIndexContainer").fadeIn("fast");

    });
  });

  $("#PALUbutton").click(function(){
    var rowPALU;
    if(!singular) {
      appendPALUResults(matrixP, matrixA, matrixL, matrixU, 'myPALUResults', true);
      designMatrixBorders(m);
    }

    $("#myContainerResults").fadeOut("fast", function(){


      $("#myPALUResults").fadeIn("fast", function(){

      });
    });
  });

  
  $(detCheck).click(function(){
    var valueDetButton = parseInt(detCheck.value);


    detCheck.disabled = true;
    if(!valueDetButton) {
      $("#matrixTableResult").fadeOut("slow", function(){
        $("#detCalc").fadeIn("slow", function(){
          detCheck.innerHTML = "Back to matrix";
          detCheck.disabled = false;
        });
      });
    }
    else{
      $("#detCalc").fadeOut("slow", function(){
        $("#matrixTableResult").fadeIn("slow", function(){
          detCheck.innerHTML = "Determinant";
          detCheck.disabled = false;          
        });
      });
    }
    detCheck.setAttribute('value', ((valueDetButton+1)%2) );
  });



  $("#stepByStep").click(function() {
    if (!runningStep) {
      var myStepsButton = document.getElementById('mySteps').firstElementChild;
      $(myStepsButton).hide(); // shows when step-by-step its finished

      runningStep = true;
      $("#myContainerResults").fadeOut("slow", function() {

        $("#mySteps").fadeIn("slow", function() {
/*          var first;
          var noElementar = (!square && steps.size > 1);*/
          for (var i = 0; i < steps.size; i++) {

            var el = steps.generateStepHtml(i);
            //if(noElementar && !i) first = el;
            myStepsButton.parentNode.insertBefore(el, myStepsButton); // insert all nodes before buttons div
           // myStepsButton.parentNode.insertBefore(elementMatrix, myStepsButton);
          }

/*          if(noElementar) {
            var nonSquare = document.createElement('p');
            nonSquare.innerHTML = "Non-square matrix doesn't have Elementar matrix, the world is unfair :( "
            first.parentNode.insertBefore(nonSquare, first);

          }*/

          $("#buttonMatrixElement").click(function(){

          });

          designMatrixBorders(m);

          $(myStepsButton).show(); // show button div
          runningStep = false;
        });
      });

    }

  });

  $("#backFromPALU").click(function() { // restart PALU page
    var holdButtons = document.getElementById('myPALUResults').lastElementChild; //
    restartElement('myPALUResults', 'div'); 
    $("#myPALUResults").fadeOut("fast", function() {
      document.getElementById('myPALUResults').appendChild(holdButtons);
      $("#myContainerResults").fadeIn("fast");
    });
  });

  $("#backToResults").click(function() { // restart step-by-step page
    var holdButtons = document.getElementById('mySteps').lastElementChild; //
    restartElement('mySteps', 'div');
    $("#mySteps").fadeOut("fast", function() {
      document.getElementById('mySteps').appendChild(holdButtons);
      $("#myContainerResults").fadeIn("fast");
    });
  });



});


function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}