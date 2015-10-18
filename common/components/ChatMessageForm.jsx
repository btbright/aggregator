import React, { Component, PropTypes } from 'react'
import cx from 'classnames'

class ChatMessageForm extends Component {
	constructor(props) {
      	super(props);
		this.state = {
			hasSpaceConflict : false,
			userInput : ''
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	handleChange(e){
		var hasConflict = false;
		var inputText = e.target.value;
		
		var submitInstructionsWidth = React.findDOMNode(this.refs.submitInstructions).getBoundingClientRect().width;
		var textWidth = this.refs.hiddenCommentMirror ?  React.findDOMNode(this.refs.hiddenCommentMirror).getBoundingClientRect().width : 0;
		var inputWidth = React.findDOMNode(e.target).getBoundingClientRect().width;

		if (inputWidth-submitInstructionsWidth<=textWidth+60){
			hasConflict = true;
		}
		
		this.setState({
			userInput: inputText,
			hasSpaceConflict : hasConflict
		});
	}
	handleSubmit(e){
		const text = e.target.value.trim();
		if (e.which === 13) {
		  e.preventDefault()
		  this.props.onNewMessage(text);
		  this.setState({ userInput: '' });
		}
	}
	render(){
		var classNames = cx('comment-form',{
			'has-entered-text' : !!this.state.userInput,
			'space-conflict' : this.state.hasSpaceConflict
		});
		var hiddenCommentMirror;
		if (!!this.state.userInput){
			hiddenCommentMirror = <span ref="hiddenCommentMirror" className="hidden-comment-mirror">{this.state.userInput}</span>
		}
		
		return (
			<form className={classNames}>
			  {hiddenCommentMirror}
              <input 
              	type="text" 
              	value={this.state.userInput} 
              	ref="commentBox" 
              	onChange={this.handleChange} 
              	onKeyDown={this.handleSubmit.bind(this)}
              	className="comment-box" 
              	placeholder={this.props.placeholder} />
              <span ref="submitInstructions" className="submit-instructions">Press Enter To Submit</span>
            </form>
			);
	}
}

export default ChatMessageForm