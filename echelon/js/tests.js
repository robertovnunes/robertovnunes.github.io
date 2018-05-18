/*
* Copyright (c) 2006-2011 Marlon Reghert Alves dos Santos & Lucas de Souza Albuquerque
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
*/

var test = false;
if(test) { 
	//TEST ONE
	console.log("Tests 1:");
	var matA = [1];
	var matB = [1,2];
	console.log(equalsMatrices(matA, matB));
	matB = [[1],[2]];
	console.log(equalsMatrices(matA, matB));
	matA = [[1,2],[3,4]];
	matB = [[2,3],[4,3]];
	console.log(equalsMatrices(matA, matB));
	matB = matA;
	console.log(equalsMatrices(matA, matB));
	 
	//TEST TWO
	console.log("Tests 2:");
	console.log(multiplyMatrices(matA, matB));
	   
	//TEST THREE
	console.log("Tests 3");
	console.log(breakFactorDescription("Multiply row nºA per aprox K (where 1/matrix[i][j]) defines this factor", "tag"));
	console.log(breakFactorDescription("Subtract row nºA by aprox. K times row nº2 (where matrix[a][b]/matrix[c][d] defines this factor)", "marlon"));
	 
	//TEST FOUR
	console.log("Tests 4");
	matA = [[1,2,3],[3,2,1],[2,3,1]];
	matB = [[3,2,1],[2,3,1],[1,2,3]];
	console.log(generatePermutationMatrix(matA,matB));

	matA = [[1,2,3], [413,5.12,6.0], [234.123, 99, -1]];

	console.log("Test 5, expected: " + 234.123.toString().length);
	console.log("Result: " + getMaxELementLength(matA));




}
