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

                    <div style={{ position: 'relative', marginBottom: '20px', height: '40px' }}>
                        
                            <Form.Check
                                inline
                                style={{ margin: 'auto' }}
                                name="group1"
                                type={content.quizType === 'Single Choice Question' ? 'radio' : 'checkbox'}
                                // checked={item.rightAns}
                                // onChange={(e) => { handleChangeOptionSelect(e, item, index) }}
                            />
                     
                        <div
                            key={index}
                            as="textarea" rows={3}
                            placeholder="Description"
                            style={{ height: '100%', display: 'inline-block', paddingLeft: '30px' }}
                            // value={item.desc}
                            // onChange={(e) => { modifyTextOption(e, item, index) }}
                        >
                            {item.desc}
                        </div>
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