import React from 'react'
import './numberDisplay.scss'

interface NumberDisplayProps{
  value: number;
}

const NumberDisplay: React.FC<NumberDisplayProps>= ({value}) => {
  return (
    <div className="display-wrapper" >
      {value.toString().padStart(3,"0")}
    </div>
  )
}

export default NumberDisplay
