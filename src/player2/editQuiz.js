import { React, useRef, useState, useMemo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';

const xs = {
    left: 12,
    right: 12
}
const md = {
    left: 2,
    right: 10,
}

const EditQuiz = (props) => {
    const { bookmark } = props;
    // console.log(bookmark);
    const editor = useRef(null);

    // const [content, setContent] = useState({...bookmark.quiz});
    const [content, setContent] = useState({ ...bookmark.quiz });

    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: 'Start typing...',

    }

    const addOption = () => {
        let temp = {...content}
        if(!('options' in temp)){
            temp['options'] = [{rightAns: false, info: ""}]
            setContent(temp);
            console.log(temp);
        }
    }


    return useMemo(() => (
        <div style={{ padding: '10px 8px' }}>
            <Row>
                <Col xs={xs.left} md={md.left} style={{textAlign:'right'}}>
                    Description:
                </Col>
                <Col xs={xs.right} md={md.right}>
                    <JoditEditor
                        ref={editor}
                        value={content.description}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={(e) => { setContent({ ...content, ['description']: e });  }}
                    />
                </Col>

            </Row>
            <Row style={{ margin: '13px 0px'}}>

                <Form style={{padding:'0'}}>
                    <Col xs={5} md={2} style={{ display: 'inline-block', textAlign:'right', padding:'0 12px' }}>
                        Marks
                    </Col>
                    <Col xs={7} md={4} style={{ padding: '10px', marginTop:"13px", display: 'inline-block' }}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="number"
                                placeholder="Enter marks"
                                value={content.marks}
                                onChange={(e) => { setContent({ ...content, ['marks']: e.target.value }) }}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={5} md={2} style={{ display: 'inline-block', textAlign:'right' }}>
                        Attempts
                    </Col>
                    <Col xs={7} md={4} style={{ padding: '0 10px', marginTop:"13px", display: 'inline-block' }}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="number"
                                placeholder="Number of attempts"
                                value={content.attempts}
                                onChange={(e) => { setContent({ ...content, ['attempts']: e.target.value });console.log(content) }}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs={5} md={2} style={{ display: 'inline-block', textAlign:'right' }}>
                        Type
                    </Col>
                    <Col xs={7} md={4} style={{ marginTop:"13px", padding: '0 10px', display: 'inline-block' }}>
                        <Form.Group className="mb-3">
                            <Form.Select 
                                value={content.quizType}
                                onChange={(e) => { setContent({ ...content, ["quizType"]: e.target.value }); console.log(content);}}
                            >
                                <option value={"Multiple Choice Question"}>Multiple Choice Question</option>
                                <option value={"Single Choice Question"}>Single Choice Question</option>
                                <option value={"Fixed Answer Question"}>Fixed Answer Question</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                </Form>

            </Row>
            <Row>
                <Col xs={xs.left} md={md.left} style={{textAlign:'right'}}>
                    Options:
                </Col>
                <Col xs={xs.right} md={md.right}>
                    <Button variant='outline-primary'
                        onClick={()=>{addOption()}}
                    >
                        Add option 
                    </Button>
                </Col>

            </Row>
        </div>
    ), []
    )
}

export default EditQuiz
