/*
* Copyright (c) 2006-2011 Marlon Reghert Alves dos Santos & Lucas de Souza Albuquerque
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
*/

/*This file contains all methods relative of PA=LU operation and Elementary Matrix building*/


function alertMatrix(matrix) {
    var s = "";

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) s += matrix[i][j] + " ";
        s += "\n";
    }
    alert(s); // use this function to alert a matrix (use to debug)
}

function breakFactorDescription(description, tag) {
    if (description.indexOf("Subtract") != -1) {
        var sub1 = description.substring(0, description.indexOf("x") + 2);
        var sub2 = description.substring(description.indexOf("x") + 2, description.indexOf("times"));
        var sub3 = description.substring(description.indexOf("times"), description.length);
        var tot = sub1 + "<" + tag + ">" + sub2 + "</" + tag + ">" + sub3;
        return tot;
    } else {
        var sub1 = description.substring(0, description.indexOf("x") + 2);
        var sub2 = description.substring(description.indexOf("x") + 2, description.indexOf("(where"));
        var sub3 = description.substring(description.indexOf("(where"), description.length);
        var tot = sub1 + "<" + tag + ">" + sub2 + "</" + tag + ">" + sub3;
        return tot;
    }
}

function logMatrix(matrix){
	var s = "";
	for (var i = 0; i < matrix.length; i++) {
		for(var j =0; j < matrix[i].length; j++){
			s += matrix[i][j] + " ";
		}
		s += "\n";
	}

	console.log(s);
}

function cloneMatrix(matrix){
    var n = matrix.length;
    var m = matrix[0].length;
    var newMatrix = [];
    for(var i = 0; i < n; i++){
        newMatrix[i]=[];
        for(var j = 0; j < m; j++){
            newMatrix[i].push(matrix[i][j]);
        }
    }
    return newMatrix;
}

function initMatrix(matrix, n, m, idendity){
    var i, j;
    for (i= 0; i < n; i++) {
      matrix.push([]);
      for (j = 0; j < m; j++) {
        matrix[i][j] =   (i==j) ? 1 : 0;
      }
    }

    if(idendity!=undefined && idendity!=null && !isNaN(idendity) && idendity && n==m ) for(i=0;i<n;i++) matrix[i][i]=1;
}


function createContainer(){
    var container = document.createElement('div');
    container.setAttribute('class', 'container');
    return container;
}