import { BsArrowRight } from 'react-icons/bs'
import './Home.css';
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../Global/Context'
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProjectOpen from '../ProjectOpen/ProjectOpen';

const Home = ({ isAuthenticated }) => {
    const [user] = useAuthState(auth);
    const [projectOpen, setProjectOpen] = useState(false);
    const [openedProject, setOpenedProject] = useState(null);
    const uid = user?.uid;
    const { projects, setProjects } = useContext(GlobalState);
    const navigate = useNavigate();
    const handleOpenProject = (project) => {
        setOpenedProject(project);
        setProjectOpen(true)
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

    return (
        <div className='Home'>
            {projectOpen && <ProjectOpen project={openedProject} onClose={() => { setProjectOpen(false); setOpenedProject(null) }} />}
            <div className="header">
                <div className="left-header">
                    <div className="heading">
                        <h1>Projects Fair</h1>
                    </div>
                    <div className="subHeading">
                        One stop destionation for all software developers projects
                    </div>
                    <button onClick={() => isAuthenticated ? navigate('/account') : navigate('/login')}>{isAuthenticated ? 'Manage Your Projects' : 'Get Started'} <BsArrowRight size={28} /> </button>
                </div>
                <div className="right-header">
                    <img src="/assets/programmer.png" alt="" />
                </div>
            </div>
            {isAuthenticated && projects.length > 0 && <div className='homepage-projects-container'>
                <h1>All Projects</h1>
                <div className="homepage-projects">
                    {projects.map((project, index) => {
                        return (
                            <div onClick={() => handleOpenProject(project)} key={index} className="homepage-project">
                                <div className="homepage-project-header">
                                    <img src={project.thumbnail || ''} />
                                </div>
                                <div className="homepage-project-footer">
                                    {project.title || ''}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>}
        </div>
    )
}

export default Home;