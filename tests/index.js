"use strong";
"use strict";

const assert = require('assert');
const T = require('..');

describe('T()', function() {
	it('works with 0 args', function() {
		T();
	});

	it('throws with odd # of args', function() {
		assert.throws(function() {
			T(1);
		}, /an even number/);

		assert.throws(function() {
			T(1, T.number, 3);
		}, /an even number/);
	});

	it('throws error if given wrong type', function() {
		assert.throws(function() {
			T(new Buffer("hi"), T.string);
		}, /First variable: Expected.*string.*got/);
	});

	it('throws error if given wrong type in second position', function() {
		assert.throws(function() {
			T(3, T.number, new Buffer("hi"), T.string);
		}, /Second variable: Expected.*string.*got/);
	});

	it("doesn't throw if given correct types", function() {
		assert.strictEqual(undefined, T(3, T.number));
		assert.strictEqual(T(3, T.number, [new Buffer("hi")], T.list(Buffer)));
	});
});