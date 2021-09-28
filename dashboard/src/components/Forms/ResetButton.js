// TODO: Can this interaction be isolated to the current form only

function ResetButton(props) {
    function handleReset() {
        // setForm('')
        Array.from(document.querySelectorAll(props.field)).forEach(
            (input) => (input.value = '')
        )

        // const resetState = () => {
        //     () => {
        //         props.action
        //     }
        // }
    }

    return (
        <div>
            <button onClick={handleReset}>Cancel</button>
        </div>
    )
}

export default ResetButton
