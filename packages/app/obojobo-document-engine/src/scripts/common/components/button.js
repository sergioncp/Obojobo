import './button.scss'

import React from 'react'
import focus from '../page/focus'
import isOrNot from '../util/isornot'

export default class Button extends React.Component {
	constructor(props) {
		super(props)
		this.buttonRef = React.createRef()
	}

	static get defaultProps() {
		return {
			value: null,
			disabled: false,
			align: 'center'
		}
	}

	focus() {
		focus(this.buttonRef)
	}

	render() {
		let children
		// if value is empty string
		// value will still be rendered
		// eslint-disable-next-line eqeqeq
		if (this.props.value != null) {
			children = this.props.value
		} else {
			// eslint-disable-next-line no-extra-semi
			;({ children } = this.props)
		}

		const className =
			'obojobo-draft--components--button' +
			(this.props.altAction ? ' alt-action' : '') +
			isOrNot(this.props.isDangerous, 'dangerous') +
			` align-${this.props.align}` +
			(this.props.className ? ` ${this.props.className}` : '')

		return (
			<div className={className} contentEditable={false}>
				<button
					ref={this.buttonRef}
					className={'button'}
					onClick={this.props.onClick}
					tabIndex={this.props.shouldPreventTab ? '-1' : this.props.tabIndex}
					disabled={this.props.disabled || this.props.shouldPreventTab}
					aria-label={this.props.ariaLabel}
					aria-selected={this.props.ariaSelected}
					contentEditable={false}
					onKeyDown={this.props.onKeyDown}
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
				>
					{children}
				</button>
			</div>
		)
	}
}
