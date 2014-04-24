var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var doctrine = require('doctrine');
var chalk = require('chalk');

/**
 * Take a function node and analyze its JsDoc comments
 * @param  {FunctionDeclaration} node  FunctionDeclaration esprima node
 * @return {null}
 * @throws {Error} Will throw when invalid JsDoc is encountered
 */
function analyzeFunction(node) {
	var comment = node.leadingComments[0];
	if (comment.type !== 'Block') {
		return;
	}
	var data = doctrine.parse(comment.value, { unwrap: true });

	var params = [];
	data.tags.forEach(function (tag) {
		if (tag.title === 'param') {
			params.push(tag.name);
		}
	});

	var missing = [];
	node.params.forEach(function (param) {
		if (params.indexOf(param.name) < 0) {
			missing.push(param.name);
		}
	});
	if (missing.length > 0) {
		var msg = '';
		msg += 'In function ' + chalk.cyan(node.id.name) + ' (Line ' + node.loc.start.line + '):\n';
		missing.forEach(function (m) {
			msg += '  Parameter ' + chalk.cyan(m) + ' is not documented.';
		});
		throw new Error(msg);
	}
}

/**
 * Accept a node and analyze it if it's a function
 * @param  {Object} node Esprima node
 * @return {null}
 */
function verify(node) {
	switch (node.type) {
		case esprima.Syntax.FunctionDeclaration:
			if (node.leadingComments && node.leadingComments.length === 1) {
				analyzeFunction(node);
			}
			break;
		default:
			break;
	}
}

/**
 * Take a javascript file content to analyze the JsDoc syntax
 * @param  {String} content File content
 * @return {null}
 */
module.exports = function check(content) {
	var tree = esprima.parse(content.toString(), { attachComment: true, loc: true });
	estraverse.traverse(tree, { enter: verify });
}
