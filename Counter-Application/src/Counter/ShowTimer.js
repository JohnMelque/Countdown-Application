import React from 'react'
import "../Style/ShowTimer.css"

const ShowTimer = ({time,date}) => {
  return (
    <div className='Wrap'>
      <div>
        <h1>{time}</h1>
        <p>{date}</p>
      </div>
      
    </div>
  )
}

export default ShowTimer