import React from 'react'
import {Image} from 'react-bootstrap'
import empty from '../img/empty.svg'
import './nothingtoshow.css'
function NothingToShow() {
    return (
        <div className="nothing-to-show">
            <Image src={empty} fluid />
            <h6>Nothing to show</h6>
        </div>
    )
}

export default NothingToShow
