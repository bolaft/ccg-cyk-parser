/*jshint sub: true */

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

/*var grammar = "Pierre: SN\naime: (SN\\S)/SN\nbeaucoup: (SN\\S)\\(SN\\S)\nles: SN/N\ncacahuètes: N";
var sentence = "Pierre aime les cacahuètes";*/

var timer = 0;
var sleep = 500;

var lexicon = {};
var rules = {};

var chart;
var words;

/**
 * Initialization
 */
$(document).ready(function() {
	$('.results').hide();

	$('.button_parse').click(function() {
		$('.inputs').hide();
		$('.results').show();

		init($('.input_grammar').val(), $('.input_sentence').val());
		parseCCG();
	});

	$('.button_hover').click(function() {
		location.reload();
	});
});

function init(grammar, sentence) {
	words = sentence.split(" ");

	var definitions = grammar.split("\n");

	for (var i = 0; i < definitions.length; i++) {
		var def = definitions[i].split(": ");

		lexicon[def[0]] = def[1];
	}
}

function getStructure(def) {
	if (typeof def !== "string") return false;

	if (def.contains("/") || def.contains("\\")) {
		var depth = 0;
		var index;
		var over;

		for (var j = 0; j < def.length; j++){
			switch(def[j]) {
				case '/':	if (depth === 0) { index = j; over = true; } break;
				case '\\':	if (depth === 0) { index = j; over = false; } break;
				case '(':	depth++; break;
				case ')':	depth--; break;
			}
		}

		var left = def.substring(0, index);

		if (left[0] === "(") left = left.substring(1);
		if (left[left.length - 1] === ")") left = left.substring(0, left.length - 1);

		var right = def.substring(index + 1);
		if (right[0] === "(") right = right.substring(1);
		if (right[right.length - 1] === ")") right = right.substring(0, right.length - 1);

		var rule = {};

		if (over)	{ rule["over"] = left; rule["under"] = right; }
		else		{ rule["over"] = right; rule["under"] = left; }

		return rule;
	} else {
		return false;
	}
}

function parseCCG() {
    chart = new Array(words.length);

    for (var i = 0; i < chart.length; i++) chart[i] = new Array(words.length - (i));

    for (var j = 0; j < chart[0].length; j++) chart[0][j] = lexicon[words[j]];

    paintChart();

    for (var k = 0; k < chart.length; k++){
		for (var l = 0; l < chart[k].length; l++) {
			if (k > 0) {
				setTimeout(paint, timer, k, l, "blue");
				timer += sleep;
				checkCell(k, l);
			}

			setTimeout(clean, timer, k, l);
		}
    }
}

function fillCell(row, col) {
	getCell(row, col).html(chart[row][col]);
}

function checkCell(row, col) {
	for (var i = 0; i < row; i++) {
		lcol = col;
		lrow = row - 1 - i;
		rcol = row + col - i;
		rrow = i;

		lcell = chart[lrow][lcol];
		rcell = chart[rrow][rcol];

		setTimeout(paintPair, timer, lrow, lcol, rrow, rcol, "gray");
		timer += sleep;

		product = joinCells(lcell, rcell);

		if (product){
			chart[row][col] = product;
			setTimeout(paint, timer, row, col, "green");
			setTimeout(fillCell, timer, row, col);
			timer += sleep;

			setTimeout(cleanPair, timer, lrow, lcol, rrow, rcol);

			break;
		}

		setTimeout(cleanPair, timer, lrow, lcol, rrow, rcol);
	}
		
	clean(row, col);
}

function joinCells(lcell, rcell) {
	lstructure = getStructure(lcell);
	rstructure = getStructure(rcell);

	if (lstructure && !rstructure) {
		if (lstructure.under === rcell) return lstructure.over;
	}

	if (rstructure && !lstructure) {
		if (rstructure.under === lcell) return rstructure.over;
	}

	return false;
}

function paintChart() {
	var html;
	var tdwidth = 100 / words.length;
	var tdheight = (100 / words.length) - 2;

	for (var i = chart.length - 1; i > -1; i--){
		html += "<tr>";

		for (var j = 0; j < chart[i].length; j++){
			html += "<td style=\"width:" + tdwidth + "%; height:" + tdheight + "%\" class=\"bordered " + i + "-" + j + "\">";
			html += "</td>";
		}

		html += "</tr>";
	}

	for (var k = 0; k < words.length; k++) {
			html += "<td class=\"words\">" + words[k] + "</td>";

			setTimeout(fillCell, timer, 0, k);
			setTimeout(paint, timer, 0, k, "blue");
			timer += sleep;
			setTimeout(clean, timer, 0, k);
	}

	$('.chart').append(html);
}

function getCell(row, col) {
	return $("." + row + "-" + col);
}

function paint(row, col, color) {
	clean(row, col);
	getCell(row, col).addClass(color);
}

function clean(row, col) {
	getCell(row, col).removeClass("blue green gray");
}

function paintPair(lrow, lcol, rrow, rcol, color) {
	paint(lrow, lcol, color);
	paint(rrow, rcol, color);
}

function cleanPair(lrow, lcol, rrow, rcol) {
	clean(lrow, lcol);
	clean(rrow, rcol);
}