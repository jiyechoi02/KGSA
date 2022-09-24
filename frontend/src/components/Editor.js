import {useReducer, useState, useEffect} from 'react';
import {Form,Row,Col, ListGroup} from 'react-bootstrap';
import '../styles.css';
import "bootstrap/dist/css/bootstrap.min.css";
import FileUploader from './FileUploader';
import {CgCloseR} from 'react-icons/cg';
import MyModal from './MyModal';
import { CustomContainer } from './CustomContainer';
import {StyledButton as Button} from './Styles';
import { getUser } from '../services/LoginHelper';
import { useHistory } from 'react-router-dom';
import { reducer, initialData as initReducerData} from '../services/AlertHelper';
import {RiDeleteBin2Line,RiCheckboxMultipleBlankLine} from 'react-icons/ri';

import MySpinner from './MySpinner';
import styled from 'styled-components';

const StyledP = styled.p`
    color : black;
    font-size : 13pt;
    &:hover{
        color : red;
    }
`

const user = getUser();
const Editor = ({price, address,onSubmit})=>{
    const history = useHistory(); 
    const [uploadedFiles, setUploadedFiles] = useState([]); // set files 

    const [inputKey, setInputKey] = useState("formKey"); // input key for form
    const [inputFileKey, setInputFileKey] = useState("formKey"); // input key for form

    const [alert, setAlert] = useState(false); // alert 
    const [data, setData] = useState({
        username : user.username
    }); // data if it is editing, initial data is not null.
    const [{success,fail,loading},dispatch] = useReducer(reducer,initReducerData);
    
    const handleCancel = ()=>{
        history.goBack();
    }

    const handleFileChange = (e)=>{
        const files = e.target.files
        if(files.length> 10){
            console.log("Too many files") // replace it to Alert 
            setInputFileKey(new Date()) //set a random key to reset the file form 
        }

        for(let i =0; i<files.length; i++){
            setUploadedFiles(prev=> [...prev, files[i]])
        }

        setInputFileKey(new Date())
    }


    const renderUploadedFilesList = ()=>{
        if(uploadedFiles){
            const list = uploadedFiles.map((item,i)=>{
                return (
                    <li key={i} style={{fontSize:'10pt'}}>
                        <Row>
                            <Col xs={2}>
                                <img src={URL.createObjectURL(item)} width="50px" height="50px"/>
                            </Col>
                            <Col xs={6}>
                                {item.name}
                            </Col>
                            <Col xs={3}>
                                <StyledP onClick={()=>handleDeleteUploadFiles(i)}><RiDeleteBin2Line/></StyledP>
                            </Col>
                        </Row>
                    </li>
                )
            })

            return list
        }
    }

    const handleDeleteUploadFiles = (index)=>{
        setUploadedFiles(uploadedFiles.filter((item,i)=> i!== index));
    }

    const handleChange = (e) =>{
        // var value = e.target.name =="price"? Number(e.target.value):e.target.value

        setData({
            ...data,[e.target.name]:e.target.value
        })
    }
    /* ================================= */

    const handleLargeFilesAlertClose =()=>{
        setAlert(false)
        setInputFileKey(new Date())
    }

    const handleSubmit = async (e)=>{

        dispatch({type:"loading", value : true})
        e.preventDefault();
        var formData = new FormData(); // create formdate to append data
        //Append Data & files
        for(let i =0; i<Object.keys(data).length; i++){
            const key = Object.keys(data)[i]
            formData.append(key,data[key]);
        }

        for(let i =0; i<uploadedFiles.length; i++){
            formData.append("files", uploadedFiles[i]);
        }
        
        onSubmit(formData,dispatch)
        setInputFileKey(new Date())
        setInputKey(new Date())
    }

   return (
            <div>
                <ListGroup>
                    <ListGroup.Item variant="secondary">
                        <Row>
                            <Col sm={3}>
                                <Button onClick={handleCancel}>
                                    Back
                                </Button>
                            </Col>  
                        </Row>
                            <Form className="editor-form" onSubmit={handleSubmit} key={inputKey}>
                            {user.admin && <Form.Check 
                                className="editor-form-control" 
                                type='checkbox'
                                onChange={handleChange}
                                name='notice'
                                label='공지사항'
                                value={true}
                            />}
                            <Form.Control 
                                className="editor-form-control" 
                                type="text" 
                                onChange={handleChange} 
                                placeholder="Title*"
                                name="title" 
                                required 
                            />
                            {price &&
                                <Form.Control 
                                    className="editor-form-control"  
                                    type="number" 
                                    placeholder="Price"
                                    onChange={handleChange} 
                                    name="price" 
                                /> }
                            {address &&
                                <Form.Control 
                                    className="editor-form-control"  
                                    type="text" 
                                    onChange={handleChange} 
                                    placeholder="Address"
                                    name="address" 
                                /> }
                            <Form.Control 
                                className="editor-form-control" 
                                as="textarea" 
                                placeholder="Write Something.. Kindly!*"
                                onChange={handleChange} 
                                style={{minHeight:'300px'}} 
                                row={100} 
                                name="contents" 
                                required
                            />
                            {/* <Form.Control
                                className="editor-form-control" 
                                type="file"
                                key={inputFilesKey}
                                multiple
                                accept=""
                                onChange={handleFileChange}
                            />         */}
                            <Form.Control className="editor-form-control"  type="file" multiple onChange={handleFileChange} key={inputFileKey} accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"/>  
                            {uploadedFiles && 
                                <ul style={{fontSize:'10pt'}}>
                                    {renderUploadedFilesList()}
                                </ul>
                            }
                            <Row className="justify-content-end">                               
                                <Col sm={2}>
                                    <Button type="submit">
                                        Submit
                                    </Button>                                    
                                </Col>
                            </Row>       
                        </Form>
                    </ListGroup.Item>
                </ListGroup>
                <MyModal show={success} handleOnClick={()=>dispatch({type:'success', value:false})} variant='success'>
                    <p>Completed your request successfully!</p>
                </MyModal>
                <MyModal show={fail} handleOnClick={()=>dispatch({type:'fail', value:false})} variant='danger'>
                    <p>Oops! Sorry, something is wrong..</p>
                    <p>Please try again..</p>
                </MyModal>
                <MyModal show={loading} disableClose={false}>
                    <MySpinner/>
                </MyModal>
                <MyModal show={alert} handleOnClick={handleLargeFilesAlertClose} variant='danger'>
                    <p>Files are too large or too many</p>
                    <p>Limit Size is 500MB and 5 files</p>
                </MyModal>
            </div>
        )
}

export default Editor;