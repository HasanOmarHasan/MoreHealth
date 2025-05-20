import React from 'react'
import InputItem from '../../ui/InputItem'
import Button from '../../ui/Button'

export default function General() {
  return (
      <div className=' py-6  flex flex-col gap-6 justify-center items-center '>
          <h1 className='text-3xl font-semibold'>General</h1>
          <InputItem name='theme' select='Change theme' value='Dark' value2='Light' />
          <InputItem name='Language' select='Change Language' value='Arabic' value2='English' />
          <Button content='soon ...' disabled  />
    </div>
  )
}
