/**
 * Created by gitbong on 6/7/16.
 */
var gb = gb || {};
(function (ins) {

	var _pathMap = {};
	var _defaultPath;

	var _preHash = '';
	var _currHash = '';

	var _linkToDefault = false;

	function _init() {
		window.addEventListener('hashchange', function () {
			console.log('-------- 1',_getHash());
			if (_pathMap[_getHash()] == null) {
				_linkToDefault = true;
				_setHash(_defaultPath);
			}

			_preHash = _currHash;
			_currHash = window.location.hash;
			// console.log('change', _preHash, _currHash);
		});
	}

	//=========================

	function _setHash(v) {
		window.location.hash = v;
	}

	function _getHash() {
		return window.location.hash;
	}

	function _addHashChangeListener(fn) {
		window.addEventListener('hashchange', function (e) {
			console.log('-------- 2',_getHash());
			if (_linkToDefault == false) {
				fn(_pathMap[_currHash]);
			}
			_linkToDefault = false;
		});
	}

	//=========================

	/*
	 * config:{path:"/firstpage",asIndex:true}
	 **/
	function _when(config) {
		if (config.path != null) {
			_pathMap['#' + config.path] = config;
		}
		return ins.router;
	}

	function _otherwise(path) {
		_defaultPath = '#' + path;
		return ins.router;
	}

	function _start() {
		if (_pathMap[_getHash()] == null) {
			_linkToDefault = true;
			_setHash(_defaultPath);
			return;
		}
		if (_pathMap[_getHash()].asIndex == false) {
			_linkToDefault = true;
			_setHash(_defaultPath);
		}
	}

	//=========================

	_init();

	ins.router = {
		when: _when,
		otherwise: _otherwise,
		start: _start,
		addHashChangeListener: _addHashChangeListener
	};

	// ins.router.when = _when;
	// ins.router.otherwise = _otherwise;
})(gb);