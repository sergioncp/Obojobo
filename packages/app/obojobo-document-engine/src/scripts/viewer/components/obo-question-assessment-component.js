import React from 'react'

export default class OboQuestionAssessmentComponent extends React.Component {
	static canRevealAnswer(/*questionModel, questionAssessmentModel*/) {
		return false
	}

	static getDetails(/*questionModel, questionAssessmentModel, score*/) {
		return null
	}

	static getInstructions(/*questionModel, questionAssessmentModel*/) {
		return null
	}

	canRevealAnswer() {
		this.constructor.getDetails(this.props.questionModel, this.props.model)
	}

	getDetails(newScore) {
		return this.constructor.getDetails(this.props.questionModel, this.props.model, newScore)
	}

	getInstructions() {
		return this.constructor.getInstructions(this.props.questionModel, this.props.model)
	}

	calculateScore() {
		return 0
	}

	getResponse(/*response*/) {
		return {
			response: true,
			targetId: null
		}
	}

	handleFormChange(/*event, prevResponse*/) {
		return {
			state: null,
			targetId: null
		}
	}
}
