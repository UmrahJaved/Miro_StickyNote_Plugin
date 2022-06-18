import React from "react"

export const getFrame = async (title) => {
    let frame = await miro.board.widgets.get({ type: "FRAME", title: title })
    if (frame.length == 0) {
        let x = 0
        if (title == "Out-of-the-box") {
            x = 1100
        }
        frame = await miro.board.widgets.create({ type: "FRAME", title: title, width: 1000, height: 1000, x: x })
    }
    return frame[0]
}

export const createWidget = async (widget_list) => {
    console.log("createWidget...");

    let widget = await miro.board.widgets.create(widget_list)
    await miro.showNotification("Sticker generated")

    const widgets_id = widget.map((item) => item.id);
    await miro.board.selection.selectWidgets(widgets_id)

    miro.board.viewport.zoomToObject(widget)
    return widget
}

export const generateWidget = (text_content, x, y, color = "#000") => {
    return {
        type: "sticker",
        text: text_content,
        x: x,
        y: y,
        style: {
            fillColor: color,
        },
    }
}

export const generateTag = (id, title = "GPT", color = '#F24726',) => {
    return miro.board.tags.create({ title, color, widgetIds: id })
}

export const createShape = async (x, y, color = "#000") => {
    const shape = await miro.board.widgets.create({
        type: "shape",
        x: x,
        y: y,
        style: {
            fillColor: color,
        },
    });
    console.log(shape[0]);
    return shape
}

export const createFrame = async () => {
    const frame = await miro.board.widgets.create({
        type: "frame",
        title: 'This frame ratio is 16:9',
        style: {
            fillColor: '#ffffff',
        },
        x: 0, // Default value: horizontal center of the board
        y: 0, // Default value: vertical center of the board
        width: 800,
        height: 450,
    });
    return frame
}

export const WidgetList = ({ widgets }) => {
    return (
        <>
            <p>widgets</p>
            <ul>
                {widgets.map((element, idx) => (
                    <li key={idx + "__" + "widget"}><pre>{JSON.stringify(element, null, 2)}</pre></li>
                ))}
            </ul>
        </>
    )
}

export const getIntersectValue = (obj1, obj2) => {
    const k2 = Object.keys(obj2)
    const result = []
    k2.filter(function (k) {
        if (obj1[k]) {
            result.push(obj2[k])
        }
    });
    return result
}
