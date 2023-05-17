import { useState, useEffect } from 'react';
import style from './btn.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

export default function ScrollBtn({ direction }){
    const [showScrollBtn, setShowScrollBtn] = useState(window.innerWidth < '900');

    useEffect(()=>{
        window.addEventListener('resize', () => {
            if(window.innerWidth < '900')
                setShowScrollBtn(true);
            else{
                setShowScrollBtn(false);
            }
        })    
    }, [])
    
    function scrollHandler(){
        window.scrollTo({
            top: direction === 'up' ? 0 : window.innerHeight,
            behavior: 'smooth'
        })
    }

    let content = <FontAwesomeIcon icon={faAngleDown} title='Scroll Down' onClick={scrollHandler} className={`${style.btn} ${style['btn-animation']}`} style={{bottom: "20px"}}/>;
    if(direction === 'up')
        content = <FontAwesomeIcon icon={faAngleUp} title='Scroll UP' onClick={scrollHandler} className={`${style.btn} ${style['btn-animation']}`}/>;
    return <>{showScrollBtn ? content : null}</>
}