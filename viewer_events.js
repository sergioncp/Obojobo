let oboEvents = oboRequire('obo_events')
let viewerState = oboRequire('viewer/viewer_state')

oboEvents.on('client:nav:lock', (event, req) => {
	setNavLocked(event.userId, event.draftId, true)
})

oboEvents.on('client:nav:unlock', (event, req) => {
	setNavLocked(event.userId, event.draftId, false)
})

oboEvents.on('client:nav:open', (event, req) => {
	setNavOpen(event.userId, event.draftId, true)
})

oboEvents.on('client:nav:close', (event, req) => {
	setNavOpen(event.userId, event.draftId, false)
})

oboEvents.on('client:nav:toggle', (event, req) => {
	setNavOpen(event.userId, event.draftId, event.payload.open)
})

oboEvents.on('internal:renderViewer', (req, res, oboGlobals, state) => {
	oboGlobals.set('navViewState', state)
})

function setNavOpen(userId, draftId, value) {
	viewerState.set(userId, draftId, 'nav:isOpen', 1, value)
}

function setNavLocked(userId, draftId, value) {
	viewerState.set(userId, draftId, 'nav:isLocked', 1, value)
}

module.exports = (req, res, next) => {
	next()
}
