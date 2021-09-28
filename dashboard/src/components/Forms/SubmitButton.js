function SubmitButton() {

  function handleSubmit() {
    //  future hook to backend
    console.log("SUBMIT: build this later")
  }

  return (
    <div>
            <button onClick={handleSubmit}>Submit</button>

    </div>
  )
}

export default SubmitButton