import * as React from 'react'
import ReactDOM from 'react-dom'
import {
    generateWidget,
    getFrame,
    createWidget,
    WidgetList,
    generateTag,
    getIntersectValue,
} from './libs/utils'
import { Checkbox } from './libs/checkbox'
import EditOnDblClick from './libs/editable_text'

function App() {
    const [widgets, setSelectedWidget] = React.useState(null)
    const [question, setSelectedQuestion] = React.useState('')
    const [count_idea, setCountIdea] = React.useState(4)
    // # BAD BAD code ⚠️
    const [raw_idea_dict, setRawIdeaDict] = React.useState(null)
    const [new_idea_dict, setNewIdeaDict] = React.useState(null)

    const [type_idea, setTypeIdea] = React.useState(true)

    const [loading, setLoading] = React.useState(false)
    const [loadingPost, setLoadingPost] = React.useState(false)

    const fetch_gpt = async (prompt, counts, type_idea) => {
        setRawIdeaDict(null)
        try {
            setLoading(true)
            let type_of_idea = type_idea ? 'Out-of-the-box' : 'conventional'
            let output_prompt = `${prompt || "How may we improve employees' job satisfaction?"
                } Give me ${counts} ${type_of_idea} ${counts > 1 ? 'ideas' : 'idea'
                }.\n\n###\n\n`

            const params = {
                // "model": "davinci:ft-personal:team-tensorflow-2022-04-27-10-04-53",
                model: 'text-davinci-002',
                prompt: output_prompt,
                max_tokens: 512,
                temperature: 0.7,
                frequency_penalty: 1,
                presence_penalty: 1,
                top_p: 1,
                stop: ['$$$'],
            }

            const headers = {
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            }
            let response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(params),
            })
            let data = await response.json()

            let idea_list = data?.choices[0].text
                .split(/\r?\n/)
                .filter((v) => v != '')
                .map((v) => v.replace(/^\s?\d+\.\s/, ''))
            console.log('idea_list', idea_list)

            setRawIdeaDict(
                idea_list.reduce((accumulator, value) => {
                    return { ...accumulator, [value]: true }
                }, {})
            )
            setNewIdeaDict(
                idea_list.reduce((accumulator, value) => {
                    return { ...accumulator, [value]: value }
                }, {})
            )
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    let getSelectedWidget = async () => {
        const w = await miro.board.selection.get()
        w && setSelectedWidget(w)

        if ((w && w[0]?.type == 'TEXT') || ('STICKER' && w[0]?.plainText)) {
            setSelectedQuestion(w[0].plainText)
        }
    }

    React.useEffect(() => {
        getSelectedWidget()
    }, [])

    const handleChange = (e) => {
        setRawIdeaDict({ ...raw_idea_dict, [e.target.name]: e.target.checked })
    }

    const childStateRef = React.useRef()

    const getChildState = () => {
        const new_idea_input = childStateRef.current.getChildText()
        const key = childStateRef.current.getChildName()
        setNewIdeaDict({ ...new_idea_dict, [key]: new_idea_input })
    }

    const handlePostIt = async () => {
        const merged_raw_with_new = getIntersectValue(raw_idea_dict, new_idea_dict)

        setLoadingPost(true)
        let widget_list = []
        const frame_title = type_idea ? 'Out-of-the-box' : 'conventional'
        let frame = await getFrame(frame_title)

        let { x, y, width, height } = frame

        merged_raw_with_new.map((text) => {
            let widget = generateWidget(text, x, y)
            console.log('widget.... ', widget)
            widget_list.push(widget)
        })
        const created_widget = await createWidget(widget_list)

        // generateTag(created_widget)
        // let tags = await miro.board.tags.get({ title: 'hello' })
        // console.log(tags[0].widgetIds)

        console.log(created_widget)
        setRawIdeaDict(null)
        setLoadingPost(false)
    }

    return (
        <div className="grid">
            <div className="cs1 ce12">
                <div className="flex space_between gap_small mb_8">
                    <label htmlFor="question" className="label">
                        Big question
                    </label>
                    <div className="flex align_center">
                        <div className="flex" onClick={() => setTypeIdea(!type_idea)}>
                            <label
                                className={`pointer label ${type_idea ? 'label-info' : 'label-warning'
                                    }`}
                            >
                                <span>{type_idea ? 'Out-of-the-box' : 'conventional'}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <textarea
                    rows="3"
                    value={question}
                    required
                    placeholder="How might we..."
                    className="textarea"
                    onChange={(e) => setSelectedQuestion(e.target.value)}
                />
            </div>

            <div className="cs1 ce12">
                <label htmlFor="count_idea" className="label cs1">
                    How many ideas?{' '}
                </label>
                <div className="grid mb_16">
                    <input
                        name="count_idea"
                        id="count_idea"
                        type="range"
                        value={count_idea}
                        required
                        min={2}
                        max="10"
                        className="input cs1 ce10"
                        onChange={(e) => setCountIdea(e.target.value)}
                    />
                    <input
                        className="input cs11 ce12 text_center"
                        style={{ padding: '1px' }}
                        disabled
                        value={count_idea}
                    />
                </div>
            </div>
            {/* {widgets?.length > 0 && <WidgetList widgets={widgets} />} */}
            <button
                type="submit"
                onClick={() => fetch_gpt(question, count_idea, type_idea)}
                disabled={loading ? true : false}
                className={`button uppercase flex flex_center align_center cs1 ce6 ${loading ? 'button-primary button-loading' : 'button-primary'
                    }`}
            >
                fetch ideas
            </button>
            <hr className="hr cs1 ce12" />
            <div className="cs1 ce12">
                <div className="container mb_16">
                    {raw_idea_dict &&
                        Object.entries(raw_idea_dict).map(
                            ([text_content, is_checked], idx) => (
                                <>
                                    <div
                                        key={idx}
                                        className="flex align_baseline gap_small mb_16"
                                    >
                                        <Checkbox
                                            name={text_content}
                                            checked={is_checked}
                                            onChange={handleChange}
                                        />
                                        <EditOnDblClick
                                            ref={childStateRef}
                                            content={new_idea_dict && new_idea_dict[text_content]}
                                            save={getChildState}
                                        />
                                    </div>
                                    <hr className="hr" />
                                </>
                            )
                        )}
                </div>
                <button
                    type="submit"
                    className={`button uppercase flex flex_center align_center ${loadingPost ? 'button-primary button-loading' : 'button-primary'
                        }`}
                    onClick={handlePostIt}
                    disabled={!raw_idea_dict || loadingPost}
                >
                    Post-it
                </button>
            </div>
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'))
