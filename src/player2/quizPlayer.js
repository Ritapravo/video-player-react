import { React, useState } from 'react';
import classes from './player.module.css';
import Form from 'react-bootstrap/Form';
import { FormControl } from 'react-bootstrap';
import {Button} from 'react-bootstrap';

const QuizPlayer = (props) => {
    const { quiz } = props;
    const [content, setContent] = useState({ ...quiz });
    console.log(content);
    return (
        <div>
            <h5>{content.title}</h5>
            <hr></hr>
            <p className={classes.smallp} style={{ display: 'inline-block' }}>0/{content.marks} marks</p>
            <p className={classes.smallp} style={{ display: 'inline-block', float: 'right' }}>0/{content.attempts} attempts</p>
            <p>Q: {content.description}</p>
            {
                content?.options?.map((item, index) => (

                    <div style={{ position: 'relative', marginBottom:'10px' }}>
                        <div style={{position:'absolute', display:'flex', height:'100%'}}>
                            <Form.Check
                                inline
                                style={{ marginTop: '3px'}}
                                name="group1"
                                type={content.quizType === 'Single Choice Question' ? 'radio' : 'checkbox'}
                                // checked={item.rightAns}
                                // onChange={(e) => { handleChangeOptionSelect(e, item, index) }}
                            />
                        </div>
                        <p
                            style={{  display: 'inline-block', paddingLeft: '30px', whiteSpace: 'initial', margin:'0'}}
                            // value={item.desc}
                            // onChange={(e) => { modifyTextOption(e, item, index) }}
                        >
                            {item.desc}
                        </p>
                    </div>


                ))
            }
            <div style={{textAlign:'left'}}>
                <Button size={'sm'} variant='outline-success'>
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default QuizPlayer;