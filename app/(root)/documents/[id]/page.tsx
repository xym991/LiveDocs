

import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import React from 'react'

const Document = () => {
  return (
    <div>
        <Header>
           <div className="flex w-fit item-center justify-center gap-2">
            <p className="document-title">Lorem ipsum dolor sit.</p>
           </div>
        </Header>
      <Editor />
    </div>
  )
}

export default Document
