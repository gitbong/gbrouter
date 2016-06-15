/**
 * Created by gitbong on 6/7/16.
 */
var gb = gb || {};
(function (ins) {

	var _pathMap = {};
	var _defaultPath;

	var _preHash = null;
	var _currHash = null;

	var _hashChangeFn = [];

	var _redirect = false;

	function _init() {
		window.addEventListener('hashchange', function () {
			var hash = _getHash();
			if (_pathMap[hash] == null) {
				_redirect = true;
				window.history.go(-1);
			} else {
				if (_currHash != hash)
					_preHash = _currHash;
				_currHash = hash;
				if (_redirect == false) {
					_hashChangeHandler();
				}
				_redirect = false;
			}
		});
	}

	//===========================

	function _setHash(v) {
		window.location.hash = v.split('?')[0];
	}

	function _getHash() {
		return window.location.hash;
	}

	function _onHashChange(fn) {
		_hashChangeFn.push(fn);
	}

	function _hashChangeHandler() {
		for (var i in _hashChangeFn) {
			_hashChangeFn[i](_pathMap[_currHash]);
		}
	}

	//=========================

	/*
	 * config:{path:"/firstpage",asIndex:true}
	 **/
	function _when(path, config) {
		if (path != null) {
			_pathMap['#' + path] = config;
			config['_hash_'] = '#' + path;
		}
		return ins.router;
	}

	function _otherwise(path) {
		_defaultPath = '#' + path;
		return ins.router;
	}

	function _getCurrHash() {
		return _currHash;
	}

	function _getPreHash() {
		return _preHash;
	}

	function _getConfig(path) {
		if (_pathMap['#' + path] != null) {
			return _pathMap['#' + path];
		} else {
			return _pathMap['#' + _defaultPath];
		}
	}

	function _urlParams() {
		var str = window.location.search;
		var arr = str.substr(1, str.length - 1).split('&');

		var obj = {};
		for (var i in arr) {
			var k = arr[i].split('=')[0];
			var v = arr[i].split('=')[1];
			obj[k] = v;
		}

		return obj;
	}

	function _start() {
		_currHash = _getHash();
		if (_pathMap[_getHash()] == null) {
			_setHash(_defaultPath);
			return;
		}
		if (_pathMap[_getHash()].asIndex == false) {
			_setHash(_defaultPath);
		} else {
			_hashChangeHandler();
		}
	}

	//=========================

	_init();

	ins.router = {
		when: _when,
		otherwise: _otherwise,
		start: _start,
		preHash: _getPreHash,
		currHash: _getCurrHash,
		urlParams: _urlParams,
		onHashChange: _onHashChange,
		getConfig: _getConfig
	};
})(gb);