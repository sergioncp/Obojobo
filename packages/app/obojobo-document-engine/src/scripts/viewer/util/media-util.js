import Common from 'Common'
import { DEFAULT_ZOOM } from '../stores/media-store/media-constants'

const { Dispatcher } = Common.flux

const MediaUtil = {
	mediaPlayed(actor, playHeadPosition) {
		return Dispatcher.trigger('media:played', {
			value: {
				actor,
				playHeadPosition
			}
		})
	},

	mediaPaused(actor, playHeadPosition) {
		return Dispatcher.trigger('media:pause', {
			value: {
				actor,
				playHeadPosition
			}
		})
	},

	mediaEnded(actor, playHeadPosition) {
		return Dispatcher.trigger('media:ended', {
			value: {
				actor,
				playHeadPosition
			}
		})
	},

	mediaSeekTo(actor, playHeadPosition, previousPlayHeadPosition) {
		return Dispatcher.trigger('media:seekTo', {
			value: {
				actor,
				playHeadPosition,
				previousPlayHeadPosition
			}
		})
	},

	mediaBuffering(actor, playHeadPosition) {
		return Dispatcher.trigger('media:buffering', {
			value: {
				actor,
				playHeadPosition
			}
		})
	},

	show(id) {
		return Dispatcher.trigger('media:show', {
			value: {
				id
			}
		})
	},

	hide(id, actor = null) {
		return Dispatcher.trigger('media:hide', {
			value: {
				id,
				actor
			}
		})
	},

	setDefaultZoom(id, zoom) {
		return Dispatcher.trigger('media:setDefaultZoom', {
			value: {
				id,
				zoom
			}
		})
	},

	setZoom(id, zoom) {
		return Dispatcher.trigger('media:setZoom', {
			value: {
				id,
				zoom
			}
		})
	},

	resetZoom(id) {
		return Dispatcher.trigger('media:resetZoom', {
			value: {
				id
			}
		})
	},

	isZoomAtDefault(state, model) {
		return MediaUtil.getDefaultZoom(state, model) === MediaUtil.getZoom(state, model)
	},

	getDefaultZoom(state, model) {
		if (typeof state.defaultZoomById[model.get('id')] === 'undefined') return DEFAULT_ZOOM
		return state.defaultZoomById[model.get('id')]
	},

	getZoom(state, model) {
		if (typeof state.zoomById[model.get('id')] === 'undefined') {
			return MediaUtil.getDefaultZoom(state, model)
		}

		return state.zoomById[model.get('id')]
	},

	isShowingMedia(state, model) {
		return state.shown[model.get('id')] === true
	}
}

export default MediaUtil
