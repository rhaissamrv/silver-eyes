import { useField } from 'formik'

function TextInput({ label, ...props }) {
    const [field, meta] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name}>
                {label}
                <input className="text-input" {...field} {...props} />
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

export default TextInput
