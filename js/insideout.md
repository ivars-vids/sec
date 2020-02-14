# ANGULAR
```
<script>
Object.prototype.toLog = function(){
	if (!this.$eval){
		return
	}
	delete Object.prototype.toLog
	console.log('$scope', this);
	return this;
}
</script>
{{ $root.toLog() }}
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
