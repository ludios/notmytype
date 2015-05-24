/**
 * Copied from https://github.com/gcanti/flowcheck/blob/d442fd50ae46df620e1391d57b574eda73384626/test/assert.js
 */

"use strong";
"use strict";

/* eslint-disable no-shadow */

var tape = require('tape');
var f = require('../assert');

tape('Failure.stringify', function (tape) {

	tape.plan(7);

	tape.strictEqual(
		f.Failure.stringify(1),
		'1',
		'should stringify numbers'
	);

	tape.strictEqual(
		f.Failure.stringify('a'),
		'"a"',
		'should stringify strings'
	);

	tape.strictEqual(
		f.Failure.stringify(true),
		'true',
		'should stringify booleans'
	);

	tape.strictEqual(
		f.Failure.stringify({a: 1}),
		'{\n  "a": 1\n}',
		'should stringify objects'
	);

	tape.strictEqual(
		f.Failure.stringify([1, 2, 3]),
		'[\n  1,\n  2,\n  3\n]',
		'should stringify arrays'
	);

	tape.strictEqual(
		f.Failure.stringify(Date),
		'"[Date, Function]"',
		'should stringify functions'
	);

	tape.strictEqual(
		f.Failure.stringify(/^a/),
		'"[/^a/, RegExp]"',
		'should stringify regexps'
	);

});

tape('number', function (tape) {

	tape.plan(5);

	tape.strictEqual(
		f.number.is('a'),
		false,
		'is() should return false if x is not a number'
	);

	tape.strictEqual(
		f.number.validate('a') + '',
		'Expected an instance of number got "a", (no context)',
		'validate() should fail if x is not a number'
	);

	tape.strictEqual(
		f.number.validate(1),
		null,
		'validate() should succeed if x is a number'
	);

	tape.strictEqual(
		f.number.validate(NaN),
		null,
		'validate() should succeed if x is a NaN'
	);

	tape.strictEqual(
		f.number.validate(Infinity),
		null,
		'validate() should succeed if x is Infinity'
	);

});

tape('list()', function (tape) {

	tape.plan(5);

	tape.strictEqual(
		f.list(f.number).name,
		'Array<number>',
		'should set a default name'
	);

	tape.strictEqual(
		f.list(f.number, 'MyList').name,
		'MyList',
		'should set a specified name'
	);

	tape.strictEqual(
		f.list(f.number).validate(1) + '',
		'Expected an instance of array got 1, context: Array<number>',
		'should fail if x is not an array'
	);

	tape.strictEqual(
		f.list(f.number).validate([1, 's']) + '',
		'Expected an instance of number got "s", context: Array<number> / 1',
		'should fail if an element of x is not an instance of T'
	);

	tape.strictEqual(
		f.list(f.number).validate([1, 2]),
		null,
		'should succeed if x is a list of T'
	);

});

tape('optional()', function (tape) {

	tape.plan(2);

	tape.strictEqual(
		f.optional(f.number).validate('s') + '',
		'Expected an instance of number got "s", context: number?',
		'should fail if x is not an instance of T'
	);

	tape.strictEqual(
		f.optional(f.number).validate(undefined),
		null,
		'should succeed if x is undefined'
	);

});

tape('maybe()', function (tape) {

	tape.plan(6);

	tape.strictEqual(
		f.maybe(f.number).name,
		'?number',
		'should set a default name'
	);

	tape.strictEqual(
		f.maybe(f.number, 'MyMaybe').name,
		'MyMaybe',
		'should set a specified name'
	);

	tape.strictEqual(
		f.maybe(f.number).validate('s') + '',
		'Expected an instance of number got "s", context: ?number',
		'should fail if x is not an instance of T'
	);

	tape.strictEqual(
		f.maybe(f.number).validate(null),
		null,
		'should succeed if x is null'
	);

	tape.strictEqual(
		f.maybe(f.number).validate(undefined) + '',
		'Expected an instance of number got undefined, context: ?number',
		'should fail if x is undefined'
	);

	tape.strictEqual(
		f.maybe(f.number).validate(1),
		null,
		'should succeed if x is an instance of T'
	);

});

tape('tuple()', function (tape) {

	tape.plan(6);

	tape.strictEqual(
		f.tuple([f.string, f.number]).name,
		'[string, number]',
		'should set a default name'
	);

	tape.strictEqual(
		f.tuple([f.string, f.number], 'MyTuple').name,
		'MyTuple',
		'should set a specified name'
	);

	tape.strictEqual(
		f.tuple([f.string, f.number]).validate(1) + '',
		'Expected an instance of array got 1, context: [string, number]',
		'should fail if x is not an array'
	);

	tape.strictEqual(
		f.tuple([f.string, f.number]).validate(['s']) + '',
		'Expected an instance of [string, number] got [\n  "s"\n], (no context)',
		'should fail if x is an array with wrong length'
	);

	tape.strictEqual(
		f.tuple([f.string, f.number]).validate([1, 2]) + '',
		'Expected an instance of string got 1, context: [string, number] / 0',
		'should fail if the i-th coordinate of x is not an instance of T[i]'
	);

	tape.strictEqual(
		f.tuple([f.string, f.number]).validate(['s', 1]),
		null,
		'should succeed if x is an instance of T'
	);

});

tape('dict()', function (tape) {

	tape.plan(5);

	tape.strictEqual(
		f.dict(f.string, f.number).name,
		'{[key: string]: number}',
		'should set a default name'
	);

	tape.strictEqual(
		f.dict(f.string, f.number, 'MyDict').name,
		'MyDict',
		'should set a specified name'
	);

	tape.strictEqual(
		f.dict(f.string, f.number).validate(1) + '',
		'Expected an instance of object got 1, context: {[key: string]: number}',
		'should fail if x is not an object'
	);

	/* FIXME
	tape.strictEqual(
		f.dict(f.string, f.number).validate({}) + '',
		'',
		'should fail if a key of x is not an instance of domain'
	);
	*/

	tape.strictEqual(
		f.dict(f.string, f.number).validate({a: 's'}) + '',
		'Expected an instance of number got "s", context: {[key: string]: number} / a',
		'should fail if a value of x is not an instance of codomain'
	);

	tape.strictEqual(
		f.dict(f.string, f.number).validate({a: 1, b: 2}),
		null,
		'should succeed if x is an instance of T'
	);

});

tape('shape()', function (tape) {

	tape.plan(7);

	tape.strictEqual(
		f.shape({a: f.number, b: f.string}).name,
		'{a: number; b: string;}',
		'should set a default name'
	);

	tape.strictEqual(
		f.shape({a: f.number, b: f.string}, 'MyObject').name,
		'MyObject',
		'should set a specified name'
	);

	tape.strictEqual(
		f.shape({a: f.number, b: f.string}).validate(1) + '',
		'Expected an instance of object got 1, context: {a: number; b: string;}',
		'should fail if x is not an object'
	);

	tape.strictEqual(
		f.shape({a: f.number, b: f.string}).validate({a: 1, b: 2}) + '',
		'Expected an instance of string got 2, context: {a: number; b: string;} / b',
		'should fail if a key k of x is not an instance of T[k]'
	);

	tape.strictEqual(
		f.shape({a: f.maybe(f.number)}).validate({}) + '',
		'Expected an instance of number got undefined, context: {a: ?number;} / a / ?number',
		'should fail if a key is not specified'
	);

	tape.strictEqual(
		f.shape({a: f.number, b: f.string}).validate({a: 1, b: 's'}),
		null,
		'should succeed if x is an instance of T'
	);

	tape.strictEqual(
		f.shape({a: f.number}).validate({a: 1, b: 's'}),
		null,
		'should succeed if x owns an additional property'
	);

});

tape('union()', function (tape) {

	tape.plan(4);

	tape.strictEqual(
		f.union([f.string, f.number]).name,
		'string | number',
		'should set a default name'
	);

	tape.strictEqual(
		f.union([f.string, f.number], 'MyUnion').name,
		'MyUnion',
		'should set a specified name'
	);

	tape.strictEqual(
		f.union([f.string, f.number]).validate(false) + '',
		'Expected an instance of string | number got false, context: string | number',
		'should fail if x is not an instance of T'
	);

	tape.strictEqual(
		f.union([f.string, f.number]).validate(1),
		null,
		'should succeed if x is an instance of T'
	);

});

tape('arguments()', function (tape) {

	tape.plan(6);

	tape.strictEqual(
		f.arguments([f.number, f.string]).name,
		'(number, string, ...any)',
		'should set a proper name when varargs is not specified'
	);

	tape.strictEqual(
		f.arguments([f.number, f.string], f.boolean).name,
		'(number, string, ...boolean)',
		'should set a proper name when varargs is specified'
	);

	tape.test('should fail if x is not an instance of the arguments tuple', function (tape) {

		tape.plan(3);

		tape.strictEqual(
			f.arguments([f.string, f.number]).validate(1) + '',
			'Expected an instance of array got 1, context: arguments / [string, number]'
		);

		tape.strictEqual(
			f.arguments([f.string, f.number]).validate([]) + '',
			'Expected an instance of string got undefined, context: arguments / [string, number] / 0,Expected an instance of number got undefined, context: arguments / [string, number] / 1'
		);

		tape.strictEqual(
			f.arguments([f.string, f.number]).validate(['a']) + '',
			'Expected an instance of number got undefined, context: arguments / [string, number] / 1'
		);

	});

	tape.test('should succeed if x is an instance of the arguments tuple', function (tape) {

		tape.plan(4);

		tape.strictEqual(
			f.arguments([f.string, f.number]).validate(['s', 1]),
			null
		);

		tape.strictEqual(
			f.arguments([f.string, f.number]).validate(['s', 1, 2]),
			null
		);

		tape.strictEqual(
			f.arguments([f.optional(f.number)]).validate([undefined]),
			null
		);

		tape.strictEqual(
			f.arguments([f.optional(f.number)]).validate([]),
			null
		);

	});

	tape.strictEqual(
		f.arguments([], f.string).validate([1]) + '',
		'Expected an instance of string got 1, context: varargs / Array<string> / 0',
		'should fail if x is not an instance of the varargs list'
	);

	tape.strictEqual(
		f.arguments([], f.string).validate(['a', 'b']),
		null,
		'should succeed if x is an instance of the varargs list'
	);

});
