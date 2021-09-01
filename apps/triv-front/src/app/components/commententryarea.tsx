import React, { ChangeEvent } from 'react';
import Button from './button';
import TextInput from './textinput';

interface props {
   onSubmit: (comment: string) => void
}

interface state {
   comment: string,
   submitting: boolean
}

export class CommentEntryArea extends React.Component<props, state> {
   constructor(props: props) {
      super(props);
      this.state = {
         comment: '',
         submitting: false
      };
      this.onChangeInput = this.onChangeInput.bind(this);
      this.onClickSubmit = this.onClickSubmit.bind(this);
   }

   render() {
      const { comment, submitting } = this.state;
      return (
         <div className="comment-entry-area">
            <TextInput type="text" placeholder="Enter a comment..." value={comment} onChange={this.onChangeInput}/>
            <Button type="button" disabled={!comment.trim() || !!submitting} onClick={this.onClickSubmit}>OK</Button>       
         </div>
      );
   }

   onChangeInput(ev: ChangeEvent<HTMLInputElement>) {
      this.setState({
         comment: ev.target.value
      });
   }

   onClickSubmit() {
      this.props.onSubmit(this.state.comment.trim());
      this.setState({
         submitting: true
      });
   }


};
