import './Account.css';
import { FiLogOut } from 'react-icons/fi'
import { BsFillCameraFill } from 'react-icons/bs'
import { InputContainer } from '../InputContainer/InputContainer'
import { signOut } from 'firebase/auth'
import { auth, getImage, updateUserDatabase } from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { BiPencil, BiTrashAlt, BiLogoGithub, BiLink } from 'react-icons/bi'
import ProjectForm from './ProjectForm/ProjectForm';
import { GlobalState } from '../Global/Context';
import { db } from '../Firebase/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const Account = (props) => {
    const [user] = useAuthState(auth);
    const uid = user?.uid;
    const navigate = useNavigate();
    const [editProject, setEditProject] = useState(null);
    const { projects, setProjects } = useContext(GlobalState)
    const imageInputRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [progress, setProgress] = useState(null);
    const [btnActive, setBtnActive] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [profileValues, setProfileValues] = useState({
        name: props?.userDetails.name || '',
        title: props?.userDetails.title || '',
        github: props?.userDetails.github || '',
        linkedin: props?.userDetails.linkedin || '',
        email: props?.userDetails.email,
        password: props?.userDetails.password,
        profileUrl: props?.userDetails.profileUrl || '',
    })

    const handleLogout = async () => {
        await signOut(auth).then(() => {
            props.setIsAuthenticated(false);
            navigate('/')
            toast.success("Successfully logged out")
        }).catch((error) => {
            console.log(error.message);
        })
    }

    const handleCamera = () => {
        imageInputRef.current.click();
    }

    const handleImageChange = (e) => {
        const image = e.target.files[0];
        getImage(image, (progres) => {
            setProgress(progres);
        },
            (err) => {
                setErrMsg(err);
            },
            (url) => {
                profileValues.profileUrl = url;
                handleSave();
                setProgress(null);
                setErrMsg("");
            }
        )
    }

    const handleInputChange = (event, property) => {
        setProfileValues((prev) => ({
            ...prev,
            [property]: event.target.value,
        }))
        setBtnActive(true);
    }

    const handleSave = async () => {
        if (profileValues.name === "") {
            setBtnActive(false);
            return;
        }
        await updateUserDatabase(profileValues, props.userDetails.uid)
        setBtnActive(false);
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
    }, []);

    const handleEditProject = (projectId) => {
        const EditableProject = projects.find((project) => project.DocId === projectId)
        console.log(EditableProject);
        setEditProject(EditableProject);
        setFormOpen(true);
    }

    const handleAddProject = () => {
        setEditProject(null);
        setFormOpen(true)
    }

    const handleDeleteProject = async (projectId) => {
        const deleteRef = doc(db, "Projects", projectId);
        await deleteDoc(deleteRef);
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
    }, [handleDeleteProject]);

    return (
        <div className='Account'>
            {formOpen ?
                <ProjectForm setEditProject={setEditProject} editProject={editProject} onClose={() => setFormOpen(false)} /> : ''
            }
            <div className="account-header">
                <p className="account-left-header">
                    Welecome <span>{props?.userDetails?.name || 'user'}</span>
                </p>
                <div onClick={() => handleLogout()} className="account-right-header">
                    <FiLogOut />
                    Logout
                </div>
            </div>
            <input type="file" ref={imageInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
            <div className="profile-section-container">
                <div className="profile-section">
                    <div className="profile-image-section">
                        <div className="profile-image">
                            <img src={profileValues.profileUrl} alt="" />
                            <BsFillCameraFill size={42} onClick={() => handleCamera()} />
                        </div>
                        <p>{progress ? progress === 100 ? "Getting image url...." : `${progress.toFixed(2)}% uploaded` : ''}</p>
                        <p style={{ color: 'red' }}>{errMsg} </p>
                    </div>
                    <div className="profile-details-section">
                        <div className="profile-details">
                            <InputContainer onChange={(e) => handleInputChange(e, 'name')} value={profileValues.name} label='Name' placeholder="Enter Your Name" />
                        </div>
                        <div className="profile-details">
                            <InputContainer onChange={(e) => handleInputChange(e, 'title')} value={profileValues.title} label='Title' placeholder="e.g. Full Stack Developer" />
                        </div>
                        <div className="profile-details">
                            <InputContainer onChange={(e) => handleInputChange(e, 'github')} value={profileValues.github} label='GitHub' placeholder="Enter Your GitHub Link" />
                        </div>
                        <div className="profile-details">
                            <InputContainer onChange={(e) => handleInputChange(e, 'linkedin')} value={profileValues.linkedin} label='LinkedIn' placeholder="Enter Your LinkedIn Link" />
                        </div>
                    </div>
                </div>
                <button className={`button ${btnActive ? 'active' : ''}`} onClick={handleSave}>Save</button>
            </div>
            {/* <hr color='black' /> */}
            <section className="projects-container">
                <div className="projects-top">
                    <h1>Your Projects</h1>
                    <button onClick={() => handleAddProject()} className="button1">Add Project</button>
                </div>
                <div className="projects">
                    {projects.map((project, index) => {
                        return (<div className="project" key={index}>
                            <div className="project-title">
                                <h2>{project?.title}</h2>
                            </div>
                            <div className="project-links">
                                <BiPencil onClick={() => handleEditProject(project.DocId)} />
                                <BiTrashAlt onClick={() => handleDeleteProject(project.DocId)} />
                                <a className='a-icon' target='_blank' href={project.github || ''}>
                                    <BiLogoGithub />
                                </a>
                                <a className='a-icon' target='_blank' href={project.link || ''}>
                                    <BiLink />
                                </a>
                            </div>
                        </div>)
                    })}
                </div>
            </section>
        </div>
    )
}

export default Account
