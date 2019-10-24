import React, { useState } from 'react'
import Editor from './EditorUI.js'
import {
  convertFromRaw,
  convertToRaw,
  EditorState
} from 'draft-js'
import PropTypes from 'prop-types'
import { encode, decode } from 'base-64'

const stringifyAndEncode = {
  encode: (objectToBeEncoded) => encode(JSON.stringify(objectToBeEncoded)),
  decode: (fromEncodedString) => JSON.parse(decode(fromEncodedString))
}

const TextEditor = (props) => {
  const initState = props.initialContentState || EditorState.createEmpty(Editor.getDecorators())
  const [editorState, setEditorState] = useState(initState)

  React.useEffect(() => {
    setEditorState(props.initialContentState)
  }, [props.initialContentState])

  const onChange = (editorState) => {
    setEditorState(editorState)
    props.onChange && props.onChange(editorState)
  }

  return (
    <Editor
      editorState={editorState}
      onChange={onChange}
      readOnly={props.readOnly} />
  )
}

TextEditor.hydrate = (encodedEditorStateString) =>
  EditorState.createWithContent(
    convertFromRaw(stringifyAndEncode.decode(encodedEditorStateString)),
    Editor.getDecorators()
  )

TextEditor.stringify = (editorState) =>
  stringifyAndEncode
    .encode(convertToRaw(editorState.getCurrentContent()))

TextEditor.emptyState = () => EditorState.createEmpty(Editor.getDecorators())

TextEditor.propTypes = {
  initialContentState: PropTypes.any,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool
}

export default TextEditor
