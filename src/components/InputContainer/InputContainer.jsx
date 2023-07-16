import { useEffect, useRef, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import './InputContainer.css'

export const InputContainer = (props) => {
    const [isVisible, setIsVisible] = useState(false)
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.focus();
    }, [isVisible])

    useEffect(() => {
        inputRef.current.blur();
    }, [])

    return (
        <div className='IC'>
            <label>{props.label}</label>
            <div className="input-field">
                <input ref={inputRef} onChange={(e) => props.onChange(e)} type={props.password ? (isVisible ? 'text' : 'password') : props.type} placeholder={props.placeholder} defaultValue={props.value} />
                {props.password && <div className="icon" onClick={() => setIsVisible(!isVisible)}>
                    {isVisible ? <AiOutlineEye cursor={'pointer'} size={20} /> : <AiOutlineEyeInvisible cursor={'pointer'} size={20} />}
                </div>}
            </div>
        </div>
    )
}
