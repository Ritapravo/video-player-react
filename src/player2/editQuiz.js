import { React, useRef, useState, useMemo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import classes from './player.module.css'
import { InputGroup, FormControl, FormCheck } from 'react-bootstrap';
import { setLocalStorage } from './dummy';

import { RiDeleteBin6Line } from "react-icons/ri";

const xs = {
    left: 12,
    right: 12
}
const md = {
    left: 2,
    right: 10,
}

const EditQuiz = (props) => {
    const { editMarkerFields, bookmarks, setBookmarks, setShowEditMarker } = props;
    const editor = useRef(null);
    const [content, setContent] = useState({ ...editMarkerFields.quiz });

    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: 'Start typing...',

    }

    const addOption = () => {
        console.log("content===========", content);
        let temp = { ...content }
        if (!('options' in temp)) {
            temp['options'] = [{ rightAns: false, desc: "" }]

        }
        else {
            temp['options'].push({ rightAns: false, desc: "" })
        }
        setContent(temp);
        console.log(temp);
    }

    const modifyTextOption = (e, item, index) => {
        let tempItem = { ...item };
        tempItem['desc'] = e.target.value;
        let tempContent = { ...content }
        tempContent.options[index] = tempItem;
        setContent(tempContent);
    }

    const handleSave = () => {
        let tempBookmarks = [...bookmarks];
        let index = editMarkerFields.bookmarkIndex;
        tempBookmarks[index].quiz = content;
        setBookmarks(tempBookmarks);
        setLocalStorage("bookmarks", tempBookmarks);
        setShowEditMarker(false);
    }
    const handleChangeOptionSelect = (e, item, index) => {
        let tempItem = { ...item };
        let tempContent = { ...content }
        if(content.quizType==='Single Choice Question'){
            for(let i in tempContent.options){
                tempContent.options[i]['rightAns'] = false;
            }
        }
        tempItem['rightAns'] = e.target.checked;
        tempContent.options[index] = tempItem;
        console.log(tempContent);
        setContent(tempContent);
    }

    const handleDeleteOption = (item , index) => {
        setContent({...content, ['options']:content.options.filter((it, ind)=>{ return ind!==index})});
    }


    return (
        <div style={{ padding: '10px 8px' }}>
            <Row>
                <Col xs={xs.left} md={md.left} className={classes.fieldLabel}>
                    Description:
                </Col>
                <Col xs={xs.right} md={md.right}>
                    {/* <JoditEditor
                        ref={editor}
                        value={content.description}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={(e) => { setContent({ ...content, ['description']: e }); console.log(content); }}
                    /> */}
                    <Form.Control
                        as="textarea" rows={3}
                        placeholder="Description"
                        value={content.description}
                        style={{ height: '100px' }}
                        onChange={(e) => { setContent({ ...content, ['description']: e.target.value }); }}
                    />
                </Col>

            </Row>
            <Row style={{ marginTop: '13px', marginBottom: '13px' }}>


                <Col xs={4} md={2} style={{ margin: 'auto' }} className={classes.fieldLabel}>
                    Marks
                </Col>
                <Col xs={8} md={4} style={{ padding: '10px', display: 'inline-block' }}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control
                            type="number"
                            placeholder="Enter marks"
                            value={content.marks}
                            onChange={(e) => { setContent({ ...content, ['marks']: e.target.value }) }}
                        />
                    </Form.Group>
                </Col>
                <Col xs={4} md={2} style={{ margin: 'auto' }} className={classes.fieldLabel}>
                    Attempts
                </Col>
                <Col xs={8} md={4} style={{ padding: '10px', display: 'inline-block' }}>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control
                            type="number"
                            placeholder="Number of attempts"
                            value={content.attempts}
                            onChange={(e) => { setContent({ ...content, ['attempts']: e.target.value }); }}
                        />
                    </Form.Group>
                </Col>

                <Col xs={4} md={2} style={{ margin: 'auto' }} className={classes.fieldLabel}>
                    Type
                </Col>
                <Col xs={8} md={4} style={{ marginTop: "13px", padding: '0 10px', display: 'inline-block' }}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            value={content.quizType}
                            onChange={(e) => { 
                                let tempContent = {...content};
                                for(let i in tempContent?.options){
                                    tempContent.options[i].rightAns = false;
                                }
                                setContent({...tempContent,["quizType"]: e.target.value});
                                console.log(content);
                            }}
                        >
                            <option value={"Multiple Choice Question"}>Multiple Choice Question</option>
                            <option value={"Single Choice Question"}>Single Choice Question</option>
                            <option value={"Fixed Answer Question"}>Fixed Answer Question</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={0} md={6} ></Col>



            </Row>
            <Row >
                <Col xs={4} md={2} className={classes.fieldLabel}>
                    Options:
                </Col>
                <Col xs={8} md={md.right}>
                    {
                        content?.options?.map((item, index) => (

                            <div style={{position:'relative', marginBottom: '20px', height:'70px'}}>
                                <div className={classes.leftGrayDivQuiz}>
                                <Form.Check
                                    inline
                                    style={{margin:'auto'}}
                                    name="group1"
                                    type={content.quizType==='Single Choice Question'?'radio':'checkbox'}
                                    checked={item.rightAns}
                                    onChange={(e)=>{handleChangeOptionSelect(e, item, index)}}
                                />
                                </div>
                                <FormControl
                                    key={index}
                                    as="textarea" rows={3}
                                    placeholder="Description"
                                    style={{ height: '100%', display:'inline-block', paddingLeft:'30px' }}
                                    value={item.desc}
                                    onChange={(e) => { modifyTextOption(e, item, index) }}
                                />
                                <div className={classes.RightGrayDivQuiz}>
                                    <RiDeleteBin6Line onClick={()=>{handleDeleteOption(item, index)}}/>
                                </div>
                            </div>


                        ))
                    }
                    <Button variant='outline-primary' size='sm'
                        onClick={() => { addOption() }}
                    >
                        Add option
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col xs={xs.left} md={md.left} className={classes.fieldLabel}>
                    Hint:
                </Col>
                <Col xs={xs.right} md={md.right}>
                    <Form.Control
                        as="textarea" rows={3}
                        placeholder="Description"
                        value={content.hint}
                        style={{ height: '100px' }}
                        onChange={(e) => { setContent({ ...content, ['hint']: e.target.value }); }}
                    />
                </Col>

            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col xs={xs.left} md={md.left} className={classes.fieldLabel}>
                    Answer Description:
                </Col>
                <Col xs={xs.right} md={md.right}>
                    <Form.Control
                        as="textarea" rows={3}
                        placeholder="Answer Description"
                        value={content.answerDescription}
                        style={{ height: '100px' }}
                        onChange={(e) => { setContent({ ...content, ['answerDescription']: e.target.value }); }}
                    />
                </Col>

            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col xs={xs.left} md={md.left} className={classes.fieldLabel}>
                    Error Description:
                </Col>
                <Col xs={xs.right} md={md.right}>
                    <Form.Control
                        as="textarea" rows={3}
                        placeholder="Error Description"
                        value={content.errorDescription}
                        style={{ height: '100px' }}
                        onChange={(e) => { setContent({ ...content, ['errorDescription']: e.target.value }); }}
                    />
                </Col>

            </Row>

            <div style={{ textAlign: 'center' }}>
                <Button variant='outline-primary'
                    style={{ marginTop: '10px' }}
                    onClick={() => { handleSave() }}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}

export default EditQuiz
