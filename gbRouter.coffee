_preHash = -1
_currHash = -1

_hashMap = {}
_defaultHash = ''
_index = 1
_isStart = false

_getHash = (url)->
	return if url.indexOf('#') isnt -1 then url.substring(url.indexOf('#') + 1) else '';

_router =
	_virtual: false
	init: ->
		window.addEventListener('hashchange', (e)->
			if _router._virtual is false
				_router._onHashChange(_getHash(e.oldURL), _getHash(e.newURL))
		)
		return

	_onHashChange: (pre, curr)->
#		console.log arguments
		_preHash = pre
		_currHash = curr

		if pre is curr then return

		if _hashMap[curr] is undefined
			_currHash = _defaultHash

		if _router._virtual is false
			history.replaceState({page: _currHash}, 'title', '#' + _currHash)

		#		console.log '--- ', pre, _currHash, _hashMap[_currHash]
		return

	when: (hash, config)->
		_hashMap[hash] = config
		return _ins

	otherwise: (hash)->
		_defaultHash = hash
		return _ins

	start: ->
		if _isStart is true then return _ins
		_isStart = true

		_router.init()

		if _router._virtual is false
			_currHash = _getHash(window.location.href)
		else
			_currHash = _defaultHash
		_router._onHashChange(-1, _currHash)
		return _ins

	goto: (hash)->
		if _isStart is false then return

		_preHash = _currHash
		hash = if _hashMap[hash] is undefined then hash = _defaultHash else hash
		_currHash = hash
		if @_virtual is false
			window.location.hash = hash.split('?')[0];
		else
			_router._onHashChange(_preHash, _currHash)
		#			console.log _hashMap, hash
		return

	useVirtualRouter: (use)->
		_router._virtual = use
		return _ins

#_router.init()

_ins =
	when: _router.when
	otherwise: _router.otherwise
	start: _router.start
	goto: _router.goto
	useVirtualRouter: _router.useVirtualRouter

window.gbRouter = _ins