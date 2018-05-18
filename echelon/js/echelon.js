/*
* Copyright (c) 2006-2011 Marlon Reghert Alves dos Santos & Lucas de Souza Albuquerque
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
*/

/*
This file contains all functions and variables that refer to echelon/reduced/PA=LU
and others matrix operations , as EPS and digits constants.
Any software engineer practices are not being in usage, so don't expect for
a beautiful code.
*/


var EPS = Math.pow(10, -8); // EPS constant for float numbers
var EPSLU = Math.pow(10, -4); // EPS for LU fixes
var DIGITS = 5;
// initial matrix
var matrix = [];
var matrixL = [];
var matrixA = [];
var matrixP = [];
var matrixU = [];
var permutationsNumber = 0;
var idendityMatrix = [];
var elementMatrix = [];
var singular = false;
var square = true;


var steps = new Steps(); // init step storage; // store all steps

function swapRow(matrix, a, b, stopMid) { // swap row 'a' with 'b'
    
    if(a!=b) {
        var aux;
        if( !isNaN(stopMid) && stopMid!=undefined && stopMid!=null && stopMid) { // swapping L matrix 
            stopMid = Math.min(a,b); // stop at min 
            /*
                1 0 0             ->   1 0 0
                |3 |1 0  <- a     ->   4 1 0 
                |4 |? 1  <- b     ->   3 0 1 
            */
            for(var i = 0; i < matrix[a].length && i  < stopMid; i++){
                aux = matrix[a][i];
                matrix[a][i] = matrix[b][i];
                matrix[b][i] = aux;
            }

        }
        else {
//                steps.saveStep(matrix, "Swap row nº" + (a + 1) + " with row nº" + (b + 1)); // save this step
                aux = matrix[a];
                matrix[a] = matrix[b];
                matrix[b] = aux;

                /*        if(teste==0){
                        alert('etntrou');
                        steps.saveStep(matrix, 'Swaped row ('+a +') with row ('+ b+' )' );    
                        alert(steps.list.length);
                        a++;
                    }*/
        }
    }
 


}



function subRows(matrix, a, b, k, info) { // sub row 'b' of row 'a' by a factor K from matrix
    if (k) {
        var description = "Subtract row nº" + (b + 1) + " by aprox. " + fixNumber(k, DIGITS) + " times row nº" + (a + 1) + " " + info;
        description = breakFactorDescription(description, "strong");
        if(square) {
            elementMatrix = cloneMatrix(idendityMatrix);
            elementMatrix[b][a] = -1*k;            
        }


        steps.saveStep(matrix, description, elementMatrix); // save this step


        len = matrix[a].length;
        for (var i = 0; i < len; i++) {
            matrix[b][i] = Math.abs(matrix[b][i] - k * matrix[a][i]) <= EPS ? 0 : matrix[b][i] - k * matrix[a][i];
            matrix[b][i] = fixNumber(matrix[b][i], DIGITS);
        }
    }


}

function multiplyRow(matrix, a, k, ceil) { // multiply row 'a' from matrix by a factor K, if ceil... the result will be ceiled

    for (var i = 0; i < matrix[a].length; i++) {
        matrix[a][i] *= k;
        if (ceil && i == a) matrix[a][i] = Math.ceil(matrix[a][i]);
        matrix[a][i] = fixNumber(matrix[a][i], DIGITS);
    }

}

/*
You can assume that matrixA and matrixB both consist of a 'array of arrays'
Compare whether two matrices are equals
in other words, check:
if they have same dimensions:
 
if matrixA is 'n by m' and matrixB is 'w by z'
then: n==w and and m==z
if all elements are equals:
matrixA[i][j] == matrixB[i][j]
return:
true: matrixA == matrixB
false: otherwise
function equalsMatrices(matrixA, matrixB)
*/

var equalsMatrices = function(matrixA, matrixB) {

    var n = matrixA.length;
    var m = matrixA[0].length;
    var w = matrixB.length;
    var z = matrixB[0].length;
    if (n != w || m != z) return false;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            if (matrixA[i][j] != matrixB[i][j]) return false;
        }
    }
    return true;

};

/*
return matrixA times matrixB
you can assume that:
if matrixA is 'n by m' and matrixB is 'w by z'
then: m==w
function multiplyMatrices(matrixA, matrixB)*/

var multiplyMatrices = function(matrixA, matrixB) {

    var n = matrixA.length;
    var m = matrixB.length;
    var z = matrixB[0].length;
    var matrixF = [];

    for (var i = 0; i < n; i++) {
        matrixF.push([]);
        for (var j = 0; j < z; j++) {
            var result = 0;
            for (var k = 0; k < m; k++) {
                result += matrixA[i][k] * matrixB[k][j];
            }
            matrixF[i].push(result);
        }
    }
    return matrixF;

};

/*
If given a string in this format:
"Subtract row nºA by aprox. K times row nº2 (where matrix[a][b]/matrix[c][d] defines this factor)"
then you must return a string in this format:
"Subtract row nºA by aprox. W times row nº2 (where matrix[a][b]/matrix[c][d] defines this factor)"
 
Or, if given a string in this format:
"Multiply row nºA per aprox K (where 1/matrix[i][j]) defines this factor"
then you must return a strin in this format:
"Multiply row nºA per aprox K (where 1/matrix[i][j]) defines this factor"
 
Assume that 'tag' parameter and 'description' paremeter are string's.
So you put the 'K' number at 'description' between 'tag' parameter'
function breakFactorDescription(description, tag)*/
var generatePermutationMatrix = function(matrixA, matrixB) {

    var actualLines = [];
    var n = matrixA.length;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var bool = true;
            for (var k = 0; k < n; k++) {
                if (matrixA[i][k] != matrixB[j][k]) {
                    bool = false;
                }
            }
            if (bool) {
                actualLines.push(j);
            }
        }
    }
    if(actualLines.length==0) console.log('LENGTH 0');
    var matrixPerm = [];

    for (var i = 0; i < n; i++) {
        matrixPerm.push([]);
        for (var j = 0; j < n; j++) {
            if (j == actualLines[i]) {
                matrixPerm[i].push(1);
            } else {
                matrixPerm[i].push(0);
            }
        }
    }

    return matrixPerm;

};

function diagonalProduct(matrix){
    var result = 1, i=0, j=0;
    while(true) {
        if( i >= matrix.length || j >= matrix[i].length ) break;
        result*=matrix[i][j];
        i++; j++;
    }
    return result;
}

// determinant = Product of diagonal   *  -1^(permutationsNumber)
function determinant(matrix){ 
    if(matrix.length != matrix[0].length) return 0; // singular
    var signal = Math.pow(-1, permutationsNumber);
    var product = diagonalProduct(matrix);
    return {
        signal: signal,
        diagonalProduct: product,
        result: (signal*product)
    };
}

function echelonMatrix(matrix) { // get a echelon form of a matrix and return if a matrix is singular
    singular = false;
    square = true;
    matrixA = cloneMatrix(matrix);
    if(matrix.length != matrix[0].length) {square = false; singular =true;} // matrix is not a square matrix
    for (var i = 0; i < matrix.length; i++) {
        console.log('i: '  +  i);
        // check the bounds for a pivot
        if (i > matrix[i].length) {
            singular = true;
            break;
        }

        // find a valid pivot
        if (!matrix[i][i]) {
            for (var j = i + 1; j < matrix.length; j++) {
                if (matrix[j][i] && i != j) {
                    if(square) {
                        elementMatrix = cloneMatrix(idendityMatrix);
                        swapRow(elementMatrix, i, j);
                    }

                    
                    steps.saveStep(matrix, "Swap row nº" + (i+ 1) + " with row nº" + (j+ 1), elementMatrix); // save this step
                    

                    swapRow(matrix, i, j);
                    permutationsNumber++;
                    swapRow(matrixL, i, j, true);
                    break;
                }
            }
        }
        var pivot=0;
        //if found a pivot
        var pivotPos=i;
        if (!matrix[i][i]) { // singular matrix 
            singular = true;
            
            
            for(var j = i; j < matrix[i].length; j++){
                if(matrix[i][j]) {
                    pivot = matrix[i][j];
                    pivotPos=j;
                    break;
                }
            }


            if(!pivot) { // if after search by columns has not found a valid pivot
                //swapRowsNulls(matrix);
                console.log('Not found valid pivot on row at: ' + i);
                for(var j = i+1; j < matrix.length; j++){
                    
                    if( !nullRow(matrix[j]) ) {
                        if(square) {
                            elementMatrix = cloneMatrix(idendityMatrix);
                            swapRow(elementMatrix, i, j);
                        }

                        steps.saveStep(matrix, "Swap row nº" + (i + 1) + " with row nº" + (j + 1), elementMatrix); // save this step                        
                        swapRow(matrix, i, j);
                        i--;
                        break;
                    }
                }

                continue;
            }
           // console.log(' not find at: ' +  i + '  pivot found:' +  pivot);
            //break;
        }
        else pivot = matrix[i][i];


       
        // sub all rows
        for (var j = i + 1; j < matrix.length; j++) {
            factor = (matrix[j][pivotPos] / pivot);
            var info = "(where matrix[" + (j + 1) + "][" + (pivotPos + 1) + "]/" + "matrix[" + (i + 1) + "][" + (pivotPos + 1) + "] defines this factor)";
            subRows(matrix, i, j, factor, info);
            if(!singular) matrixL[j][i] = factor;
            
        }

    }
    swapRowsNulls(matrix);



    console.log('Matrix A');
    logMatrix(matrixA);
    console.log('Matrix U:');
    logMatrix(matrix);
    

    if(!singular){

        console.log('Matrix L:');
        logMatrix(matrixL);
        matrixLU = multiplyMatrices(matrixL, matrix);
        fixMatrix(matrixLU,DIGITS, true, matrixA);
        console.log('Matrix L*U:');
        logMatrix(matrixLU);
        matrixP = generatePermutationMatrix(matrixLU, matrixA  ); // P * A = L * U
        console.log('Matrix P:');
        logMatrix(matrixP); 
    }
    else console.log('Matrix singular..');


    return singular;
}


function nullRow(row){ // verify if a row is a null row (only zeros)
    for(var i =0; i < row.length; i++) if(row[i]) return false;
    return true;
}


function findPivotReduce(matrix, a) { // find the pivot for the reduce method of a matrix on row 'a'
    var pivot = 0;
    var pos = 0;
    for (var j = 0; j < matrix[a].length; j++)
        if (matrix[a][j] != 0) {
            pivot = matrix[a][j];
            pos = j;
        }
    return {
        pivot: pivot,
        pos: pos
    };

}

function swapRowsNulls(matrix) { // swap all rows that are null to bottom of matrix
    // swap all not rows that doesn't have a pivot
    for (var i = 0; i < matrix.length; i++) {

        if (i < matrix[i].length && !matrix[i][i]) {

            var j = i;
            var found = false;
            while (!found) {
                if (j > matrix[i].length || found) break;
                for (var k = i; k < matrix.length && !found; k++) { // for each line
               //     console.log('k:' +k);
                    if(matrix[k][j]) found = true;
                    if (matrix[k][j] && i!=k ) {
                        if(square) {
                            elementMatrix = cloneMatrix(idendityMatrix);
                            swapRow(elementMatrix, i, k);
                        }

                        steps.saveStep(matrix, "Swap row nº" + (i + 1) + " with row nº" + (k + 1), elementMatrix); // save this step                        
                        swapRow(matrix, i, k);
                        
                    }
                }
                j++;
            }

        }
/*        else {
            console.log('i: '+i+ '  matrix[i].length:' + matrix[i].length + '  matrix[i][i]:' + matrix[i][i]);
        }*/
    }
}



function reduceMatrix(matrix) {
    /*
                We expect that the matrix is always on echelon form
        */

    // swapRowsNulls(matrix);

   // matrixU = cloneMatrix(idendityMatrix);
    for (var i = matrix.length - 1; i >= 0; i--) { // for all rows
        var pivot = 0;
        var pivotPos = 0;
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] != 0) {
                pivotPos = j;
                pivot = matrix[i][j];
                break;
            }
        }

        if (!pivot) continue;

        for (var j = i - 1; j >= 0; j--) {
            var factor = matrix[j][pivotPos] / pivot;
            var info = "(where matrix[" + (j + 1) + "][" + (pivotPos + 1) + "]/matrix[" + (i + 1) + "][" + (pivotPos + 1) + "]" + " defines this factor)";
            //if(pivot) matrixU[j][i] = (matrix[j][pivotPos] != 0) ? pivot/matrix[j][pivotPos] : 0;
            //if(factor) matrixU[j][i] = factor;
            subRows(matrix, i, j, factor, info);
        }
        var k = 1 / pivot;
        if (!(k == 1)) {
            // save step and strong the factor
            if(square) {
                elementMatrix = cloneMatrix(idendityMatrix);
                elementMatrix[i][i] = k;
            }

            
            //matrixU[i][i] = pivot;
            
            steps.saveStep(matrix, breakFactorDescription("Multiply row nº" + (i + 1) + " per aprox " + fixNumber(k, DIGITS) + " (where  1/matrix[" + (i + 1) + "][" + (pivotPos + 1) + "] defines this factor)", "strong"), elementMatrix); // save this step
            multiplyRow(matrix, i, k, true);
        }
    }
}


function check(matrix) { //check if has some term (i,j) that is NaN or undefined
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (isNaN(matrix[i][j]) || matrix[i][j] == undefined) return true;
        };
    };
    return false;
}

function fixNumber(number, digits) {
    var rounded = number.toFixed(digits);
    rounded = parseFloat(rounded);
    return (rounded % 1) ? rounded : parseFloat(rounded.toFixed(0));

}

function findElementAprox(matrix, element, EPS){

    for(var i=0;i<matrix.length;i++){
        for(var j=0;j<matrix[i].length;j++) {

            if(Math.abs(matrix[i][j] - element) <= EPSLU  ){
                element=matrix[i][j];

            }
        }
    }
    return element;
}


function fixMatrix(matrix, digits, luRound, matrixFind) { // round all matrix[i][j] by the number of 'digits'
    var rounded = 0;
    
    luRound =  (luRound!=undefined && luRound!=null && !isNaN(luRound) && luRound) ? true : false;  // aprox elements of a LU multiply result matrix 
    
    for (var i = 0; i < matrix.length; i++)
        for (var j = 0; j < matrix[i].length; j++)
            if (matrix[i][j] % 1) {
                rounded = matrix[i][j].toFixed(digits);
                rounded = parseFloat(rounded);
                matrix[i][j] = (rounded % 1) ? rounded : parseFloat(rounded.toFixed(0));
                if(luRound) matrix[i][j] = findElementAprox(matrixFind, matrix[i][j], EPSLU);
            }
}

function fixMatrixEchelon(matrix, lim) {
    /*
        Check and verify if the echelon got some error
        and if got, study if it's a EPS error or a powerful error
    */
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < i && j < matrix[i].length; j++) {
            if (matrix[i][j] != 0) {
                if (Math.abs(matrix[i][j] - 0) <= lim ) matrix[i][j] = 0;
                else {                                                          
                    return {
                        fixed: false,
                        i: i,
                        j: j
                    };
                }
            }
        }
    }
    return {
        fixed: true,
        i: 0,
        j: 0
    };
}


function getMaxELementLength(matrix){ // return the element whose length is the bigger
    var maxLength = 0;

    for(var i = 0; i < matrix.length; i++)
        for(var j = 0 ; j < matrix[i].length; j++)
            maxLength = Math.max(maxLength, matrix[i][j].toString().length);

    return maxLength;
}

function htmlMatrix(matrix) { // return a matrix at html format, i.e: tbody,tr and td elements 



    var htmlString = document.createElement('tbody');

    for (var i = 0; i < matrix.length; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < matrix[i].length; j++) {
            var cell = document.createElement('td');
            cell.innerHTML = matrix[i][j];
            row.appendChild(cell);
        }
        htmlString.appendChild(row);
    }

    return htmlString;
}



function Steps() {
    /*
        Entity that store all information about steps on operation
    */
    this.list = [];
    this.actual = 0;
    this.size = 0;


    this.restart = function() {
        this.list = [];
        this.actual = 0;
        this.size = 0;
    }

    this.saveStep = function(matrix, description, elementMatrix) {
        //alertMatrix(matrix);
        //console.log("ELEMENT MATRIX: " + elementMatrix);
        
        if(square) {
            fixMatrix(elementMatrix, DIGITS); // round results
            
        }

        

        

        this.list[this.list.length] = {
            matrix: matrix,
            description: description,
            matrixHtml: htmlMatrix(matrix),
            elementMatrix: elementMatrix,
            elementMatrixHtml: htmlMatrix(elementMatrix)
        };
        this.size++;
    }

    this.getNext = function() {
        if (this.actual >= this.list.length) return 0;
        return this.list[this.actual++];
    }

    this.logSteps = function(){
        for(var i=0; i < this.list.length; i++){
            console.log('Step: ' +( i+1));
            logMatrix(this.list[i]);
        }

    }

    this.getAllHtml = function() {

    }


    this.generateStepHtml = function(step) {

        // get the matrix
        var matrix = this.list[step];

        if (matrix == undefined || matrix.matrixHtml == undefined) {
            console.log('step undefined: ' + step);
        }

        var matrixHtml = matrix.matrixHtml;

        var descriptionText = matrix.description;


        // create all elements nescessary 
        var container = document.createElement('div');
        container.setAttribute('class', 'container');
        container.setAttribute('id', 'containerStep');

        //generate the step descriptuion
        var containerDescr = document.createElement('div');
        containerDescr.setAttribute('class', 'container');
        containerDescr.setAttribute('id', 'containerDescr');

        var title = document.createElement('h1');
        title.setAttribute('id', 'stepNumber');
        var description = document.createElement('strong');
        description.setAttribute('id', 'descriptionStep');

        //set description
        title.innerHTML =  ((step != this.list.length-1) ? ('Step: '+ (step + 1)) : "It's over" );
        description.innerHTML = descriptionText;

        // apend child's from description
        containerDescr.appendChild(title);
        containerDescr.appendChild(description);

        container.appendChild(containerDescr);

        row = generateRowMatrixHtml(matrixHtml);
        container.appendChild(row);
        if(square && step < (this.size-1) ) {
             //   Now container contains descript and step matrix
            var elementMatrix = this.generateElementHtml(step);
            $(elementMatrix).hide(); // hide the element matrix

            var elementButton = document.createElement('button'); // create a button to this element matrix
            elementButton.setAttribute('class', 'btn btn-warning btn-sm'); // give some style
            elementButton.setAttribute('id', 'toggleElemenButton');
            elementButton.innerHTML = "See Elementar";
            container.appendChild(elementButton); 
            
            //    Now container contains descript, step matrix and element button
            elementButton.parentNode.insertBefore(elementMatrix, elementButton);
            //    Now container contains descript,step matrix, element matrix and element button
            elementButton.setAttribute('value', '0');
            $(elementButton).click(function(){ // define this button action
               elementButton.disabled = true;
               
               var valueButton = parseInt(elementButton.value);
                
                if(!(valueButton%2)) {
                    $(elementButton).prev().prev().fadeOut(function(){
                        $(elementButton).prev().fadeIn(function(){
                            elementButton.innerHTML = 'Back to step'; 
                            elementButton.disabled = false;
                        });
                    });
                }
                else{
                    $(elementButton).prev().fadeOut(function(){
                        $(elementButton).prev().prev().fadeIn(function(){
                            elementButton.innerHTML = 'See Elementar';
                             elementButton.disabled = false;
                        });
                    });                
                }
                valueButton++;
                valueButton%=2;
                elementButton.setAttribute('value', valueButton );

            });     

        }       




        return container;
    }

    this.generateElementHtml = function(step){
        var elementMatrix = this.list[step].elementMatrixHtml;
        return generateRowMatrixHtml(elementMatrix);
    }
}

function appendPALUResults(matrixP, matrixA, matrixL, matrixU, id, button){
    matrixP = {matrix: generateRowMatrixHtml(htmlMatrix(matrixP)), info: "Matrix P:"};
    matrixA = {matrix: generateRowMatrixHtml(htmlMatrix(matrixA)), info: "Matrix A:"};
    matrixU = {matrix: generateRowMatrixHtml(htmlMatrix(matrixU)), info: "Matrix U:"};
    matrixL = {matrix: generateRowMatrixHtml(htmlMatrix(matrixL)), info: "Matrix L:"};



    var array = [matrixP, matrixA, matrixL, matrixU];
    var insert;
    if(!button) insert = document.getElementById(id);
    else insert = document.getElementById(id).firstElementChild;
    for(var i=0;i<array.length;i++){
        var container = createContainer();
        container.setAttribute('id', 'containerStep');
        var descriptionContainer = createContainer();
        descriptionContainer.setAttribute('id','containerDescr');
        var info = document.createElement('h1');
        info.setAttribute('id', 'stepNumber');
        info.innerHTML = array[i].info;
        descriptionContainer.appendChild(info);
        container.appendChild(descriptionContainer);

        container.appendChild(array[i].matrix);
        if(button) insert.parentNode.insertBefore(container, insert); // insert all nodes before buttons div
        else insert.appendChild(container);
    }
}

function generateRowMatrixHtml(matrixHtml){ // generate a row (div) containing the matrix argument 

        var row = document.createElement('div');
        row.setAttribute('class', 'row');

        // genarete a col with results
        var col = document.createElement('div');
        col.setAttribute('class', 'col-xs-12');

        var divResponsive = document.createElement('div');
/*        divResponsive.setAttribute('class', 'table-responsive');*/
        divResponsive.setAttribute('id', 'resultsResponsive');

        var table = document.createElement('table');
        table.setAttribute('class', 'box table table-bordered');
        table.setAttribute('id', 'matrixResultsHolder');



        //append child's from container
        table.appendChild(matrixHtml);
        divResponsive.appendChild(table);


        // append child's from table
        col.appendChild(divResponsive);
        row.appendChild(col);

        setTableWidth(matrix, table);

        return row;
}
