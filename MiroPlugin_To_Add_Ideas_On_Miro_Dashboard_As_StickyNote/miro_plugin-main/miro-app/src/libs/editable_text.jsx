import React, { useImperativeHandle, forwardRef } from 'react'
import _ from 'lodash'

function isEnterOrEscapeKeyEvent(event) {
    return event.key === 'Enter' || event.key === 'Escape'
}

const EditOnDblClick = forwardRef((props, _ref) => {
    const [isEditing, setisEditing] = React.useState(false)
    const [text, settext] = React.useState(null)
    const [name, setName] = React.useState(null)
    const [initialize, setInitialize] = React.useState(true)

    React.useEffect(() => {
        settext(props.content)
        setInitialize(false)
    }, [props.content])

    React.useEffect(() => {
        setName(props.content)
    }, [initialize])

    const onEditEnd = () => {
        setisEditing(false)
        props.save()
    }

    useImperativeHandle(_ref, () => ({
        getChildText: () => {
            return text
        },
        getChildName: () => {
            return name
        },
    }))

    return isEditing ? (
        <textarea
            rows={5}
            name={name}
            value={text}
            className="textarea"
            onKeyDown={(event) => {
                if (isEnterOrEscapeKeyEvent(event)) {
                    event.preventDefault()
                    event.stopPropagation()
                    onEditEnd()
                }
            }}
            onChange={_.flow((e) => e.target.value, settext)}
            onBlur={onEditEnd}
            autoFocus
        />
    ) : (
        <p
            className="select_none pen_cursor tooltip"
            onDoubleClick={() => setisEditing(true)}
        >
            {text}
            <span className="tooltiptext p-small">Double click to edit idea</span>
        </p>
    )
})

export default React.memo(EditOnDblClick)
