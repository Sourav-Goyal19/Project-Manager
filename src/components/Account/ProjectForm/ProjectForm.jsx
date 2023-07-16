import { Modal } from '../../Modal/Modal'
import { InputContainer } from '../../InputContainer/InputContainer'
import './ProjectForm.css';
import { useState, useRef, useEffect, useContext } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { auth, getImage, AddProjects, updateProject, db } from '../../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs } from 'firebase/firestore';
import { GlobalState } from '../../Global/Context';

const ProjectForm = (props) => {
    const { projects, setProjects } = useContext(GlobalState)
    const [formValues, setFormValues] = useState({
        thumbnail: props?.editProject?.thumbnail || 'https://image.pngaaa.com/781/4773781-middle.png',
        github: props?.editProject?.github || '',
        link: props?.editProject?.link || '',
        title: props?.editProject?.title || '',
        overview: props?.editProject?.overview || '',
        points: props?.editProject?.points || ["", ''],
    })
    const [progress, setProgress] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [formValidationError, setFormValidationError] = useState(null);
    const [user] = useAuthState(auth);
    const uid = user?.uid;
    const imageRef = useRef();

    const handlePointUpdate = (value, index) => {
        const tempPoints = [...formValues.points];
        tempPoints[index] = value;
        setFormValues({ ...formValues, points: tempPoints });
    }

    const handleAddPoint = () => {
        if (formValues.points.length >= 3) {
            toast.warning("Max 3 points are allowed")
            return
        }
        setFormValues({ ...formValues, points: [...formValues.points, ""] });
    }

    const handleRemovePoint = () => {
        const tempPoints = [...formValues.points]
        tempPoints.pop();
        setFormValues({ ...formValues, points: tempPoints });
    };

    const handleImageChange = (e) => {
        const img = e.target.files[0];
        getImage(img, (progress) => {
            if (progress) {
                setErrMsg(null)
            }
            setProgress(progress);
        },
            (err) => {
                setErrMsg(err);
            },
            (url) => {
                formValues.thumbnail = url;
                setProgress(null);
                setErrMsg(null);
            }
        )
    }

    const handleImage = () => {
        imageRef.current.click();
    }

    const handleFormSubmit = () => {
        if (formValues.thumbnail === "https://image.pngaaa.com/781/4773781-middle.png") {
            setFormValidationError("Thumbnail is required");
            return;
        }
        if (formValues.title === "") {
            setFormValidationError("Project Title is required");
            return;
        }
        const tempProject = { ...formValues };
        AddProjects(tempProject, uid)
        props.onClose();
    }

    const handleFormEdit = () => {
        updateProject(formValues, props?.editProject?.DocId, uid);
        props.setEditProject(null);
        props.onClose();
    }

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsSnapshot = await getDocs(collection(db, 'Projects'));
                const projectsData = projectsSnapshot.docs.map((doc) => doc.data());
                const userProjects = projectsData.filter((project) => project.uid === uid);
                setProjects(userProjects);
            } catch (error) {
                console.error('Error fetching projects from Firebase:', error);
            }
        };
        fetchProjects();
    }, [projects]);

    return (
        <Modal onClose={() => props.onClose()}>
            <div className="ProjectForm">
                <input type="file" ref={imageRef} onChange={(e) => handleImageChange(e)} style={{ display: 'none' }} />
                <div className="project-form-header">
                    <div className="left-section">
                        <div className="thumbnail">
                            <img src={formValues.thumbnail} onClick={handleImage} alt="" />
                            <p>{progress ? progress === 100 ? "Getting image url...." : `${progress.toFixed(2)}% uploaded` : ''}</p>
                            {errMsg != null && <p style={{ color: 'red', fontWeight: 'bold' }}>{errMsg} </p>}

                        </div>
                        <InputContainer placeholder="Enter your repository link" onChange={(e) => setFormValues((prev) => ({ ...prev, github: e.target.value }))} value={formValues.github} label="GitHub" />
                        <InputContainer placeholder="Enter deployed link" onChange={(e) => setFormValues((prev) => ({ ...prev, link: e.target.value }))} value={formValues.link} label="Deployed Link" />
                    </div>
                    <div className="right-section">
                        <InputContainer placeholder="Enter Project Title" onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))} value={formValues.title} label="Project Title" />
                        <InputContainer placeholder="Enter Project Overview" onChange={(e) => setFormValues((prev) => ({ ...prev, overview: e.target.value }))} value={formValues.overview} label="Project Overview" />
                        <div className="project-description">
                            <div className="description-top">
                                <h4>Project Description</h4>
                                <p onClick={() => handleAddPoint()}>+Add Point</p>
                            </div>
                            <div className="description">
                                {formValues.points.map((item, index) => {
                                    return (<div className='points-container' key={index}>
                                        <div className="point">
                                            <InputContainer value={item} onChange={(e) => handlePointUpdate(e.target.value, index)} placeholder="Type something here...." />
                                        </div>
                                        {index > 1 && <RxCross2 onClick={() => handleRemovePoint()} size={25} cursor={'pointer'} />}
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="project-form-footer">
                    <p onClick={() => props.onClose()}>Cancel</p>
                    {props?.editProject ?
                        <button onClick={() => handleFormEdit()} className="button1">Save</button> :
                        <button onClick={() => handleFormSubmit()} className="button1">Submit</button>
                    }
                </div>
                <div className="form-validation-err">
                    <p>{formValidationError}</p>
                </div>
            </div>
        </Modal>
    )
}

export default ProjectForm;
