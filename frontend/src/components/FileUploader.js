import {useState} from 'react';
import {Form, Row,Col} from 'react-bootstrap';
import {CgCloseR} from 'react-icons/cg';
import styled from 'styled-components';
import {RiDeleteBin2Line,RiCheckboxMultipleBlankLine} from 'react-icons/ri';

const StyledP = styled.p`
    color : black;
    font-size : 13pt;
    &:hover{
        color : red;
    }
`

const FileUploader = (selectedFile,setSelectedFile)=>{
    const uploadedFiles = selectedFile.selectedFile
    const setUploadedFiles = selectedFile.setSelectedFile
    // const {uploadedFiles, setUploadedFiles} = selectedFile
    const [ inputFileKey, setInputFileKey] = useState("inputFileKey");
    const [alert, setAlert] = useState(false); // alert 
    
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

    const handleLargeFilesAlertClose =()=>{
        setAlert(false)
        setInputFileKey(new Date())
    }
    
    const renderUploadedFilesList = ()=>{
        const list = uploadedFiles.map((item,i)=>{
            return (
                <li key={i} style={{fontSize:'10pt'}}>
                    <Row>
                        <Col xs={10}>
                            {item.name? item.name : item}
                        </Col>
                        <Col xs={2}>
                            <StyledP onClick={()=>handleDeleteUploadFiles(i)}><RiDeleteBin2Line/></StyledP>
                        </Col>
                    </Row>
                </li>
            )
        })

        return list
    }

    const handleDeleteUploadFiles = (index)=>{
        setUploadedFiles(uploadedFiles.filter((item,i)=> i!== index));
    }
    
    return(
        <>
            <Form.Control className="editor-form-control"  type="file" multiple onChange={handleFileChange} key={inputFileKey} accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"/>  
            {uploadedFiles && 
                <ul>
                    {renderUploadedFilesList()}
                </ul>
            }
        </>
    )  
}

export default FileUploader;
