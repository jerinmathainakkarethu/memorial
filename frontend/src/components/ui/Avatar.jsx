import React, { useState } from 'react'
import '../../styles/Avatar.css'

function Avatar({ name, src, size = 'md' }) {
  const [hasError, setHasError] = useState(false)
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (src && !hasError) {
    return (
      <img 
        className={`avatar avatar--${size}`} 
        src={src} 
        alt={name} 
        onError={() => setHasError(true)} 
      />
    )
  }

  return (
    <div className={`avatar avatar--${size} avatar--placeholder`} title={name}>
      {initials}
    </div>
  )
}

export default Avatar
