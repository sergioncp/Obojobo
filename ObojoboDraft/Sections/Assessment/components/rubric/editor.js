import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import ParameterNode from '../../../../../src/scripts/oboeditor/components/parameter-node'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Mod extends React.Component {
	deleteNode() {
		const editor = this.props.editor
		const change = editor.value.change()

		const parent = editor.value.document.getDescendant(this.props.parent.key)

		const sibling = parent.nodes.get(1)

		// If this is the only row in the table, delete the table
		if (!sibling) {
			change.removeNodeByKey(parent.key)
			editor.onChange(change)
			return
		}

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}

	render() {
		return (
			<div {...this.props.attributes} className={'mod pad'}>
				{this.props.children}
				<button className={'delete-node'} onClick={() => this.deleteNode()}>
					{'X'}
				</button>
			</div>
		)
	}
}

const ModList = props => {
	return (
		<div {...props.attributes}>
			<p contentEditable={false}>{'Mods:'}</p>
			{props.children}
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addMod() {
		const editor = this.props.editor
		const change = editor.value.change()

		// If we are adding the first mod, we need to add a ModList
		if (this.props.node.nodes.size < 5) {
			const modlist = Block.create({ type: MOD_LIST_NODE })
			change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, modlist)

			editor.onChange(change)
			return
		}

		const modlist = this.props.node.nodes.get(4)

		const mod = Block.create({ type: MOD_NODE })
		change.insertNodeByKey(modlist.key, modlist.nodes.size, mod)

		editor.onChange(change)
	}

	deleteNode() {
		const editor = this.props.editor
		const change = editor.value.change()

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}

	render() {
		return (
			<div {...this.props.attributes} className={'rubric pad'}>
				<h1 contentEditable={false}>{'Rubric'}</h1>
				<p contentEditable={false}>{'Type: ' + this.state.type}</p>
				{this.props.children}
				<button onClick={() => this.addMod()}>{'Add Mod'}</button>
				<button className={'delete-node'} onClick={() => this.deleteNode()}>
					{'X'}
				</button>
			</div>
		)
	}
}

const slateToObo = node => {
	const json = {}
	json.type = 'pass-fail'
	json.mods = []

	node.nodes.forEach(parameter => {
		if (parameter.type === MOD_LIST_NODE) {
			parameter.nodes.forEach(mod => {
				const oboMod = {
					attemptCondition: mod.nodes.get(0).text,
					reward: mod.nodes.get(1).text
				}

				json.mods.push(oboMod)
			})
		} else {
			json[parameter.data.get('name')] = parameter.text === '' ? undefined : parameter.text
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = RUBRIC_NODE
	json.data = { content: node }

	json.nodes = []

	json.nodes.push(
		ParameterNode.helpers.oboToSlate(
			'passingAttemptScore',
			node.passingAttemptScore,
			'Passing Score'
		)
	)
	json.nodes.push(
		ParameterNode.helpers.oboToSlate('passedResult', node.passedResult, 'Passed Result')
	)
	json.nodes.push(
		ParameterNode.helpers.oboToSlate('failedResult', node.failedResult, 'Failed Result')
	)
	json.nodes.push(
		ParameterNode.helpers.oboToSlate(
			'unableToPassResult',
			node.unableToPassResult,
			'Unable to Pass Result'
		)
	)

	if (node.mods) {
		const modList = {
			object: 'block',
			type: MOD_LIST_NODE,
			nodes: []
		}

		node.mods.forEach(mod => {
			const slateMod = {
				object: 'block',
				type: MOD_NODE,
				nodes: []
			}

			slateMod.nodes.push(
				ParameterNode.helpers.oboToSlate(
					'attemptCondition',
					mod.attemptCondition,
					'Attempt Condition'
				)
			)
			slateMod.nodes.push(ParameterNode.helpers.oboToSlate('reward', mod.reward, 'Reward'))

			modList.nodes.push(slateMod)
		})

		json.nodes.push(modList)
	}
	return json
}

const validateMod = node => {
	if (node.nodes.size !== 1) return
	if (node.nodes.first().data.get('name') === 'attemptCondition') return

	const block = Block.create({
		type: 'Parameter',
		data: {
			name: 'attemptCondition',
			display: 'Attempt Condition'
		}
	})

	return change => change.insertNodeByKey(node.key, 0, block)
}
const validateRubric = node => {
	if (node.nodes.size === 0 || node.nodes.size > 3) return
	if (node.nodes.first().data.get('name') !== 'passingAttemptScore') {
		const block = Block.create({
			type: 'Parameter',
			data: {
				name: 'passingAttemptScore',
				display: 'Passing Score'
			}
		})

		return change => change.insertNodeByKey(node.key, 0, block)
	}

	if (node.nodes.get(1).data.get('name') !== 'passedResult') {
		const block = Block.create({
			type: 'Parameter',
			data: {
				name: 'passedResult',
				display: 'Passed Result'
			}
		})

		return change => change.insertNodeByKey(node.key, 1, block)
	}

	const block = Block.create({
		type: 'Parameter',
		data: {
			name: 'failedResult',
			display: 'Failed Result'
		}
	})

	return change => change.insertNodeByKey(node.key, 2, block)
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MOD_NODE:
				return <Mod {...props} />
			case MOD_LIST_NODE:
				return <ModList {...props} />
			case RUBRIC_NODE:
				return <Node {...props} />
		}
	},
	validateNode(node) {
		if (node.type !== MOD_NODE && node.type !== RUBRIC_NODE) return
		if (node.nodes.first().object === 'text') return

		switch (node.type) {
			case MOD_NODE:
				return validateMod(node)
			case RUBRIC_NODE:
				return validateRubric(node)
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Sections.Assessment.Rubric.ModList': {
				nodes: [{ types: [MOD_NODE], min: 1, max: 20 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: MOD_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: MOD_NODE
							})
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.Rubric.Mod': {
				nodes: [{ types: ['Parameter'], min: 2, max: 2 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: 'Parameter',
								data: {
									name: index === 0 ? 'attemptCondition' : 'reward',
									display: index === 0 ? 'Attempt Condition' : 'Reward'
								}
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: 'Parameter',
								data: {
									name: index === 0 ? 'attemptCondition' : 'reward',
									display: index === 0 ? 'Attempt Condition' : 'Reward'
								}
							})
						}
					}
				}
			}
		}
	}
}

const Rubric = {
	components: {
		Node,
		ModList,
		Mod
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Rubric
