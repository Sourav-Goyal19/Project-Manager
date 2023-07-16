import './ProjectOpen.css'
import { Modal } from '../Modal/Modal'
import { BiLogoGithub, BiLink } from 'react-icons/bi'

const ProjectOpen = (props) => {
    return (
        <Modal onClose={() => props.onClose()} >
            <div className="ProjectOpen">
            <p className='project-details-heading'>{props?.project?.title || 'Project Details'}</p>
            <div className="project-section">
                <div className="left-side">
                    <div className="left-side-inner">
                        <div className="image-section">
                            <img src={props?.project?.thumbnail} alt="" />
                        </div>
                        <div className="link-section">
                            <a target='_blank' href={props?.project?.github || ''}>
                                <BiLogoGithub />
                            </a>
                            <a target='_blank' href={props?.project?.link || ''}>
                                <BiLink />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="right-side">
                    <h2>{props?.project?.title || 'Title'}</h2>
                    <h3>{props?.project?.overview || 'Overview'}</h3>
                    <div className="project-points">
                        <ul>
                            {props?.project?.points.map((point, index) => {
                                return <li style={{ listStyle: `${point == '' ? 'none' : ''}` }} key={index}>{point}</li>
                            })}
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </Modal>
    )
}

export default ProjectOpen