# ANGULAR
```
<script>
Array.prototype.toLog = function(){
	this.forEach(console.log);
	return 'Go check console.log'
}
</script>
{{ [this, $root].toLog() }}
```

# WEBPACK ARRAY
```
webpackJsonp.push(
	[[2147483646], {
			'2147483646': function (module, exports, __webpack_require__) {
				return window.webpackMethods = {
					module: module,
					exports: exports,
					require: __webpack_require__
				}
			}
		}, [[2147483646]]
	]);
```

# WEBPACK FUNCTION
```
webpackJsonp(
	[2147483647],{
		'2147483647':function(module, exports, __webpack_require__){
			return window.webpackMethods = {
				module: module,
				exports: exports,
				require: __webpack_require__
			}
		}
	},[2147483647]);
```
